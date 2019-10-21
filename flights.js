var builder = require('botbuilder');
var Store = require('./stores');

module.exports = [
    // Source
    function (session) {
        session.send('Welcome to the Flight finder!');
        builder.Prompts.text(session, 'Please enter your Source.');
    },
    function (session, results, next) {
        session.dialogData.source = results.response;

        next();
    },

    // Check-in // Destination
    function (session) {
        builder.Prompts.text(session, 'Please enter your Destination');
    },
    function (session, results, next) {
        session.dialogData.destination = results.response;
        next();
    },

    // Nights // Date
    function (session) {
        builder.Prompts.time(session, 'Enter your Date.');
    },
    function (session, results, next) {
        session.dialogData.date = results.response.resolution.start;
        next();
    },

    // Search...
    function (session) {
        var source = session.dialogData.source;
        var destination = session.dialogData.destination;
        var date = session.dialogData.date;
        session.send('Ok. Searching for Flights from %s to %s on %s', source, destination, date);

        // Async search
        Store
            .searchFlights(source, destination, date)
            .then(function (flights) {
                // Results
                session.send('I found in total %d Flights for your dates:', flights.length);

                var message = new builder.Message()
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(flights.map(hotelAsAttachment));

                session.send(message);

                // End
                session.endDialog();
            });
    }
];

// Helpers
function hotelAsAttachment(flights) {
    return new builder.HeroCard()
        .title(flights.name)
        .subtitle('%d stars. %d reviews. From $%d per night.', flights.rating, flights.numberOfReviews, flights.priceStarting)
        .images([new builder.CardImage().url(flights.image)])
        .buttons([
            new builder.CardAction()
                .title('More details')
                .type('openUrl')
                .value('https://www.google.com/search?q=flights+in+' + encodeURIComponent(flights.location))
        ]);
}

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};
// var restify = require('restify'); 
// var builder = require('botbuilder');  
// // Setup Restify Server 
// var server = restify.createServer(); 
// server.listen(process.env.port || process.env.PORT || 3978, 
// function () {    
//     console.log('%s listening to %s', server.name, server.url);  
// });  
// // chat connector for communicating with the Bot Framework Service 
// var connector = new builder.ChatConnector({     
//     appId: process.env.MICROSOFT_APP_ID,     
//     appPassword: process.env.MICROSOFT_APP_PASSWORD
// });
// // Listen for messages from users  
// server.post('/api/messages', connector.listen());  
// // Receive messages from the user and respond by echoing each message back (prefixed with 'You said:') 
// var bot = new builder.UniversalBot(connector, function (session) {     
// session.send("You said: %s", session.message.text); 
// });



// 'use strict';

// let builder = require('botbuilder');

// // Create console connector and listen to the command prompt/terminal/console for messages 
// let connector = new builder.ConsoleConnector().listen();

// // Create your bot with a function to receive messages from the user
// let bot = new builder.UniversalBot(connector, function (session) {
// 	//Send a message back to the user via command prompt/terminal/console
//     session.send("Hello World!");
// });



// 'use strict';

// let restify = require('restify')
// //Include the library botbuilder
// let builder = require('botbuilder')

// //Create the server
// let server = restify.createServer()

// //Run the server continuously
// server.listen(3978, function(){
// 	console.log('The server is running on ', server.name, server.url)
// })






'use strict';

let restify = require('restify')
//Include the library botbuilder
let builder = require('botbuilder')

//Create the server
let server = restify.createServer()

//Run the server continuously
server.listen(3978, function () {
    console.log('The server is running on ', server.name, server.url)
})

// Create chat connector with the default id and password
let connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
})

//When the server posts to /api/messages, make the connector listen to it.
server.post('/api/messages', connector.listen())

function createAnimationCard(session) {
    return new builder.AnimationCard(session)
        .media([{
            profile: 'gif',
            url: 'https://media0.giphy.com/media/aWRWTF27ilPzy/200.gif'
        }])
}
// var bot0 = new builder.UniversalBot(connector, [
//     function (session) {
//         builder.Prompts.text(session, 'Hi! What is your name?');
//     },
//     function (session, results) {
//         session.endDialog(`Hello ${results.response}!`);
//     },
//     function (session, results) {
//         session.dialogData.reservationDate = builder.EntityRecognizer.resolveTime([results.response]);
//         builder.Prompts.text(session, "How many people are in your party?");
//     }
// ]);

var inMemoryStorage = new builder.MemoryBotStorage();

// This is a dinner reservation bot that uses a waterfall technique to prompt users for input.
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Welcome to the 'dinner' reservation.");
        builder.Prompts.time(session, "Please provide a reservation date and time (e.g.: June 6th at 5pm)");
    },
    function (session, results) {
        session.dialogData.reservationDate = builder.EntityRecognizer.resolveTime([results.response]);
        builder.Prompts.text(session, "How many people are in your party?");
    },
    
    function (session, results) {
        session.dialogData.partySize = results.response;
        builder.Prompts.text(session, "Whose name will this reservation be under?");
    },
    function (session, results) {
        session.dialogData.reservationName = results.response;

        // Process request and display reservation details
        session.send(`Reservation confirmed. Reservation details: <br/>Date/Time: ${session.dialogData.reservationDate} <br/>Party size: ${session.dialogData.partySize} <br/>Reservation name: ${session.dialogData.reservationName}`);
        session.endDialog();
    }
]).set('storage', inMemoryStorage);



// let bot = new builder.UniversalBot(connector, (session) => {
//     let name = session.message.user.name
//     let message = session.message.text
//     session.send(name + " send " + message);
//     var msg = new builder.Message(session).addAttachment(createAnimationCard(session));
//     session.send(msg)
// })

// var bot1 = new builder.UniversalBot(connector, function (session) {
//     session.send("Hi... We sell shirts. Say 'show shirts' to see our products.");
// });

// // Add dialog to return list of shirts available
// bot1.dialog('showShirts', function (session) {
//     var msg = new builder.Message(session);
//     msg.attachmentLayout(builder.AttachmentLayout.carousel)
//     msg.attachments([
//         new builder.HeroCard(session)
//             .title("Classic White T-Shirt")
//             .subtitle("100% Soft and Luxurious Cotton")
//             .text("Price is $25 and carried in sizes (S, M, L, and XL)")
//             .images([builder.CardImage.create(session, 'http://petersapparel.parseapp.com/img/whiteshirt.png')])
//             .buttons([
//                 builder.CardAction.imBack(session, "buy classic white t-shirt", "Buy")
//             ]),
//         new builder.HeroCard(session)
//             .title("Classic Gray T-Shirt")
//             .subtitle("100% Soft and Luxurious Cotton")
//             .text("Price is $25 and carried in sizes (S, M, L, and XL)")
//             .images([builder.CardImage.create(session, 'http://petersapparel.parseapp.com/img/grayshirt.png')])
//             .buttons([
//                 builder.CardAction.imBack(session, "buy classic gray t-shirt", "Buy")
//             ])
//     ]);
//     session.send(msg).endDialog();
// }).triggerAction({ matches: /^(show|list)/i });

var header = {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '6fb7959510a84e389985fd3343705e6b'
}
function sendGetSentimentRequest(message) {
    var options = {
        method: 'POST',
        uri:
            'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment',
        body: {
            documents: [{ id: '1', language: 'en', text: message }]
        },
        json: true, // Automatically stringifies the body to JSON
        headers: header
    };
    return rp(options)
        ;
}
function getGiphy(searchString) {
    var options = {
        method: 'GET',
        uri: 'https://api.giphy.com/v1/gifs/translate',
        qs: {
            s: searchString,
            api_key: '9n8AIaWULVu37sA1k8eE38IwnCCjmXP9'
        }
    }
    return rp(options)
        ;
}
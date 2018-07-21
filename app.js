const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
var server = require('http').createServer(app);
var admin = require('firebase-admin');
var serviceAccount = process.env.SERVICEACCOUNT
const PORT = process.env.PORT || 3000;
var admin = require('firebase-admin');
var io = require('socket.io')(server);

const config = {
    "apiKey": process.env.FIREBASEAPIKEY,
    "authDomain": process.env.AUTHDOMAIN,
    "databaseURL": process.env.DATABASEURL,
    "projectId": process.env.PROJECTID,
    "storageBucket": process.env.STORAGEBUCKET,
    "messagingSenderId": process.env.MESSAGINGSENDERID,
    "serviceAccount": process.env.SERVICEACCOUNT 
  }
// var fbWorker = require('./script');


// config = {
//     "apiKey": process.env.FIREBASEAPIKEY,
//     "authDomain": process.env.AUTHDOMAIN,
//     "databaseURL": process.env.DATABASEURL,
//     "projectId": process.env.PROJECTID,
//     "storageBucket": process.env.STORAGEBUCKET,
//     "messagingSenderId": process.env.MESSAGINGSENDERID,
//     "serviceAccount": process.env.SERVICEACCOUNT 
//   }


app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Node server live!");
});

app.get('/dashboard', (req, res) => {

    res.sendFile('index.html',{root: __dirname});
    
});



// app.get('/api/getLogs', (req, res) => {
//     var db = admin.database();
//     var ref = db.ref("logs");
//     console.log("connecting to firebase!");
//     ref.on("value", function(snapshot) {
//         console.log("SNAPSHOT ->  ");
//         console.log(JSON.stringify(snapshot.val()))
//         // data = snapshot.val()
//         // console.log("object.keys -> ")
//         // console.log(Object.keys(data))
//         // console.log("starting for each key loop -> ")
//         // Object.keys(data).forEach(function (key) {
//         //     console.log("data[key].date")
//         //     console.log(data[key].date)
//         //     console.log("data[key].info")
//         //     console.log(data[key].info)
//         //   });
        
//         res.write(JSON.stringify(snapshot.val()));
        
//     });

// });

io.on("connection", function (socket) {
    socket.on("notify", function (notification_request) {
        io.emit('notify', JSON.stringify(notification_request));
    });
});

server.listen(PORT, () => {
    console.log("Listening on port " + PORT);
    setUpFirebase();
    getDataFromFirebase();
    // setUpFirebase();
});


function setUpFirebase() {
    console.log("setUpFirebase()")
            admin.initializeApp({
                credential: admin.credential.cert(JSON.parse(serviceAccount)),
                databaseURL: 'https://twilio-bot-1601d.firebaseio.com/'
                });
            console.log("firebase initialized!");
        }






function getDataFromFirebase() {
            var db = admin.database();
            var ref = db.ref("logs");
            console.log("connecting to firebase!");
            ref.on("value", function(snapshot) {
                console.log("SNAPSHOT ->  ");
                // console.log(JSON.stringify(snapshot.val()))
                // data = snapshot.val()
                // console.log("object.keys -> ")
                // console.log(Object.keys(data))
                // console.log("starting for each key loop -> ")
                // Object.keys(data).forEach(function (key) {
                //     console.log("data[key].date")
                //     console.log(data[key].date)
                //     console.log("data[key].info")
                //     console.log(data[key].info)
                //   });
                
                // res.write(JSON.stringify(snapshot.val()));
                data = snapshot.val()
                console.log("snapshot.val()       data ->")
                console.log(data)
                io.emit('notify', JSON.stringify(data));
        
        
                Object.keys(data).forEach(function (key) {
                    // do something with data[key]
                    console.log("data[key].date")
                    console.log(data[key].date)
                    console.log("data[key].info")
                    console.log(data[key].info)
                    $('#logTable > tbody:last-child').append('<tr><td>' + data[key].date + '</td><td>' + data[key].info + '</td></tr>');
                });
                
            });
        }
        
// function setUpFirebase() {
//     console.log("setUpFirebase()")
//             admin.initializeApp({
//                 credential: admin.credential.cert(JSON.parse(serviceAccount)),
//                 databaseURL: 'https://twilio-bot-1601d.firebaseio.com/'
//                 });
//             console.log("firebase initialized!");
//         }
    



// function serve_static_file(file, res) {
//     var rs = fs.createReadStream(file);
//     res.writeHead(200, {"Content-Type": 'text/html'});
    
//     rs.on('readable', () => {
//        var d = rs.read();
//        if (d) {
//            if (typeof d === 'string') {
//                res.write(d);
//            } else if (typeof d === 'object' && d instanceof Buffer) {
//                res.write(d.toString('utf8'));
//            }
//        } 
//     });

//     rs.on('end', () => {
//         res.end();
//     })
// }

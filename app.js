const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const server = require('http').createServer(app);
const admin = require('firebase-admin');
const serviceAccount = process.env.SERVICEACCOUNT
const PORT = process.env.PORT || 3000;
const io = require('socket.io')(server);


const config = {
    "apiKey": process.env.FIREBASEAPIKEY,
    "authDomain": process.env.AUTHDOMAIN,
    "databaseURL": process.env.DATABASEURL,
    "projectId": process.env.PROJECTID,
    "storageBucket": process.env.STORAGEBUCKET,
    "messagingSenderId": process.env.MESSAGINGSENDERID,
    "serviceAccount": process.env.SERVICEACCOUNT 
  }


app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send("Node server live!");
});


app.get('/dashboard', (req, res) => {
    res.sendFile('index.html',{root: __dirname});
});


io.on("connection", function (socket) {
    // socket.on("notify", function (notification_request) {
    //     // io.emit('notify', JSON.stringify(notification_request));
    // });   
    socket.on("pinDataUpdate", function (notification_request) {
        // io.emit('pinDataUpdate', JSON.stringify(notification_request));
        console.log("socket on -> pinDataUpdate       Running on server")
    });
    socket.on("loadLogData", function (notification_request) {
        getLogDataFromFirebase();
    });
    socket.on("loadPinData", function (notification_request) {
        getPinDataFromFirebase();
    });
    
});


server.listen(PORT, () => {
    console.log("Listening on port " + PORT);
    setUpFirebase();
});


function setUpFirebase() {
    console.log("setUpFirebase()")
            admin.initializeApp({
                credential: admin.credential.cert(JSON.parse(serviceAccount)),
                databaseURL: 'https://twilio-bot-1601d.firebaseio.com/'
                });
            console.log("firebase initialized!");
        }


function getLogDataFromFirebase() {
            var db = admin.database();
            var ref = db.ref("logs");
            console.log("connecting to firebase!");
            ref.on("value", function(snapshot) {
                console.log("SNAPSHOT ->  ");
                data = snapshot.val()
                console.log("snapshot.val()       data ->")
                console.log(data)
                io.emit('notify', JSON.stringify(data));
                console.log("io.emit notify!!!!      ( app.js )    ->")
            });
        }
        

function getPinDataFromFirebase() {
            var db = admin.database();
            var ref = db.ref("pin_data");
            console.log("connecting to firebase!");
            ref.on("value", function(snapshot) {
                console.log("SNAPSHOT ->  ");
                data = snapshot.val()
                console.log("snapshot.val()       data ->")
                console.log(data)
                io.emit('pinDataUpdate', JSON.stringify(data));
                console.log("io.emit  pin_data!!!!      ( app.js )    ->")
            });
        }
        

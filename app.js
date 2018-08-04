const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const server = require('http').createServer(app);
const admin = require('firebase-admin');
const serviceAccount = process.env.SERVICEACCOUNT
const PORT = process.env.PORT || 3000;
const io = require('socket.io')(server);

const multer = require('multer')
const upload = multer({
    dest: 'screenshots/' // this saves your file into a directory called "screenshots"
  }); 

var querystring = require('querystring');
var https = require('https');
var path = require('path');
var request = require("request");


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
app.use(bodyParser.urlencoded());
app.use('/images/', express.static('./images'));


app.get('/', (req, res) => {
    res.send("Error 404: Hmmmm, Sorry, I can't find the page you're looking for. Maybe you meant http://bit.ly/EXRaidsBCS ?");
});


app.get('/ex-raid-sign-up', (req, res) => {
    res.sendFile('ex.html',{root: __dirname});
});
app.get('/show-ex-raids', (req, res) => {
    res.sendFile('raids.html',{root: __dirname});
});


app.post('/ex-raid-form', upload.single('ssUpload'), (req, res) => {
    if (req.file) {
        console.log('Uploaded: ', req.file)
        trainerInfo = {
            "trainerName": req.body.trainerName,
            "team": req.body.team,
            "startTime": req.body.startTime
        }

        webhookScreenshot(req.file, trainerInfo) 
      }
    res.sendFile('thanks.html',{root: __dirname});
});



app.get('/dashboard', (req, res) => {
    res.sendFile('index.html',{root: __dirname});
});


io.on("connection", function (socket) {
    socket.on("loadLogData", function (notification_request) {
        getLogDataFromFirebase();
    });
    socket.on("loadRaidData", function (notification_request) {  
        getRaidDataFromFirebase();
    });
});


app.get('/api/bot-report', (req, res) => {
    io.emit('botAlert', req.query);
    res.send("/api/bot-report has received your request!");
});


server.listen(PORT, () => {
    console.log("Listening on port " + PORT);
    setUpFirebase();
    getPinDataFromFirebase();
    getLogDataFromFirebase();
    getRaidDataFromFirebase()
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


function getRaidDataFromFirebase() {
            var db = admin.database();
            var ref = db.ref("ex_ocr_testing");
            console.log("connecting to firebase!");
            ref.on("value", function(snapshot) {
                console.log("SNAPSHOT ->  ");
                data = snapshot.val()
                console.log("snapshot.val()       data ->")
                console.log(data)
                io.emit('raidDataUpdate', JSON.stringify(data));
                console.log("io.emit  ex_ocr_testing!!!!      ( app.js )    ->")
            });
        }


function webhookScreenshot(msg, trainerInfo) {
    

    var whurl = process.env.WEBHOOK
    var options = { method: 'POST',
      url: whurl,
      headers: 
       { 
         'cache-control': 'no-cache',
         'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
      formData: 
       { file: 
          { value: fs.createReadStream(msg.path),
            options: 
             { filename: msg.originalname,
                contentType: null } },
                content: ("trainerName:" + trainerInfo.trainerName +  ":team:" + trainerInfo.team  + ":startTime:" + trainerInfo.startTime)
            } };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
    
      console.log(body);
    });
    

}


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
app.use(bodyParser.urlencoded());
app.use('/images/', express.static('./images'));


app.get('/', (req, res) => {
    res.send("Error 404: Hmmmm, Sorry, I can't find the page you're looking for. Maybe you meant http://bit.ly/EXRaidsBCS ?");
});


app.get('/ex-raid-sign-up', (req, res) => {
    res.sendFile('ex.html',{root: __dirname});
});


app.post('/ex-raid-form', (req, res) => {

    checkFormData(req.body, function(formIsValid) {
        console.log("callback from check form data")
        if (formIsValid) {
            console.log("formIsValid")
            console.log("pushing to firebase...")
            pushToFirebase(req.body)
        }
    })
    
    
    res.sendFile('thanks.html',{root: __dirname});
});



app.get('/dashboard', (req, res) => {
    res.sendFile('index.html',{root: __dirname});
});


io.on("connection", function (socket) {
    socket.on("loadLogData", function (notification_request) {
        getLogDataFromFirebase();
    });
    // socket.on("onYourEvent", function (notification_request) {   // set up new events like this
    //     respondToEvent();
    // });
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


function pushToFirebase(data) {
    var db = admin.database();
    var ref = db.ref("ex_ocr_testing");
    uploadPacket = {
        "dateUploaded": new Date().toUTCString(), // note this may not match the python format nicely, might need to change this
        "discord_name": data.trainerName,
        "team": data.team,
        "gym_name": data.gymName,
        "date_extracted": data.dateInput,
        "unprocessed_image_to_string": "No screenshot porcessed - Link sign up",
        "image_url": "No URL - Link sign up",
        "preferredStartTime": data.startTime
    }
    console.log("pushing...")
    results = ref.push(uploadPacket)
    console.log('finished!\nresults ->')
    console.log(results)
}
        

function checkFormData(body, cb) {
    console.log("Form submitted!")
    console.log("The form data ->")
    console.log("body.trainerName:")
    console.log(body.trainerName)
    console.log("body.gymName:")
    console.log(body.gymName)
    console.log("body.team:")
    console.log(body.team)
    console.log("body.dateInput:")
    console.log(body.dateInput)
    console.log("body.startTime:")
    console.log(body.startTime)

    console.log("\n\nNEED TO IMPLEMENT THIS DATA VALIDATION!!!!!!!!!     app.js   checkFormData()\n\n")
    cb(true);

}
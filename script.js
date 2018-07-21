

var admin = require('firebase-admin');
var io = require('socket.io')(http);

const config = {
    "apiKey": process.env.FIREBASEAPIKEY,
    "authDomain": process.env.AUTHDOMAIN,
    "databaseURL": process.env.DATABASEURL,
    "projectId": process.env.PROJECTID,
    "storageBucket": process.env.STORAGEBUCKET,
    "messagingSenderId": process.env.MESSAGINGSENDERID,
    "serviceAccount": process.env.SERVICEACCOUNT 
  }



function setUpFirebase() {
    console.log("setUpFirebase()")
            admin.initializeApp({
                credential: admin.credential.cert(JSON.parse(serviceAccount)),
                databaseURL: 'https://twilio-bot-1601d.firebaseio.com/'
                });
            console.log("firebase initialized!");
        }
    

function getDataFromFirebase() {

    io.on("connection", function (socket) {
        socket.on("notify", function (notification_request) {
            io.emit('notify', JSON.stringify(notification_request));
        });



    var db = admin.database();
    var ref = db.ref("logs");
    console.log("connecting to firebase!");
    ref.on("value", function(snapshot) {
        console.log("SNAPSHOT ->  ");
        console.log(JSON.stringify(snapshot.val()))
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
        data = JSON.parse(data)
        console.log("/getLogs data ->")
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
});


module.exports.setUpFirebase = setUpFirebase;
module.exports.getDataFromFirebase = getDataFromFirebase;

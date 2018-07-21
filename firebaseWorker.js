var admin = require('firebase-admin');
var serviceAccount = process.env.SERVICEACCOUNT
var fs = require('fs');


config = {
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
    


function getLogs() {
    console.log("calling getLogs()");
    var db = admin.database();
    var ref = db.ref("logs");
    console.log("connecting to firebase!");
    // Attach an asynchronous callback to read the data at our posts reference
    ref.on("value", function(snapshot) {
        console.log("HERE IS THE SNAPSHOT FROM FIREBASE ->  ");
        
        data = snapshot.val()
        
        // console.log(JSON.stringify(snapshot.val()))
        console.log("object.keys -> ")
        console.log(Object.keys(data))
        console.log("starting for each key loop -> ")
        Object.keys(data).forEach(function (key) {
            // do something with data[key]
            console.log("data[key].date")
            console.log(data[key].date)
            console.log("data[key].info")
            console.log(data[key].info)
          });
        
        return data;
        


    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    console.log("firebase read finished!");
}

module.exports.setUpFirebase = setUpFirebase;
module.exports.getLogs = getLogs;
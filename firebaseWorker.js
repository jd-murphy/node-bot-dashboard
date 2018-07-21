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



function setUpServiceAccountFile() {
    console.log("setUpServiceAccountFile()")
            admin.initializeApp({
                credential: admin.credential.cert(JSON.parse(serviceAccount)),
                databaseURL: 'https://twilio-bot-1601d.firebaseio.com/'
                });
            console.log("firebase initialized!");
            getLogs();
        }
    


function getLogs() {
    console.log("calling getLogs()");
    var db = admin.database();
    var ref = db.ref("logs");
    console.log("connecting to firebase!");
    // Attach an asynchronous callback to read the data at our posts reference
    ref.on("value", function(snapshot) {
        console.log("HERE IS THE SNAPSHOT FROM FIREBASE ->  ");
        
        
        console.log(JSON.stringify(snapshot.val()))

        console.log("test 1")
        console.log(Object.keys(data));

        console.log("test 2")
        for (const key in snapshot.val()) {
            if (object.hasOwnProperty('date')) {
                 console.log(object[key]);
                
            }
            if (object.hasOwnProperty('info')) {
                console.log(object[key]);
                
            }
        }
        
        


    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    console.log("firebase read finished!");
}

module.exports.setUpServiceAccountFile = setUpServiceAccountFile;
module.exports.getLogs = getLogs;
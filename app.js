const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Node server live!");
});
app.get('/dashboard', (req, res) => {
    serve_static_file('index.html', res);
});



app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});





function serve_static_file(file, res) {
    var rs = fs.createReadStream(file);
    res.writeHead(200, {"Content-Type": 'text/html'});
    
    rs.on('readable', () => {
       var d = rs.read();
       if (d) {
           if (typeof d === 'string') {
               res.write(d);
           } else if (typeof d === 'object' && d instanceof Buffer) {
               res.write(d.toString('utf8'));
           }
       } 
    });

    rs.on('end', () => {
        res.end();
    })
}

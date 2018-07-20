const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Node server live!");
});
app.get('/dashboard', (req, res) => {
    res.send("Here is your dashboard");
});


app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
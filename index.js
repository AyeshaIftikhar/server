var http = require('http');
var fs = require('fs'); // to get data from html file
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res
        .status(200)
        .send('Hello server is running')
        .end();
});

// Start the server
const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}`);
//   console.log('Press Ctrl+C to quit.');
// });

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    var url = req.url;
    if (url === "/") {
        fs.readFile("head.html", function (err, pgres) {
            if (err)
                res.write("HEAD.HTML NOT FOUND");
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(pgres);
                res.end();
            }
        });
    } else if (url === "/tailPage") {
        fs.readFile("tail.html", function (err, pgres) {
            if (err)
                res.write("TAIL.HTML NOT FOUND");
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(pgres);
                res.end();
            }
        });
    }

}).listen(PORT, function () {
    console.log("SERVER STARTED PORT: 3000");
});

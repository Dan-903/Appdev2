const http = require('http');

const port = 3000;
const host = "localhost";

const server = http.createServer((req, res) => {
    if (req.url === "/greet") {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain'); 
        res.end("Hello, Welcome to Node.js!");
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain'); 
        res.end("Page Not Found.");
    }
});

server.listen(port, host , () => {
    console.log(`Listening on http://${host}:${port}`);
});


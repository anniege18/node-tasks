const http = require('http');
const port = 3004;

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(req.url.slice(1));
}).listen(port, () => { console.log(`Listening port ${port}...`); });
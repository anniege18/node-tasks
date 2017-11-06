const http = require('http');
const port = 3004;

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    req.pipe(res);
}).listen(port, () => { console.log(`Listening port ${port}...`); });
const http = require('http');
const port = 3000;

http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.write('Hello World!');
    res.end();
}).listen(port, () => { console.log(`Listening port ${port}...`); });
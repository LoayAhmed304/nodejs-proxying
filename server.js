const https = require("https");
const http = require("http");

const fs  = require("fs");

const serverOptions = {
    key: fs.readFileSync('private.key'),
    cert: fs.readFileSync("server.crt")
}

const httpsServer = https.createServer(serverOptions, (req, res) =>{
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Welcome to my localhost... EXCEPT ITS HTTPS!!!!!");
});

const httpServer = http.createServer((req, res)=>{
    res.writeHead(301, {"Location":`https://localhost:8080`});
    res.end();
})

httpsServer.listen(8080, ()=>console.log("Hello world, listening to server Loay"));
httpServer.listen(80, ()=>console.log("HTTP running on port 80"));
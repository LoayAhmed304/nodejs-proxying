const https = require("https");
const http = require("http");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer();

const fs  = require("fs");

const serverOptions = {
    key: fs.readFileSync('private.key'),
    cert: fs.readFileSync("server.crt")
}

const httpsServer = https.createServer(serverOptions, (req, res) =>{
    // proxy to our db backend server (error with db hosting)
    proxy.web(req, res, {target:"http://localhost:3000"}, (err, req, res)=>{
        res.writeHead(502, {"Content-Type": "plain/text"});
        res.end("Bade Gateway: error with the proxy");
    }); 
});

const httpServer = http.createServer((req, res)=>{
    res.writeHead(301, {"Location":`https://localhost:8080`});
    res.end();
})

httpsServer.listen(8080, ()=>console.log("Hello world, listening to server Loay"));
httpServer.listen(80, ()=>console.log("HTTP running on port 80"));
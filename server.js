const https = require("https");
const fs  = require("fs");

const serverOptions = {
    key: fs.readFileSync('private.key'),
    cert: fs.readFileSync("server.crt")
}

const httpsServer = https.createServer(serverOptions, (req, res) =>{
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Welcome to my localhost... EXCEPT ITS HTTPS!!!!!");
});


httpsServer.listen(8080, ()=>console.log("Hello world, listening to server Loay"));

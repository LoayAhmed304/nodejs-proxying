const https = require("https");
const http = require("http");
const httpProxy = require("http-proxy");

const sslConfig = require("./config/sslConfig");
const proxyConfig = require("./config/proxyConfig");
const errorHandler = require("./utils/errorHandler");

const proxy = httpProxy.createProxyServer();

const httpsServer = https.createServer(sslConfig, (req, res) => {
  const route = proxyConfig.find((route) => req.url.startsWith(route.path));

  if (!route) {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end("Bad Gateway: Undefined server requested");
    return;
  }
  proxy.web(req, res, { target: route.target }, (err) =>
    errorHandler(err, req, res)
  );
});

// Add custom header to all proxied requests
proxy.on("proxyReq", (proxyReq, req, res) => {
  proxyReq.setHeader("My-Header", "A custom header value made by the proxy");
});

proxy.on("error", errorHandler);

const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://localhost:443` });
  res.end();
});

httpsServer.listen(443, () =>
  console.log("Hello world, listening to server Loay")
);
httpServer.listen(80, () => console.log("HTTP running on port 80"));

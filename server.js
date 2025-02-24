const https = require("https");
const http = require("http");
const httpProxy = require("http-proxy");
const morgan = require("morgan");
const NodeCache = require("node-cache");

const sslConfig = require("./config/sslConfig");
const proxyConfig = require("./config/proxyConfig");
const errorHandler = require("./utils/errorHandler");

const proxy = httpProxy.createProxyServer();

// Create cache
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 }); // Cache expires in 60 seconds

// Creating the HTTPS Server
const httpsServer = https.createServer(sslConfig, (req, res, next) => {
  morgan("combined")(req, res, () => {});

  const route = proxyConfig.find((route) => req.url.startsWith(route.path));

  if (!route) {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end("Bad Gateway: Undefined server requested");
    return;
  }

  // Check if response is already cached -> then send the cached response
  // Only for GET requests
  if (req.method === "GET") {
    const cachedResponse = cache.get(req.url);
    if (cachedResponse) {
      console.log("Serving from cache....", req.url);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(cachedResponse);
      return;
    }
  }

  // Proxy the request and cache the response
  // Only cache GET requests
  proxy.web(req, res, { target: route.target }, (err) =>
    errorHandler(err, req, res)
  );
  if (req.method === "GET") {
    proxy.on("proxyRes", (proxyRes, req, res) => {
      let body = "";

      proxyRes.on("data", (chunk) => (body += chunk));
      proxyRes.on("end", () => {
        cache.set(req.url, body);
      });
    });
  }
});

// Add custom header to all proxied requests
proxy.on("proxyReq", (proxyReq, req, res) => {
  proxyReq.setHeader("My-Header", "A custom header value made by the proxy");
});

// Handle proxy errors
proxy.on("error", errorHandler);

const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://localhost:443` });
  res.end();
});

httpsServer.listen(443, () =>
  console.log("Hello world, listening to server Loay")
);
httpServer.listen(80, () => console.log("HTTP running on port 80"));

module.exports = (err, req, res) => {
  console.error("Proxy Error:", err.message);
  res.writeHead(502, { "Content-Type": "text/plain" });
  res.end("Bad Gateway: Error with the proxy");
};

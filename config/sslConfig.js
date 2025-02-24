const fs = require("fs");

module.exports = {
  key: fs.readFileSync("./private.key"),
  cert: fs.readFileSync("./server.crt"),
};

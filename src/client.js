let liveServer = require("live-server");

let port = 8081;

function Start() {
  let params = {
    port: port,
    root: "./static",
    wait: 1000,
    open: false
  };

  console.log(`Starting client on port ${port}...`);
  liveServer.start(params);
}

module.exports = { Start };

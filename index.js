const fs = require("fs");
const WebSocket = require("ws");
const crypto = require("crypto");

const yargs = require("yargs");

const argv = yargs(process.argv.slice(2))
  .option("regolithpath", {
    alias: "rp",
    description: "Set the regolith path",
    type: "string",
  })
  .option("wsport", {
    alias: "wsp",
    description: "Set the websocket port",
    type: "number",
  })
  .help()
  .alias("help", "h").argv;

const path = require("path");

const options = {
  regolithPath: argv.path ? path.resolve(argv.path) : path.resolve(".regolith"),
  wsport: argv.wsport || 8080,
};
const editedFilesPath = path.resolve(
  options.regolithPath,
  "cache",
  "edited_files.json"
);

/**
 *
 * @param {WebSocket.WebSocket} ws
 * @param {*} header
 * @param {*} body
 */
function sendMC(ws, header, body) {
  const data = {
    header: Object.assign(
      {
        version: 1,
        requestId: crypto.randomUUID(),
      },
      header
    ),
    body,
  };
  ws.send(JSON.stringify(data));
}
/**
 *
 * @param {WebSocket.WebSocket} ws
 * @param {string} command
 */
function sendMCCommand(ws, command) {
  const requestId = crypto.randomUUID();
  sendMC(
    ws,
    {
      requestId,
      messagePurpose: "commandRequest",
    },
    { commandLine: command }
  );
  return new Promise((resolve, reject) => {
    ws.on("message", (data) => {
      data = JSON.parse(data);
      if (data.header?.requestId === requestId) {
        resolve(data.body);
      }
    });
  });
}

const wss = new WebSocket.Server({ port: options.wsport });

fs.watchFile(editedFilesPath, (curr, prev) => {
  console.log(
    "Detected a change in '.regolith/cache/edited_files.json', reloading..."
  );
  curr;
  wss.clients.forEach(async (client) => {
    await sendMCCommand(client, "reload");
    await sendMCCommand(
      client,
      'tellraw @s {"rawtext":[{"text":"[Auto Reloader] Reloaded scripts and functions"}]}'
    );
  });
});

console.log("Auto Reloader started with:\n" + JSON.stringify(options, null, 2));

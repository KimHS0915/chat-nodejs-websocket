import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log("http://localhost:3000");

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["name"] = "anonymous";
  console.log("Connected to Browser");
  socket.on("close", () => console.log("DisConnected from Browser"));
  socket.on("message", (message) => {
    const parsed = JSON.parse(message);
    if (parsed.type === "new_message") {
      sockets.forEach((aSocket) =>
        aSocket.send(`${socket.name}: ${parsed.payload}`)
      );
    } else if (parsed.type === "name") {
      socket["name"] = parsed.payload;
    }
  });
});

server.listen(3000, handleListen);

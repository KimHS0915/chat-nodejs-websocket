import http from "http";
import express from "express";
import socketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log("http://localhost:3000");

const httpServer = http.createServer(app);

const wsServer = socketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket["name"] = "Anonymous";
  socket.onAny((e) => {
    console.log(`Socket Event: ${e}`);
  });
  socket.on("enter_room", (roomName, userName, done) => {
    socket.join(roomName);
    socket["name"] = userName;
    done();
    socket.to(roomName).emit("welcome", socket.name);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.name);
    });
  });
  socket.on("new_message", (message, room, done) => {
    socket.to(room).emit("new_message", `${socket.name}: ${message}`);
    done();
  });
  socket.on("name", (name) => (socket["name"] = name));
});

httpServer.listen(3000, handleListen);

import http from "http";
import express from "express";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log("http://localhost:3000");

const httpServer = http.createServer(app);

const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(wsServer, {
  auth: false,
});

const publicRooms = () => {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
};

const countUser = (roomName) => {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
};

wsServer.on("connection", (socket) => {
  socket["name"] = "Anonymous";
  socket.onAny((e) => {
    console.log(`Socket Event: ${e}`);
  });
  socket.on("enter_room", (roomName, userName, done) => {
    socket.join(roomName);
    socket["name"] = userName;
    done(countUser(roomName));
    socket.to(roomName).emit("welcome", socket.name, countUser(roomName));
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.name, countUser(room) - 1);
    });
  });
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (message, room, done) => {
    socket.to(room).emit("new_message", `${socket.name}: ${message}`);
    done();
  });
  socket.on("name", (name) => (socket["name"] = name));
});

httpServer.listen(3000, handleListen);

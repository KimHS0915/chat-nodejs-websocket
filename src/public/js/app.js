const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

const addMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
};

const handleMessageSubmit = (e) => {
  e.preventDefault();
  const input = room.querySelector("#message input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
};
const handleNameSubmit = (e) => {
  e.preventDefault();
  const input = room.querySelector("#name input");
  const value = input.value;
  socket.emit("name", input.value);
  input.value = "";
};

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const messageForm = room.querySelector("#message");
  const nameForm = room.querySelector("#name");
  messageForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNameSubmit);
};

const handleRoomSubmit = (e) => {
  e.preventDefault();
  const roomNameInput = form.querySelector("#rName");
  const userNameInput = form.querySelector("#uName");
  socket.emit("enter_room", roomNameInput.value, userNameInput.value, showRoom);
  roomName = roomNameInput.value;
  roomNameInput.value = "";
  userNameInput.value = "";
};

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (name) => {
  addMessage(`${name} arrived!`);
});

socket.on("bye", (name) => {
  addMessage(`${name} left`);
});

socket.on("new_message", addMessage);

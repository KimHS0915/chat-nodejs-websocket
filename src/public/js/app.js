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

const addRoomTitle = (count) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${count})`;
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

const showRoom = (newCount) => {
  welcome.hidden = true;
  room.hidden = false;
  addRoomTitle(newCount);
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

socket.on("welcome", (name, newCount) => {
  addMessage(`${name} arrived!`);
  addRoomTitle(newCount);
});

socket.on("bye", (name, newCount) => {
  addMessage(`${name} left`);
  addRoomTitle(newCount);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  if (rooms.length === 0) {
    roomList.innerHTML = "";
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});

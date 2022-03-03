const messageList = document.querySelector("ul");
const nameForm = document.querySelector("#name");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

const makeMessage = (type, payload) => {
  const message = { type, payload };
  return JSON.stringify(message);
};

socket.addEventListener("open", () => {
  console.log("Connected to Server");
});

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server");
});

const handleSubmit = (e) => {
  e.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  input.value = "";
};

const handleNameSubmit = (e) => {
  e.preventDefault();
  const input = nameForm.querySelector("input");
  socket.send(makeMessage("name", input.value));
  input.value = "";
};

messageForm.addEventListener("submit", handleSubmit);
nameForm.addEventListener("submit", handleNameSubmit);

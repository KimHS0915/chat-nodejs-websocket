const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("Form");

const handleRoomSubmit = (e) => {
  e.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", { payload: input.value }, () => {
    console.log("server is done");
  });
  input.value = "";
};

form.addEventListener("submit", handleRoomSubmit);

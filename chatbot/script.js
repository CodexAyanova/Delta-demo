const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");

function addMessage(message, sender) {

  const messageDiv = document.createElement("div");

  messageDiv.classList.add("message");

  if (sender === "user") {
    messageDiv.classList.add("user-message");
  } else {
    messageDiv.classList.add("bot-message");
  }

  messageDiv.textContent = message;

  chatBox.appendChild(messageDiv);

  chatBox.scrollTop = chatBox.scrollHeight;
}

function botReply(userMessage) {

  let reply = "Sorry, I don't understand that yet.";

  const msg = userMessage.toLowerCase();

  if (msg.includes("price")) {
    reply = "Our rooms start from ₹4500 per night.";
  }

  else if (msg.includes("wifi")) {
    reply = "Yes, high-speed WiFi is available in all rooms.";
  }

  else if (msg.includes("pool")) {
    reply = "Yes, we have a rooftop infinity pool.";
  }

  else if (msg.includes("check in")) {
    reply = "Check-in starts from 2 PM.";
  }

  else if (msg.includes("mountain")) {
    reply = "Yes, we have mountain-view deluxe suites available.";
  }

  setTimeout(() => {
    addMessage(reply, "bot");
  }, 1000);
}

sendBtn.addEventListener("click", () => {

  const message = userInput.value.trim();

  if (message === "") return;

  addMessage(message, "user");

  botReply(message);

  userInput.value = "";
});

userInput.addEventListener("keypress", (e) => {

  if (e.key === "Enter") {
    sendBtn.click();
  }
});


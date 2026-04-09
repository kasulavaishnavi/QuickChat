let currentChatId = null;
const baseAPI = "https://quickchat-4jrl.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  // Protecting the chat page - if token stored in local storage then access it
  if (!token && window.location.pathname.includes("aiChat.html")) {
    window.location.replace("index.html");
    return;
  }

  // storing it globally
  window.token = token;

  //login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) handleLogin();

  //signup
  const signupForm = document.getElementById("signupForm");
  if (signupForm) handleSignup();

  //chat
  const sendBtn = document.getElementById("sendBtn");
  const newTextBtn = document.getElementById("newTextBtn");

  if (sendBtn) sendBtn.addEventListener("click", sendMessage);
  if (newTextBtn) newTextBtn.addEventListener("click", createChat);

  if (window.location.pathname.includes("aiChat.html")) {
    loadChats();
  }
});

//handling login

function handleLogin() {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${baseAPI}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      window.location.href = "aiChat.html";
    } else {
      alert(data.message);
    }
  });
}

//handling signup
function handleSignup() {
  const form = document.getElementById("signupForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${baseAPI}/api/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      window.location.href = "aiChat.html";
    } else {
      alert(data.message);
    }
  });
}

//loading the chats

async function loadChats() {
  const chatListDiv = document.getElementById("chatList");

  const res = await fetch(`${baseAPI}/api/chat/get`, {
    headers: { Authorization: `Bearer ${window.token}` },
  });

  const data = await res.json();

  if (data.success) {
    chatListDiv.innerHTML = "";
    const chats = data.chats.reverse();

    // if (chats.length > 0 && !currentChatId) {
    //   currentChatId = chats[0]._id;
    //   switchChat(currentChatId);
    // }
    chats.forEach((chat) => {
      const div = document.createElement("div");

      div.className = `chat-item ${
        currentChatId === chat._id ? "active-chat" : ""
      }`;

      div.innerHTML = `
     <span onclick="switchChat('${chat._id}')">
          ${chat.messages[0]?.content.slice(0, 20) || "New Chat"}...
        </span>
        <span onclick="deleteChat('${chat._id}')">🗑️</span>
      `;

      chatListDiv.appendChild(div);
    });
  }
}

async function switchChat(id) {
  currentChatId = id;

  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = "";

  const res = await fetch(`${baseAPI}/api/chat/get`, {
    headers: { Authorization: `Bearer ${window.token}` },
  });

  const data = await res.json();

  const chat = data.chats.find((c) => c._id === id);

  if (chat) {
    chat.messages.forEach((msg) => {
      addMessage(msg.role === "user" ? "You" : "AI", msg.content);
    });
  }

  loadChats();
}

//creating new chat
async function createChat() {
  const res = await fetch(`${baseAPI}/api/chat/create`, {
    method: "POST",
    headers: { Authorization: `Bearer ${window.token}` },
  });

  const data = await res.json();

  if (data.success) {
    currentChatId = data.chatId;
    document.getElementById("messages").innerHTML = "";
    loadChats();
  }
}

//delete chat

async function deleteChat(id) {
  const res = await fetch(`${baseAPI}/api/chat/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${window.token}` },
  });

  const data = await res.json();

  if (data.success) {
    if (currentChatId === id) {
      currentChatId = null;
      document.getElementById("messages").innerHTML = "";
    }
    loadChats();
  }
}

async function sendMessage() {
  const input = document.getElementById("textInput");
  const text = input.value;

  if (!text) return;

  if (!currentChatId) {
    alert("Create chat first");
    return;
  }

  hideWelcome();

  addMessage("You", text);
  input.value = "";

  const res = await fetch(`${baseAPI}/api/chat/text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${window.token}`,
    },
    body: JSON.stringify({
      chatId: currentChatId,
      prompt: text,
    }),
  });

  const data = await res.json();

  if (data.success) {
    addMessage("AI", data.reply.content);
  } else {
    alert(data.message);
  }
}

function addMessage(sender, text) {
  const messagesDiv = document.getElementById("messages");

  const div = document.createElement("div");
  div.className = sender === "You" ? "user-msg" : "ai-msg";
  div.innerText = text;

  messagesDiv.appendChild(div);

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

LOGOUT;
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

function showWelcome() {
  const welcome = document.getElementById("welcomeScreen");
  const messages = document.getElementById("messages");

  if (welcome) welcome.style.display = "flex";
  if (messages) messages.innerHTML = "";
}

function hideWelcome() {
  const welcome = document.getElementById("welcomeScreen");
  if (welcome) welcome.style.display = "none";
}

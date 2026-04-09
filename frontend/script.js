let currentChatId = null;
const baseAPI = "http://localhost:4000";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  // Protect chat page
  if (!token && window.location.pathname.includes("aiChat.html")) {
    window.location.replace("index.html");
    return;
  }

  window.token = token;

  const loginForm = document.getElementById("loginForm");
  if (loginForm) handleLogin();

  const signupForm = document.getElementById("signupForm");
  if (signupForm) handleSignup();

  const sendBtn = document.getElementById("sendBtn");
  const newTextBtn = document.getElementById("newTextBtn");

  if (sendBtn) sendBtn.addEventListener("click", sendMessage);
  if (newTextBtn) newTextBtn.addEventListener("click", createChat);

  if (window.location.pathname.includes("aiChat.html")) {
    loadChats();

    const savedChatId = localStorage.getItem("activeChatId");
    if (savedChatId) {
      switchChat(savedChatId); // This restores the messages and input box
    }
  }

  const input = document.getElementById("textInput");

  if (input) {
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }
});

//  FUNCTIONS

function handleLogin() {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${baseAPI}/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

function handleSignup() {
  const form = document.getElementById("signupForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${baseAPI}/api/user/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

async function loadChats() {
  const chatListDiv = document.getElementById("chatList");
  const currentChatDiv = document.getElementById("currentChat");

  const res = await fetch(`${baseAPI}/api/chat/get`, {
    headers: { Authorization: `Bearer ${window.token}` },
  });

  const data = await res.json();

  if (data.success) {
    chatListDiv.innerHTML = "";
    currentChatDiv.innerHTML = "";

    const chats = data.chats.reverse();

    //auto set current chat
    if (!currentChatId && chats.length > 0) {
      currentChatId = chats[0]._id;
    }
    chats.forEach((chat) => {
      const div = document.createElement("div");

      div.className = `chat-item ${currentChatId === chat._id ? "active-chat" : ""}`;

      div.setAttribute("onclick", `switchChat('${chat._id}')`);
      div.innerHTML = `
        <div  class="chat-text">
          ${chat.messages[0]?.content.slice(0, 20) || "New Chat"}...
        </div>
        <span onclick="deleteChat('${chat._id}')">🗑️</span>
      `;

      if (currentChatId && chat._id === currentChatId) {
        div.classList.add("active-chat");
        currentChatDiv.appendChild(div);
      } else {
        chatListDiv.appendChild(div);
      }
    });
  }
}

async function switchChat(id) {
  currentChatId = id;
  localStorage.setItem("activeChatId", id);
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

  hideWelcome();
  loadChats();
}

async function createChat() {
  const res = await fetch(`${baseAPI}/api/chat/create`, {
    method: "POST",
    headers: { Authorization: `Bearer ${window.token}` },
  });

  const data = await res.json();

  if (data.success) {
    currentChatId = data.chatId;

    document.getElementById("messages").innerHTML = "";

    showWelcome();
    await loadChats();
  }
}
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
      const inputCont = document.getElementById("inputContainer");
      if (inputCont) inputCont.style.display = "none";
    }
    loadChats();
  }
}

async function sendMessage() {
  const input = document.getElementById("textInput");
  const text = input.value;

  if (!text) return;
  if (!currentChatId) {
    alert("Please click 'Current Chat' first!");
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
    body: JSON.stringify({ chatId: currentChatId, prompt: text }),
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

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("activeChatId");
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

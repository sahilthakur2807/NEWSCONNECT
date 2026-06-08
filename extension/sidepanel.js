const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

const API_BASE = 'http://localhost:5001/api';
let currentRoom = null;

chrome.storage.local.get(['targetUrl', 'targetTitle'], (result) => {
  if (result.targetUrl) {
    initRoom(result.targetUrl, result.targetTitle);
  }
});

async function initRoom(url, title) {
  try {
    const response = await fetch(`${API_BASE}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, title: title || 'New Discussion' })
    });
    currentRoom = await response.json();
    loadMessages(currentRoom.id);
    
    // Poll for new messages every 3 seconds
    setInterval(() => loadMessages(currentRoom.id), 3000);
  } catch (err) {
    console.error('Failed to init room', err);
  }
}

async function loadMessages(roomId) {
  try {
    const response = await fetch(`${API_BASE}/rooms/${roomId}/messages`);
    const messages = await response.json();
    
    if (messages.length > 0) {
      chatContainer.innerHTML = '';
      messages.forEach(msg => addMessageToUI(msg));
    }
  } catch (err) {
    console.error('Failed to load messages', err);
  }
}

function addMessageToUI(msg) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message';
  msgDiv.innerHTML = `
    <div class="user">${msg.username || msg.user || 'Anonymous'}</div>
    <div class="text">${msg.content || msg.text}</div>
  `;
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

sendBtn.addEventListener('click', async () => {
  const content = messageInput.value.trim();
  if (content && currentRoom) {
    try {
      const response = await fetch(`${API_BASE}/rooms/${currentRoom.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
        credentials: 'include' // Important for session cookie
      });
      
      if (response.ok) {
        const newMessage = await response.json();
        // Since we poll, we don't necessarily need to add it manually, 
        // but it makes the UI feel faster.
        messageInput.value = '';
        loadMessages(currentRoom.id);
      } else {
        alert('Please sign in on the NewsConnect website to post messages.');
      }
    } catch (err) {
      console.error('Failed to send message', err);
    }
  }
});

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendBtn.click();
});

// function addMessage(text, className) {
//   const chatBox = document.getElementById('chatBox');
//   const message = document.createElement('div');
//   message.className = `message ${className}`;
//   message.innerText = text;
//   chatBox.appendChild(message);
//   chatBox.scrollTop = chatBox.scrollHeight;
// }

// async function sendMessage() {
//   const input = document.getElementById('userInput');
//   const text = input.value.trim();
//   if (!text) return;

//   addMessage(text, 'user');
//   input.value = "";

//   try {
//     const res = await fetch('/chat', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ message: text })
//     });
//     const data = await res.json();
//     addMessage(data.reply, 'bot');
//   } catch {
//     addMessage('Error connecting to server ❌', 'bot');
//   }
// }

// // Press Enter to send
// document.getElementById('userInput').addEventListener('keypress', e => {
//   if (e.key === 'Enter') sendMessage();
// });
function scrollChat(chatBox) {
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addMessage(text, className) {
  const chatBox = document.getElementById('chatBox');
  const message = document.createElement('div');
  message.className = `message ${className}`;
  message.innerText = text;

  // Add timestamp
  const time = document.createElement('span');
  time.style.fontSize = '10px';
  time.style.marginLeft = '8px';
  time.style.color = '#666';
  const now = new Date();
  const hours = now.getHours().toString().padStart(2,'0');
  const minutes = now.getMinutes().toString().padStart(2,'0');
  time.innerText = `${hours}:${minutes}`;
  message.appendChild(time);

  chatBox.appendChild(message);
  scrollChat(chatBox);
}

// Show typing indicator
function showTyping() {
  const chatBox = document.getElementById('chatBox');
  const typing = document.createElement('div');
  typing.className = 'message bot';
  typing.id = 'typing';
  typing.innerText = 'Hussain is typing...';
  chatBox.appendChild(typing);
  scrollChat(chatBox);
}

// Remove typing indicator
function removeTyping() {
  const typing = document.getElementById('typing');
  if (typing) typing.remove();
}

async function sendMessage() {
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text) return;

  // Show user message
  addMessage(text, 'user');
  input.value = '';

  // Show typing indicator
  showTyping();

  // Simulate delay (1.5 seconds)
  await new Promise(r => setTimeout(r, 1500));

  try {
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();

    // Remove typing indicator and show bot reply
    removeTyping();
    addMessage(data.reply, 'bot');
  } catch {
    removeTyping();
    addMessage('Error connecting to server ❌', 'bot');
  }
}

// Press Enter to send
document.getElementById('userInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});

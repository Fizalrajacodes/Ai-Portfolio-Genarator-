const BACKEND_URL = 'http://localhost:3000';  // Match the port change  // Change to your deployed URL if needed

// DOM Elements
const msgsDiv = document.getElementById('msgs');
const input = document.getElementById('input');
const sendBtn = document.getElementById('send');
const suggestionsDiv = document.getElementById('suggestions');

// Initialize the application
function init() {
  // Add suggestion buttons
  const suggestions = [
    'skills', 
    'projects', 
    'generate portfolio html', 
    'projects by React'
  ];
  
  suggestions.forEach(sug => {
    const btn = document.createElement('button');
    btn.textContent = sug;
    btn.onclick = () => sendMessage(sug);
    suggestionsDiv.appendChild(btn);
  });

  // Event Listeners
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const message = input.value.trim();
      if (message) {
        sendMessage(message);
      }
    });
  }
  
  if (input) {
    input.addEventListener('keypress', (e) => { 
      if (e.key === 'Enter') {
        const message = input.value.trim();
        if (message) {
          sendMessage(message);
        }
      }
    });
    input.focus();  // Auto-focus on load
  }

  // Welcome message on load
  addMessage('ai', 'Hi! I\'m your AI Portfolio Generator. Ask me about skills, projects, or generating HTML!');
}

// Send message to backend
async function sendMessage(message) {
  if (!message.trim()) return;

  // Display user message
  addMessage('user', message);
  if (input) input.value = '';  // Clear input

  // Show loading state
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'message ai loading';
  loadingDiv.innerHTML = '<strong>AI:</strong> Thinking...';
  msgsDiv.appendChild(loadingDiv);
  msgsDiv.scrollTop = msgsDiv.scrollHeight;

  try {
    // POST to backend
    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    // Remove loading message
    msgsDiv.removeChild(loadingDiv);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.reply) {
      addMessage('ai', data.reply);
    } else if (data.error) {
      addMessage('ai', `Error: ${data.error}`);
    } else {
      addMessage('ai', 'Sorry, I encountered an error. Try again!');
    }
  } catch (error) {
    console.error('Frontend Error:', error);
    // Remove loading message if it exists
    if (loadingDiv.parentNode === msgsDiv) {
      msgsDiv.removeChild(loadingDiv);
    }
    addMessage('ai', 'Connection error. Ensure the backend server is running on localhost:3000.');
  }
}

// Add message to chat UI
function addMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  
  // Sanitize text to prevent XSS and handle newlines
  const sanitizedText = text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
  
  msgDiv.innerHTML = `<strong>${sender.charAt(0).toUpperCase() + sender.slice(1)}:</strong> ${sanitizedText}`;
  msgsDiv.appendChild(msgDiv);
  msgsDiv.scrollTop = msgsDiv.scrollHeight;  // Auto-scroll to bottom
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Fallback initialization if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
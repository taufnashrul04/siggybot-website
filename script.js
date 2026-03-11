/* =========================================
   SiggyBot — Landing + Chat Logic
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // LANDING PAGE LOGIC
  // ============================================
  const landing = document.getElementById('landing');
  const app = document.getElementById('app');
  const enterBtn = document.getElementById('enter-btn');
  const backBtn = document.getElementById('back-btn');
  const particlesContainer = document.getElementById('particles');

  // Generate floating particles
  createParticles();

  function createParticles() {
    const count = 40;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDuration = (3 + Math.random() * 4) + 's';
      p.style.animationDelay = Math.random() * 5 + 's';
      p.style.width = (1 + Math.random() * 2) + 'px';
      p.style.height = p.style.width;
      particlesContainer.appendChild(p);
    }
  }

  function enterChat() {
    landing.classList.add('exit');
    setTimeout(() => {
      landing.classList.add('hidden');
      app.classList.remove('hidden');
      const input = document.getElementById('message-input');
      if (input) input.focus();
    }, 500);
  }

  function goBackToLanding() {
    app.classList.add('hidden');
    landing.classList.remove('hidden', 'exit');
  }

  // Enter button click
  enterBtn.addEventListener('click', enterChat);

  // Back button click
  backBtn.addEventListener('click', goBackToLanding);

  // Enter key on landing page
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !landing.classList.contains('hidden')) {
      e.preventDefault();
      enterChat();
    }
  });

  // ============================================
  // CHAT LOGIC
  // ============================================
  const chatArea = document.getElementById('chat-area');
  const messages = document.getElementById('messages');
  const welcome = document.getElementById('welcome');
  const form = document.getElementById('input-form');
  const input = document.getElementById('message-input');
  const sendBtn = document.getElementById('send-btn');
  const clearBtn = document.getElementById('clear-btn');
  const quickBtns = document.querySelectorAll('.quick-btn');

  let isWaiting = false;

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    sendBtn.disabled = !input.value.trim() || isWaiting;
  });

  // Send message on Enter (Shift+Enter for newline)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.value.trim() && !isWaiting) form.dispatchEvent(new Event('submit'));
    }
  });

  // Quick action buttons
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isWaiting) return;
      input.value = btn.dataset.prompt;
      sendBtn.disabled = false;
      form.dispatchEvent(new Event('submit'));
    });
  });

  // Clear chat
  clearBtn.addEventListener('click', () => {
    messages.innerHTML = '';
    welcome.classList.remove('hidden');
    input.value = '';
    sendBtn.disabled = true;
    isWaiting = false;
  });

  // Handle form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || isWaiting) return;

    // Hide welcome
    welcome.classList.add('hidden');

    // Add user message
    addMessage(text, 'user');

    // Clear input
    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;
    isWaiting = true;

    // Show typing indicator
    showTyping();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();
      removeTyping();

      if (data.reply) {
        addMessage(data.reply, 'ai');
      } else if (data.error) {
        addMessage('*glItCh* ... multiverse error. mEow. 🐱', 'ai');
      }
    } catch (error) {
      console.error('Chat error:', error);
      removeTyping();
      addMessage('*glItCh* ... can\'t reach the multiverse server. mEow. 🐱', 'ai');
    } finally {
      isWaiting = false;
      sendBtn.disabled = !input.value.trim();
    }
  });

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `message ${type}`;

    const avatarHTML = type === 'ai'
      ? `<img src="siggy.png" alt="SiggyBot" class="msg-avatar">`
      : '';

    const formattedText = type === 'ai' ? formatResponse(text) : escapeHtml(text);

    msg.innerHTML = `
      ${avatarHTML}
      <div class="msg-bubble">${formattedText}</div>
    `;

    messages.appendChild(msg);
    scrollToBottom();
  }

  function formatResponse(text) {
    let formatted = escapeHtml(text);

    // Bold **text**
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic *text*
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Bullet points
    formatted = formatted.replace(/^[•\-]\s+(.+)/gm, '<span class="bullet">•</span> $1');

    // Numbered lists
    formatted = formatted.replace(/^(\d+)\.\s+(.+)/gm, '<span class="bullet">$1.</span> $2');

    // Newlines
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'message ai';
    typing.id = 'typing-msg';
    typing.innerHTML = `
      <img src="siggy.png" alt="SiggyBot" class="msg-avatar">
      <div class="msg-bubble typing-indicator">
        <span></span><span></span><span></span>
      </div>
    `;
    messages.appendChild(typing);
    scrollToBottom();
  }

  function removeTyping() {
    const t = document.getElementById('typing-msg');
    if (t) t.remove();
  }

  function scrollToBottom() {
    chatArea.scrollTo({
      top: chatArea.scrollHeight,
      behavior: 'smooth'
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});

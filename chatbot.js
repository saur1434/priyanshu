// Chatbot Knowledge Base
const chatbotKnowledge = {
  greeting: [
    "Hello! Welcome to GoCabn Go. How can I assist you?",
    "Hi there! 👋 What can I help you with today?",
    "Hey! Welcome to GoCabn Go. What brings you here?"
  ],
  booking: [
    "📅 **Booking Information:**\n\n• Visit our website and click 'Login' to create an account\n• Browse available rooms and select your dates\n• Complete the booking process with your payment details\n• You'll receive a confirmation email immediately\n• Check-in: 2:00 PM | Check-out: 11:00 AM",
    "🏨 **Easy Booking Steps:**\n1. Register on our platform\n2. Select your preferred room type\n3. Choose dates and duration\n4. Make payment\n5. Instant confirmation!\n\nNeed help? Contact our support team 24/7!"
  ],
  pricing: [
    "💰 **Room Pricing:**\n\n• **Standard Room**: $80-100/night\n• **Deluxe Room**: $120-150/night\n• **Suite**: $200-250/night\n• **Private Cabin**: $300-400/night\n\nSpecial discounts available for:\n✓ Long-term stays (7+ nights)\n✓ Group bookings\n✓ Seasonal promotions",
    "📊 **Our Rates:**\nPrices vary by season:\n• **Peak Season** (Dec-Jan): Higher rates\n• **Off-Season** (Jun-Aug): 20% discount\n• **Shoulder Season**: Standard rates\n\nBook now for best deals!"
  ],
  contact: [
    "📞 **Contact GoCabn Go:**\n\n📍 Address: 3015 Grand Ave, Coconut Grove, FL 123456\n📧 Email: support@gocabingo.com\n📱 Phone: +1 234-567-8900\n⏰ Available: 24/7 Customer Service\n\nWe're here to help!",
    "☎️ **Get in Touch:**\nCall us: +1 (555) 123-4567\nEmail: demoexample@gmail.com\nChat with us: Available 24/7\nVisit us: Coconut Grove, Florida"
  ],
  facilities: [
    "✨ **GoCabn Go Premium Services:**\n\n🏊 Swimming Pool & Spa\n🍽️ Multi-cuisine Restaurant\n🎵 Live Music Entertainment\n🚴 Curated Experiences & Activities\n🌴 Private Beach Access\n🎪 Conference Halls\n🏋️ Fitness Center\n🛎️ Concierge Service 24/7",
    "🌟 **What We Offer:**\n• Luxury rooms with sea view\n• World-class dining\n• Adventure activities\n• Wellness spa\n• Island boat tours\n• Wedding & event facilities\n• Free WiFi throughout\n• Airport shuttle service"
  ],
  rooms: [
    "🛏️ **Room Types Available:**\n\n**Standard Room**\n- TV, AC, Basic Amenities\n\n**Deluxe Room**\n- Ocean View, Premium Amenities\n\n**Suite**\n- Separate Living Area, Jacuzzi\n\n**Private Cabin**\n- Exclusive Beach Access, Luxury Amenities",
    "🏠 **Our Rooms:**\nAll rooms feature:\n✓ Modern furnishings\n✓ Free high-speed WiFi\n✓ 24-hour room service\n✓ Premium toiletries\n✓ Air conditioning\n\nChoose what suits you best!"
  ],
  amenities: [
    "🌟 **Amenities Included:**\n\n✓ Free WiFi\n✓ Air Conditioning\n✓ Flat-screen TV\n✓ Power Shower\n✓ Room Service 24/7\n✓ Mini Bar\n✓ Safe Deposit Box\n✓ Hair Dryer\n✓ Premium Toiletries\n✓ Work Desk",
    "🛎️ **Hotel Amenities:**\n• Gym & yoga studio\n• Spa & wellness center\n• Restaurant & bar\n• Pool & water park\n• Kids play area\n• Game room\n• Business center\n• Laundry service"
  ],
  cancel: [
    "❌ **Cancellation Policy:**\n\n• **Free Cancellation**: Up to 48 hours before check-in\n• **50% Refund**: 24-48 hours before check-in\n• **No Refund**: Less than 24 hours before check-in\n\nTo cancel, log in to your account and select 'Cancel Booking'",
    "📋 **Our Cancellation Terms:**\n- No questions asked within 48 hours\n- Partial refund for 24-48 hour cancellations\n- Visit your account to manage bookings\n- Need help? Call support!"
  ],
  payment: [
    "💳 **Payment Methods:**\n\n✓ Credit Card (Visa, MasterCard, American Express)\n✓ Debit Card\n✓ PayPal\n✓ Apple Pay\n✓ Google Pay\n✓ Bank Transfer\n✓ Cryptocurrency (Bitcoin, Ethereum)\n\n🔒 All payments are secure & encrypted!",
    "🔐 **Secure Payments:**\n- SSL encryption\n- PCI DSS compliant\n- No extra charges\n- Instant confirmation\n- Multiple options available"
  ],
  default: [
    "I'm not sure about that. Let me help you with:\n• 🏨 Booking Information\n• 💰 Pricing\n• 📞 Contact Details\n• ✨ Facilities\n• 🛏️ Rooms\n• 💳 Payments\n\nOr feel free to contact our team directly!",
    "Sorry, I didn't quite understand. Could you try asking about:\n• Booking\n• Pricing\n• Contact info\n• Facilities\n\nI'm here to help! 😊"
  ]
};

class ChatbotManager {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.init();
    this.setupKeywordMatcher();
  }

  init() {
    this.chatBubble = document.getElementById('chatbot-toggle');
    this.chatWindow = document.getElementById('chatbot-window');
    this.chatMessages = document.getElementById('chatbot-messages');
    this.chatInput = document.getElementById('chatbot-input');
    this.sendBtn = document.getElementById('chatbot-send');
    this.closeBtn = document.getElementById('chatbot-close');
    this.suggestionBtns = document.querySelectorAll('.suggestion-btn');

    // Event Listeners
    this.chatBubble.addEventListener('click', () => this.toggleChat());
    this.closeBtn.addEventListener('click', () => this.toggleChat());
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    // Suggestion buttons
    this.suggestionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.dataset.query;
        this.chatInput.value = query;
        this.sendMessage();
      });
    });

    // Load chat history from localStorage
    this.loadChatHistory();
  }

  setupKeywordMatcher() {
    this.keywords = {
      booking: ['book', 'reserve', 'reservation', 'check-in', 'check in'],
      pricing: ['price', 'cost', 'rate', 'fee', 'expensive', 'cheaper', 'discount'],
      contact: ['contact', 'phone', 'email', 'address', 'support', 'help', 'reach'],
      facilities: ['facility', 'facilities', 'amenity', 'amenities', 'what do you have', 'offer', 'service'],
      rooms: ['room', 'cabin', 'suite', 'deluxe', 'standard', 'bedroom', 'stay'],
      amenities: ['amenities', 'provided', 'included', 'offer', 'tv', 'wifi', 'air conditioning'],
      cancel: ['cancel', 'cancellation', 'refund', 'return', 'withdraw'],
      payment: ['payment', 'pay', 'card', 'credit', 'debit', 'paypal', 'method']
    };
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.chatWindow.classList.toggle('hidden');
    
    if (this.isOpen) {
      this.chatInput.focus();
    }
  }

  sendMessage() {
    const message = this.chatInput.value.trim();
    if (!message) return;

    // Display user message
    this.addMessage(message, 'user');
    this.chatInput.value = '';

    // Show typing indicator
    this.showTypingIndicator();

    // Send to backend and get response
    setTimeout(() => {
      this.getBotResponse(message);
    }, 500);
  }

  addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender === 'user' ? 'user-message' : 'bot-message'}`;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (sender === 'bot' && text.includes('\n')) {
      // Format bot messages with markdown
      const formattedText = this.formatMessage(text);
      messageDiv.innerHTML = `
        <p>${formattedText}</p>
        <p class="message-time">${time}</p>
      `;
    } else {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      
      const timeDiv = document.createElement('p');
      timeDiv.className = 'message-time';
      timeDiv.textContent = time;

      messageDiv.appendChild(paragraph);
      messageDiv.appendChild(timeDiv);
    }

    this.chatMessages.appendChild(messageDiv);
    this.scrollToBottom();
    this.saveChatHistory();
  }

  formatMessage(text) {
    return text
      .replace(/\*\*/g, '<strong>')
      .replace(/\*\*/g, '</strong>')
      .replace(/\n/g, '<br>')
      .replace(/•/g, '&bull;');
  }

  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    this.chatMessages.appendChild(typingDiv);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) typingIndicator.remove();
  }

  getBotResponse(userMessage) {
    // Remove typing indicator
    this.removeTypingIndicator();

    // Determine intent from keywords
    const intent = this.detectIntent(userMessage.toLowerCase());
    
    // Get random response from knowledge base
    const responses = chatbotKnowledge[intent] || chatbotKnowledge.default;
    const response = responses[Math.floor(Math.random() * responses.length)];

    // Add bot response
    this.addMessage(response, 'bot');

    // Update badge
    this.updateBadge();
  }

  detectIntent(message) {
    message = message.toLowerCase();

    for (const [intent, keywords] of Object.entries(this.keywords)) {
      for (const keyword of keywords) {
        if (message.includes(keyword)) {
          return intent;
        }
      }
    }

    return 'default';
  }

  updateBadge() {
    const badge = document.querySelector('.chat-badge');
    if (badge) {
      const currentCount = parseInt(badge.textContent);
      badge.textContent = (currentCount + 1) % 10;
    }
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  saveChatHistory() {
    const messages = [];
    document.querySelectorAll('.chat-message').forEach(msg => {
      const text = msg.querySelector('p:first-child')?.textContent || '';
      const sender = msg.classList.contains('user-message') ? 'user' : 'bot';
      if (text && text !== 'Just now') {
        messages.push({ text, sender, time: new Date().toISOString() });
      }
    });
    localStorage.setItem('chatHistory', JSON.stringify(messages.slice(-20))); // Keep last 20 messages
  }

  loadChatHistory() {
    const history = localStorage.getItem('chatHistory');
    if (history) {
      try {
        const messages = JSON.parse(history);
        // Clear existing messages except welcome
        const messagesContainer = this.chatMessages;
        const welcomeMsg = messagesContainer.querySelector('.bot-message');
        messagesContainer.innerHTML = '';
        if (welcomeMsg) messagesContainer.appendChild(welcomeMsg);
        
        // Load history
        messages.forEach(msg => {
          this.addMessage(msg.text, msg.sender);
        });
      } catch (e) {
        console.log('Could not load chat history');
      }
    }
  }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const chatbot = new ChatbotManager();
  console.log('🤖 GoCabn Go Chatbot initialized!');
});

class ChatInterface {
    constructor() {
        this.chatVisible = false;
        this.conversationHistory = [];
        this.currentConversationId = null;
        
        // Dynamically choose backend URL based on current environment
        this.backendUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:8000'  // Development environment
            : 'https://finosage-backend.onrender.com';  // Production environment
        
        this.initializeChat();
    }

    initializeChat() {
        // Create chat container
        const chatContainer = document.createElement('div');
        chatContainer.className = 'chat-container';
        chatContainer.style.display = 'none';
        chatContainer.innerHTML = `
            <div class="chat-header">
                <h3>FinoSage</h3>
                <button id="closeChat"><i class="fas fa-times"></i></button>
            </div>
            <div class="chat-messages" id="chatMessages"></div>
            <div class="typing-indicator" id="typingIndicator">
                <i class="fas fa-ellipsis-h"></i> Thinking...
            </div>
            <div class="chat-input">
                <input type="text" id="messageInput" placeholder="Type your message...">
                <button id="sendButton"><i class="fas fa-paper-plane"></i></button>
            </div>
        `;
        document.body.appendChild(chatContainer);

        // Create chat toggle button
        const chatToggle = document.createElement('div');
        chatToggle.className = 'chat-toggle';
        chatToggle.innerHTML = '<i class="fa-duotone fa-solid fa-headset"></i>';
        document.body.appendChild(chatToggle);

        // Add event listeners
        chatToggle.addEventListener('click', () => this.toggleChat());
        document.getElementById('closeChat').addEventListener('click', () => this.toggleChat());
        document.getElementById('sendButton').addEventListener('click', () => this.sendMessage());
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Add welcome message
        this.displayMessage('Hello! I\'m your FinoSage assistant. How can I help you today?', 'assistant');
    }

    toggleChat() {
        const chatContainer = document.querySelector('.chat-container');
        this.chatVisible = !this.chatVisible;
        chatContainer.style.display = this.chatVisible ? 'flex' : 'none';
    }

    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        if (!message) return;

        // Display user message
        this.displayMessage(message, 'user');
        messageInput.value = '';

        // Show typing indicator with animation
        this.showTypingIndicator();

        try {
            // Add message to conversation history
            this.conversationHistory.push({
                role: 'user',
                content: message
            });

            // Send message to backend
            const response = await fetch(`${this.backendUrl}/api/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    prompt: message,
                    conversation_id: this.currentConversationId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            
            // Hide typing indicator
            this.hideTypingIndicator();

            // Update conversation ID if provided
            if (data.conversation_id) {
                this.currentConversationId = data.conversation_id;
            }

            // Display AI response with a small delay
            setTimeout(() => {
                this.displayMessage(data.response, 'assistant');

                // Add AI response to history
                this.conversationHistory.push({
                    role: 'assistant',
                    content: data.response
                });

                // Add quick reply suggestions for follow-up questions
                this.addQuickReplies(data.response);
            }, 500);

        } catch (error) {
            this.hideTypingIndicator();
            console.error('Error sending message:', error);
            this.displayMessage('Sorry, I encountered an error. Please try again.', 'assistant');
        }
    }

    displayMessage(content, role) {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${role}`;
        
        // Format the content with proper line breaks and bullet points
        const formattedContent = content
            .replace(/\n/g, '<br>')
            .replace(/•/g, '• ');
            
        messageElement.innerHTML = `<div class="message-content">${formattedContent}</div>`;
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(10px)';
        chatMessages.appendChild(messageElement);
        
        // Animate the message appearance
        setTimeout(() => {
            messageElement.style.transition = 'all 0.3s ease-out';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        }, 10);
        
        this.scrollToBottom();
    }

    addQuickReplies(response) {
        const chatMessages = document.getElementById('chatMessages');
        const quickRepliesContainer = document.createElement('div');
        quickRepliesContainer.className = 'quick-replies';
        
        // Extract suggested topics and follow-up questions from the response
        const topics = response.match(/• ([^\n]+)/g);
        if (topics) {
            topics.forEach(topic => {
                const button = document.createElement('button');
                button.className = 'quick-reply-button';
                const questionText = topic.replace('• ', '');
                button.textContent = questionText;
                button.addEventListener('click', () => {
                    // Set the input value first
                    const messageInput = document.getElementById('messageInput');
                    messageInput.value = questionText;
                    
                    // Add a small delay before sending
                    setTimeout(() => {
                        // Call sendMessage which will handle displaying and sending
                        this.sendMessage();
                    }, 300);
                });
                quickRepliesContainer.appendChild(button);
            });
            
            chatMessages.appendChild(quickRepliesContainer);
            this.scrollToBottom();
        }
    }

    showTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        typingIndicator.style.display = 'block';
        typingIndicator.style.opacity = '0';
        typingIndicator.style.transform = 'translateY(10px)';
        
        // Animate the typing indicator appearance
        setTimeout(() => {
            typingIndicator.style.transition = 'all 0.3s ease-out';
            typingIndicator.style.opacity = '1';
            typingIndicator.style.transform = 'translateY(0)';
        }, 10);
        
        // Add typing animation
        const dots = typingIndicator.querySelector('.typing-dots');
        if (dots) {
            dots.style.animation = 'typing 2s infinite';
        }
        
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        typingIndicator.style.transition = 'all 0.3s ease-out';
        typingIndicator.style.opacity = '0';
        typingIndicator.style.transform = 'translateY(-10px)';
        
        // Remove typing animation and hide after transition
        setTimeout(() => {
            typingIndicator.style.display = 'none';
            const dots = typingIndicator.querySelector('.typing-dots');
            if (dots) {
                dots.style.animation = 'none';
            }
        }, 300);
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatInterface();
}); 
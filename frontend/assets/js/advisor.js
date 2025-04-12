// Utility Functions
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
};

const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

// Import DeepseekClient
import DeepseekClient from './api/deepseek-client.js';

// Initialize DeepseekClient
const deepseekClient = new DeepseekClient();

// Chat Interface Variables
let currentConversationId = null;
let isTyping = false;
let chatVisible = false;
let conversationHistory = [];

// Market Research Functions
const searchMarket = async (query) => {
    try {
        const response = await deepseekClient.searchMarket(query);
        updateMarketTrends(response.trends);
        updateAIInsights(response.insights);
    } catch (error) {
        console.error('Error searching market:', error);
        showNotification('Failed to search market', 'error');
    }
};

const updateMarketTrends = (trends) => {
    const trendsContainer = document.getElementById('marketTrends');
    if (trendsContainer) {
        trendsContainer.innerHTML = trends.map(trend => `
            <div class="trend-item">
                <h4>${trend.title}</h4>
                <p>${trend.description}</p>
            </div>
        `).join('');
    }
};

const updateAIInsights = (insights) => {
    const insightsContainer = document.getElementById('aiInsights');
    if (insightsContainer) {
        insightsContainer.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <h4>${insight.title}</h4>
                <p>${insight.description}</p>
            </div>
        `).join('');
    }
};

// UI Notification Function
const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
};

// Chat Interface Functions
const toggleChat = () => {
    const chatInterface = document.getElementById('chatInterface');
    chatVisible = !chatVisible;
    
    if (chatVisible) {
        chatInterface.style.display = 'flex';
    } else {
        chatInterface.style.display = 'none';
    }
};

const toggleConversationList = () => {
    const conversationList = document.getElementById('conversationList');
    const chatMessages = document.getElementById('chatMessages');
    
    if (conversationList.style.display === 'flex') {
        conversationList.style.display = 'none';
        chatMessages.style.display = 'flex';
    } else {
        conversationList.style.display = 'flex';
        chatMessages.style.display = 'none';
    }
};

const loadConversations = async () => {
    try {
        // Since we don't have a real API, just show a placeholder
        const conversationList = document.getElementById('conversationList');
        
        // Clear current list
        conversationList.innerHTML = '';
        
        // Display placeholder for demo
        conversationList.innerHTML = '<div class="no-conversations">No previous conversations available in demo mode</div>';
        
    } catch (error) {
        console.error('Error loading conversations:', error);
        showNotification('Failed to load conversations', 'error');
    }
};

const loadConversation = async (conversationId) => {
    try {
        // In demo mode, just show a message
        showNotification('Loading previous conversations not available in demo mode', 'info');
        
        // Go back to current chat
        const conversationList = document.getElementById('conversationList');
        const chatMessages = document.getElementById('chatMessages');
        conversationList.style.display = 'none';
        chatMessages.style.display = 'flex';
        
    } catch (error) {
        console.error('Error loading conversation:', error);
        showNotification('Failed to load conversation', 'error');
    }
};

const startNewConversation = () => {
    // Reset conversation ID
    currentConversationId = null;
    
    // Clear chat messages
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    
    // Add welcome message
    displayMessage('Hello! I\'m your FinoSage AI Assistant. How can I help with your financial questions today?', 'assistant');
    
    // Toggle back to chat view if needed
    const conversationList = document.getElementById('conversationList');
    conversationList.style.display = 'none';
    chatMessages.style.display = 'flex';
};

const sendMessage = async (message) => {
    if (!message.trim()) return;
    
    // Display user message
    displayMessage(message, 'user');
    
    // Clear input
    document.getElementById('messageInput').value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Add the current message to history
        conversationHistory.push({
            role: 'user',
            content: message
        });
        
        // Send message to Deepseek
        const response = await deepseekClient.chatCompletion(conversationHistory);
        
        // Hide typing indicator
        hideTypingIndicator();
        
        // Display AI response
        displayMessage(response.content, 'assistant');
        
        // Add AI response to history
        conversationHistory.push({
            role: 'assistant',
            content: response.content
        });
        
        // Scroll to bottom
        scrollToBottom();
    } catch (error) {
        hideTypingIndicator();
        console.error('Error sending message:', error);
        showNotification('Failed to get a response', 'error');
    }
};

const displayMessage = (content, role) => {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${role}`;
    messageElement.innerHTML = `<div class="message-content">${content}</div>`;
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    scrollToBottom();
};

const scrollToBottom = () => {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

const showTypingIndicator = () => {
    if (isTyping) return;
    
    isTyping = true;
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.style.display = 'block';
    
    // Scroll to bottom
    scrollToBottom();
};

const hideTypingIndicator = () => {
    isTyping = false;
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.style.display = 'none';
};

// Check if user is authenticated
async function checkAuth() {
    try {
        // Simplified auth check for demo purposes
        // In a real app, this would call an API to validate the user's session
        const userName = localStorage.getItem('userName');
        return !!userName && userName !== 'Guest';
    } catch (error) {
        console.error('Authentication error:', error);
        return false;
    }
}

// Tool Navigation
function handleToolSelection(tool) {
    if (tool === 'research') {
        // Show the research interface
        document.querySelector('.research-container').style.display = 'flex';
        document.querySelector('.welcome-section').style.display = 'none';
        document.querySelector('.tools-grid').style.display = 'none';
    } else if (tool === 'builder') {
        // Redirect to portfolio builder
        window.location.href = 'portfolio-builder.html';
    }
}

// Back to tools functionality
function handleBackToTools() {
    document.querySelector('.research-container').style.display = 'none';
    document.querySelector('.welcome-section').style.display = 'block';
    document.querySelector('.tools-grid').style.display = 'grid';
}

// Add event listeners once the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Tool selection buttons
    const toolButtons = document.querySelectorAll('.tool-select-btn');
    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tool = button.getAttribute('data-tool');
            handleToolSelection(tool);
        });
    });
    
    // Back to tools button
    const backButton = document.getElementById('backToTools');
    if (backButton) {
        backButton.addEventListener('click', handleBackToTools);
    }
    
    // Chat toggle button
    const chatToggle = document.querySelector('.chat-toggle');
    if (chatToggle) {
        chatToggle.addEventListener('click', toggleChat);
    }
    
    // Close chat button
    const closeChat = document.getElementById('closeChat');
    if (closeChat) {
        closeChat.addEventListener('click', toggleChat);
    }
    
    // New conversation button
    const newChatButton = document.getElementById('newChatButton');
    if (newChatButton) {
        newChatButton.addEventListener('click', startNewConversation);
    }
    
    // Conversation list toggle
    const conversationsButton = document.getElementById('conversationsButton');
    if (conversationsButton) {
        conversationsButton.addEventListener('click', toggleConversationList);
    }
    
    // Message send button
    const sendButton = document.getElementById('sendButton');
    if (sendButton) {
        sendButton.addEventListener('click', () => {
            const messageInput = document.getElementById('messageInput');
            sendMessage(messageInput.value);
        });
    }
    
    // Message input keypress event
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage(messageInput.value);
            }
        });
    }
    
    // Add search event listener
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = document.getElementById('searchInput').value;
            if (query.trim()) {
                searchMarket(query);
            }
        });
    }
    
    // Start with a welcome message in chat
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages && chatMessages.children.length <= 1) {
        startNewConversation();
    }
}); 
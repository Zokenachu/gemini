// Replace with your actual API key
const API_KEY = 'AIzaSyAy6Dvtf6Lg7sb3mv4TDniXxcy7l7pshL0';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const modelSelector = document.getElementById('model-selector');

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessageToChat('user', message);
    userInput.value = '';

    try {
        const selectedModel = modelSelector.value;
        
        // Call Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${selectedModel}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Check if we have a valid response
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            addMessageToChat('ai', aiResponse);
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Error:', error);
        addMessageToChat('ai', 'Sorry, I encountered an error. Please try again.');
    }
}

function addMessageToChat(sender, message) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container', `${sender}-container`);

    const iconDiv = document.createElement('div');
    iconDiv.classList.add('message-icon', `${sender}-icon`);

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    // Use markdown parsing for AI messages only
    if (sender === 'ai') {
        messageDiv.innerHTML = marked.parse(message);
    } else {
        messageDiv.textContent = message;
    }

    messageContainer.appendChild(iconDiv);
    messageContainer.appendChild(messageDiv);
    chatMessages.appendChild(messageContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}); 
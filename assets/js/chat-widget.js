// chat-widget.js - Premium chat widget for shaunraj.com
(function() {
    // Configuration - matches your website's design language
    const config = {
        herokuUrl: 'https://cas-agent-d1b1fe6032c4.herokuapp.com', // Your Heroku app URL
        primaryColor: '#6366F1',        // Matches your website's primary color
        accentColor: '#8B5CF6',         // Matches your website's accent color
        backgroundDark: '#0F172A',      // Matches your website's dark background
        textLight: '#F8FAFC',           // Matches your website's light text
        borderRadius: '0.75rem',        // Matches your website's border radius
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif", // Matches your font
        initialMessage: "Hello there, I am CAS, Shaun's AI Assistant! How can I help you with scheduling appointments or answering questions about Shaun's AI consulting services?"
    };

    // Create style element with your website's premium aesthetic
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
        .sr-chat-widget-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            font-family: ${config.fontFamily};
            width: 380px;
            transition: all 0.3s ease;
            transform: translateY(30px);
            opacity: 0;
            pointer-events: none;
        }
        
        .sr-chat-widget-container.active {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
        }
        
        .sr-chat-widget-container.minimized .sr-chat-widget-body,
        .sr-chat-widget-container.minimized .sr-chat-widget-footer {
            display: none;
        }
        
        .sr-chat-widget-header {
            background: linear-gradient(135deg, ${config.primaryColor}, ${config.accentColor});
            color: ${config.textLight};
            padding: 15px 20px;
            border-radius: ${config.borderRadius} ${config.borderRadius} 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .sr-chat-widget-container.minimized .sr-chat-widget-header {
            border-radius: ${config.borderRadius};
        }
        
        .sr-chat-widget-title {
            font-weight: 600;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .sr-chat-widget-title-icon {
            width: 24px;
            height: 24px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
        }
        
        .sr-chat-widget-controls {
            display: flex;
            gap: 10px;
        }
        
        .sr-chat-widget-control {
            background: none;
            border: none;
            color: ${config.textLight};
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            width: 24px;
            height: 24px;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        
        .sr-chat-widget-control:hover {
            opacity: 1;
        }
        
        .sr-chat-widget-body {
            background-color: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            height: 320px;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            border-left: 1px solid rgba(255, 255, 255, 0.05);
            border-right: 1px solid rgba(255, 255, 255, 0.05);
            scrollbar-width: thin;
            scrollbar-color: ${config.primaryColor} ${config.backgroundDark};
        }
        
        .sr-chat-widget-body::-webkit-scrollbar {
            width: 6px;
            background-color: ${config.backgroundDark};
        }
        
        .sr-chat-widget-body::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, ${config.primaryColor}, ${config.accentColor});
            border-radius: 3px;
        }
        
        .sr-chat-message {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 16px;
            line-height: 1.5;
            font-size: 14px;
            position: relative;
            transition: all 0.3s ease;
            transform: translateY(10px);
            opacity: 0;
            animation: fadeInMessage 0.3s forwards;
            white-space: pre-wrap;
        }
        
        @keyframes fadeInMessage {
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .sr-chat-message-assistant {
            background-color: rgba(99, 102, 241, 0.15);
            color: ${config.textLight};
            align-self: flex-start;
            border-radius: 16px 16px 16px 0;
        }
        
        .sr-chat-message-user {
            background-color: rgba(99, 102, 241, 0.3);
            color: ${config.textLight};
            align-self: flex-end;
            border-radius: 16px 16px 0 16px;
        }
        
        .sr-chat-widget-footer {
            background-color: rgba(15, 23, 42, 0.95);
            border-radius: 0 0 ${config.borderRadius} ${config.borderRadius};
            padding: 15px;
            display: flex;
            gap: 10px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-top: none;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .sr-chat-widget-input {
            flex: 1;
            background-color: rgba(30, 41, 59, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: ${config.borderRadius};
            padding: 10px 15px;
            color: ${config.textLight};
            font-family: ${config.fontFamily};
            font-size: 14px;
            outline: none;
            transition: all 0.3s;
        }
        
        .sr-chat-widget-input:focus {
            border-color: ${config.primaryColor};
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
        
        .sr-chat-widget-send {
            background: linear-gradient(135deg, ${config.primaryColor}, ${config.accentColor});
            color: white;
            border: none;
            border-radius: ${config.borderRadius};
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s;
            flex-shrink: 0;
        }
        
        .sr-chat-widget-send:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
        
        .sr-chat-widget-send:disabled {
            opacity: 0.6;
            transform: none;
            cursor: not-allowed;
        }
        
        .sr-chat-widget-toggle {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${config.primaryColor}, ${config.accentColor});
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 5px 20px rgba(99, 102, 241, 0.4);
            z-index: 9998;
            transition: all 0.3s ease;
        }
        
        .sr-chat-widget-toggle:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
        }
        
        .sr-chat-widget-toggle-icon {
            font-size: 24px;
            transition: transform 0.3s ease;
        }
        
        .sr-chat-widget-toggle.active .sr-chat-widget-toggle-icon {
            transform: rotate(45deg);
        }
        
        .sr-typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 8px 16px;
            background-color: rgba(99, 102, 241, 0.1);
            border-radius: 12px;
            align-self: flex-start;
            margin-top: -5px;
        }
        
        .sr-typing-dot {
            width: 6px;
            height: 6px;
            background-color: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            animation: typing-animation 1.4s infinite ease-in-out both;
        }
        
        .sr-typing-dot:nth-child(1) {
            animation-delay: 0s;
        }
        
        .sr-typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .sr-typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typing-animation {
            0%, 100% {
                transform: scale(1);
                opacity: 0.7;
            }
            50% {
                transform: scale(1.3);
                opacity: 1;
            }
        }
        
        /* Mobile Responsive Design - matches your site's mobile responsiveness */
        @media (max-width: 576px) {
            .sr-chat-widget-container {
                width: calc(100% - 40px);
                right: 20px;
                bottom: 20px;
            }
            
            .sr-chat-widget-toggle {
                width: 50px;
                height: 50px;
                right: 20px;
                bottom: 20px;
            }
        }
    `;
    document.head.appendChild(styleEl);

    // Create toggle button element
    const toggleBtn = document.createElement('div');
    toggleBtn.className = 'sr-chat-widget-toggle';
    toggleBtn.innerHTML = '<span class="sr-chat-widget-toggle-icon">💬</span>';
    document.body.appendChild(toggleBtn);

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'sr-chat-widget-container minimized';
    document.body.appendChild(widgetContainer);

    // Build widget HTML
    widgetContainer.innerHTML = `
        <div class="sr-chat-widget-header">
            <div class="sr-chat-widget-title">
                <div class="sr-chat-widget-title-icon">💬</div>
                <span>Chat with Shaun's Assistant</span>
            </div>
            <div class="sr-chat-widget-controls">
                <button class="sr-chat-widget-control sr-chat-widget-minimize">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="sr-chat-widget-body">
            <!-- Messages will be displayed here -->
        </div>
        <div class="sr-chat-widget-footer">
            <input type="text" class="sr-chat-widget-input" placeholder="Type your message...">
            <button class="sr-chat-widget-send" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                </svg>
            </button>
        </div>
    `;

    // Get elements
    const chatBody = widgetContainer.querySelector('.sr-chat-widget-body');
    const chatInput = widgetContainer.querySelector('.sr-chat-widget-input');
    const chatSendBtn = widgetContainer.querySelector('.sr-chat-widget-send');
    const minimizeBtn = widgetContainer.querySelector('.sr-chat-widget-minimize');
    const chatHeader = widgetContainer.querySelector('.sr-chat-widget-header');

    // Chat state
    let isChatOpen = false;
    let isTyping = false;
    let conversationId = null;

    // Initialize
    function init() {
        // Toggle chat widget
        toggleBtn.addEventListener('click', toggleChat);
        
        // Header click to toggle minimize
        chatHeader.addEventListener('click', function(e) {
            if (e.target.closest('.sr-chat-widget-control')) return;
            if (!isChatOpen) return;
            
            widgetContainer.classList.toggle('minimized');
        });
        
        // Minimize button
        minimizeBtn.addEventListener('click', function() {
            widgetContainer.classList.add('minimized');
        });
        
        // Send message on button click
        chatSendBtn.addEventListener('click', sendMessage);
        
        // Send message on Enter key
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Enable/disable button based on input
        chatInput.addEventListener('input', function() {
            chatSendBtn.disabled = chatInput.value.trim() === '';
        });
        
        // Add welcome message with slight delay
        setTimeout(() => {
            addMessage(config.initialMessage, 'assistant');
        }, 500);
    }

    // Toggle chat open/closed
    function toggleChat() {
        isChatOpen = !isChatOpen;
        
        if (isChatOpen) {
            widgetContainer.classList.remove('minimized');
            widgetContainer.classList.add('active');
            toggleBtn.classList.add('active');
            
            // Scroll to bottom of chat
            setTimeout(() => {
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 100);
        } else {
            widgetContainer.classList.remove('active');
            toggleBtn.classList.remove('active');
        }
    }

    // Add a message to the chat
    function addMessage(text, role) {
        const messageEl = document.createElement('div');
        messageEl.className = `sr-chat-message sr-chat-message-${role}`;
        
        // Format URLs as links
        const formattedText = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: #A5B4FC; text-decoration: underline;">$1</a>');
        
        messageEl.innerHTML = formattedText;
        chatBody.appendChild(messageEl);
        
        // Scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'sr-typing-indicator';
        indicator.innerHTML = `
            <div class="sr-typing-dot"></div>
            <div class="sr-typing-dot"></div>
            <div class="sr-typing-dot"></div>
        `;
        
        chatBody.appendChild(indicator);
        chatBody.scrollTop = chatBody.scrollHeight;
        return indicator;
    }

    // Send message to backend
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message || isTyping) return;
        
        // Clear input
        chatInput.value = '';
        chatSendBtn.disabled = true;
        
        // Add user message to chat
        addMessage(message, 'user');
        
        // Show typing indicator
        isTyping = true;
        const typingIndicator = showTypingIndicator();
        
        try {
            // Generate unique conversation ID if not exists
            if (!conversationId) {
                conversationId = 'web_user_' + Date.now();
            }
            
            // Send to backend
            const response = await fetch(`${config.herokuUrl}/webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Body: message,
                    From: conversationId,
                }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            // Get response as plain text (no longer XML)
            const responseText = await response.text();
            
            // Remove typing indicator
            typingIndicator.remove();
            
            // Add response to chat with slight delay for natural feel
            setTimeout(() => {
                // Use the response text directly without XML parsing
                addMessage(responseText || "I didn't catch that. Could you please try again?", 'assistant');
                isTyping = false;
            }, 500);
            
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Remove typing indicator
            typingIndicator.remove();
            
            // Add error message
            addMessage("I'm having trouble connecting. Please try again later.", 'assistant');
            isTyping = false;
        }
    }

    // Initialize the chat widget
    init();
})();
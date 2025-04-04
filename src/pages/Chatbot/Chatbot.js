import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { IoSendSharp } from "react-icons/io5";
import { CHATBOT_URL } from '../../constants/config';
import { useNavigate } from "react-router-dom";

const botMessages = [
  {
    question: "Hello! I'm your fashion assistant. How can I help?",
    options: ["I need a fashion suggestion", "Can you recommend an outfit?", "What should I wear today?", "Suggest me something stylish"],
    answer: (selectedOption) => `${selectedOption}`,
  },
  {
    question: "What’s the occasion? (e.g., Party, Gym, Beach)",
    options: ["gym", "beach", "casual", "party", "wedding"],
    answer: (selectedOption) => `It's for a ${selectedOption}`,
  },
  {
    question: "Which season is it for? (e.g., Summer, Winter, Spring)",
    options: ["summer", "spring", "winter", "rainy", "fall"],
    answer: (selectedOption) => `It's for ${selectedOption}`,
  },
  {
    question: "What’s your budget? (High, Medium, Low)",
    options: ["low", "medium", "high"],
    answer: (selectedOption) => `My budget is ${selectedOption}`,
  },
  {
    question: "What kind of fit do you prefer? (Slim Fit, Loose Fit)",
    options: ["slim fit", "oversized", "loose fit", "regular fit"],
    answer: (selectedOption) => `I prefer ${selectedOption}`,
  },
  {
    question: "What style do you prefer? (e.g., Streetwear, Minimalist, Casual)",
    options: ["minimalist", "streetwear", "casual", "business casual", "sporty"],
    answer: (selectedOption) => `I like ${selectedOption} style`,
  },
  {
    question: "Any preferred material? (e.g., Cotton, Denim, Wool, Linen)",
    options: ["linen", "cotton", "denim", "polyester", "wool"],
    answer: (selectedOption) => `I prefer ${selectedOption} material`,
  },
  {
    question: "What color do you prefer? (e.g., Pink, Red, Apricot)",
    options: ["red", "black", "white", "blue", "yellow", "pink"],
    answer: (selectedOption) => `I like ${selectedOption}`,
  },
  {
    question: "What category of clothes are you looking for? (e.g., shirts, T-shirts,shorts)",
    options: ["shirts", "jacket", "hoodie", "trouser", "t-shirts", "shorts"],
    answer: (selectedOption) => `I'm looking for ${selectedOption}`,
  },
];

const Chatbot = () => {
  const navigate = useNavigate();
  const [sku, setSku] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInputVisible, setInputVisible] = useState(true);
  const [currentBotMessage, setCurrentBotMessage] = useState(null);
  const [chatHistories, setChatHistories] = useState([]);
  const [viewingHistory, setViewingHistory] = useState(null);
  const messagesEndRef = useRef(null);

  // LocalStorage utilities
  const loadChatHistory = () => {
    const history = localStorage.getItem('chatHistories');
    return history ? JSON.parse(history) : [];
  };

  const saveChatHistory = (conversation) => {
    const previous = loadChatHistory();
    console.log("length : ", previous.length);
    
    const updated = [...previous, { id: previous.length+1, messages: conversation }];
    localStorage.setItem('chatHistories', JSON.stringify(updated));
    setChatHistories(updated);
  };

  const clearChatHistory = () => {
    localStorage.removeItem('chatHistories');
    setChatHistories([]);
    setViewingHistory(null);
    window.location.reload();

  };

  const newChat = () => {
    window.location.reload();
  };

  const handleProductDetails = (id) => {
    window.open(`/chat-product?item=${id}`, "_blank");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const history = loadChatHistory();
    setChatHistories(history);
  }, []);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { id: Date.now(), content: input, role: 'user' };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${CHATBOT_URL}webhooks/rest/webhook`,
        { sender: 'user', message: input },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data && response.data.length > 0) {
        const botContent = response.data[0].text;
        const botMessage = { id: Date.now() + 1, content: botContent, role: 'assistant' };

        const matchedBotMessage = botMessages.find((msg) => msg.question === botContent);
        setCurrentBotMessage(matchedBotMessage || null);

        const newChat = [...updatedMessages, botMessage];
        setMessages(newChat);
        
        if (botContent.includes("I recommend:")) {
          saveChatHistory(newChat);
          const lastTwoChars = botContent.slice(-2).replace(/\s+/g, "");
          setSku(lastTwoChars);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { id: Date.now() + 1, content: 'Sorry, I encountered an error. Please try again.', role: 'assistant' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = async (selectedOption) => {
    if (!currentBotMessage) return;

    const userResponse = currentBotMessage.answer(selectedOption);
    const newMessage = { id: Date.now(), content: userResponse, role: 'user' };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${CHATBOT_URL}webhooks/rest/webhook`,
        { sender: 'user', message: userResponse },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data && response.data.length > 0) {
        const botContent = response.data[0].text;
        const botMessage = { id: Date.now() + 1, content: botContent, role: 'assistant' };

        const matchedBotMessage = botMessages.find((msg) => msg.question === botContent);
        setCurrentBotMessage(matchedBotMessage || null);

        const newChat = [...updatedMessages, botMessage];
        setMessages(newChat);
        
        if (botContent.includes("I recommend:")) {
          saveChatHistory(newChat);
          const lastTwoChars = botContent.slice(-2).replace(/\s+/g, "");
          setSku(lastTwoChars);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { id: Date.now() + 1, content: 'Sorry, I encountered an error. Please try again.', role: 'assistant' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4">
      <div className="flex flex-col md:flex-row gap-4">
  
        {/* Chat History Sidebar */}
        {chatHistories.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 w-full md:w-1/4">
            <h3 className="font-semibold mb-2 text-gray-800">Previous Conversations</h3>
            <div className="flex flex-wrap gap-2 flex-col max-h-40">
              {chatHistories.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    setMessages(chat.messages);
                    setViewingHistory(chat.id);
                    setInputVisible(false)
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    chat.id === viewingHistory ? 'bg-[#0F3054] text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Chat #{chat.id}
                </button>
              ))}
              <button
                onClick={newChat}
                className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm"
              >
                New Chat
              </button>
              <button
                onClick={clearChatHistory}
                className="px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 text-sm"
              >
                Clear History
              </button>
            </div>
          </div>
        )}
  
        {/* Chat Window */}
        <div className="flex-1 min-h-[40vh] bg-gray-50 rounded-lg shadow-inner p-4">
          <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'self-end bg-[#001F3F] text-white rounded-br-none'
                    : 'self-start bg-white text-gray-800 rounded-bl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
  
            {sku && (
              <button
                onClick={() => handleProductDetails(sku)}
                className="ml-auto bg-primeColor text-white text-lg w-fit px-4 py-2 font-semibold rounded-md hover:bg-black"
              >
                Go To Product
              </button>
            )}
  
            {loading && (
              <div className="self-start max-w-[80%] p-3 bg-gray-100 rounded-lg rounded-bl-none">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-600">Thinking...</p>
                </div>
              </div>
            )}
  
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
  
      {/* Options or Input */}
      {isInputVisible && <div className="mt-4">
        {currentBotMessage ? (
          <div className="p-3 bg-white rounded-lg shadow-md flex flex-wrap gap-2">
            {!loading &&
              currentBotMessage.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  className="px-4 py-2 bg-[#0F3054] text-white rounded-lg hover:bg-[#001F3F]"
                >
                  {option}
                </button>
              ))}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 bg-white rounded-lg shadow-md p-3"
          >
            <textarea
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 bg-[#0F3054] text-white rounded-lg hover:bg-[#001F3F] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <IoSendSharp className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>}
    </div>
  );
  
};

export default Chatbot;

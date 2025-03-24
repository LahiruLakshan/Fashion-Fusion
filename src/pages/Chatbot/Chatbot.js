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
  const [currentBotMessage, setCurrentBotMessage] = useState(null);
  const messagesEndRef = useRef(null);

  const handleProductDetails = (id) => {
    window.open(`/chat-product?item=${id}`, "_blank");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { id: Date.now(), content: input, role: 'user' };
    setMessages((prev) => [...prev, newMessage]);
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

        setMessages((prev) => [...prev, botMessage]);

        if (botContent.includes("I recommend:")) {
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
    setMessages((prev) => [...prev, newMessage]);
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

        setMessages((prev) => [...prev, botMessage]);

        if (botContent.includes("I recommend:")) {
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
    <div className="max-w-2xl mx-auto h-[70vh] flex flex-col p-4">
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg shadow-inner">
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'self-end bg-[#001F3F] text-white rounded-br-none'
                  : 'self-start bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}

          {sku && (
            <button onClick={() => handleProductDetails(sku)} className="bg-primeColor text-white text-lg font-bodyFont w-[185px] h-[50px] hover:bg-black duration-300 font-bold rounded-md">
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

      {currentBotMessage ? (
        <div className="p-2 bg-white rounded-lg shadow-md flex flex-wrap gap-2">
          {!loading && currentBotMessage.options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionSelect(option)}
              className="p-2 bg-[#0F3054] text-white rounded-lg hover:bg-[#001F3F]"
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 p-2 bg-white rounded-lg shadow-md">
          <textarea
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            rows={1}
            maxRows={4}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 text-white bg-[#0F3054] rounded-lg hover:bg-[#001F3F] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <IoSendSharp className="w-5 h-5" />
          </button>
        </form>
      )}
    </div>
  );
};

export default Chatbot;

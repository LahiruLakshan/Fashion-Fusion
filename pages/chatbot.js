import React, { useState } from "react";
import { client } from '../lib/client';
import { AllProducts } from '../components';
import axios from "axios";

const Chatbot = ({ AllFemaleProducts }) => {
    const BASE_URL = "https://1175-35-237-195-194.ngrok-free.app";
    const [userInput, setUserInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [recommendation, setRecommendation] = useState(null);
    const [formData, setFormData] = useState({
        subCategory: "",
        articleType: "",
        baseColour: "",
        season: "",
        usage: "",
    });

    const sendMessage = async () => {
        if (!userInput.trim()) return;

        setChatHistory([...chatHistory, { sender: "You", text: userInput }]);

        try {
            const response = await axios.post(`${BASE_URL}/chat`, {
                message: userInput,
            });

            setChatHistory((prev) => [
                ...prev,
                { sender: "Chatbot", text: response.data.response },
            ]);
        } catch (error) {
            console.error("Error:", error);
        }

        setUserInput("");
    };

    const getRecommendation = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/recommend`, formData);
            setRecommendation(response.data.recommendation);
        } catch (error) {
            console.error("Error fetching recommendation:", error);
        }
    };

    return (
        <div className="container">
            <h1>Fashion Chatbot</h1>

            <div className="recommendation-form">
                <h2>Get a Fashion Recommendation</h2>
                {Object.keys(formData).map((key) => (
                    <input
                        key={key}
                        type="text"
                        placeholder={key}
                        value={formData[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    />
                ))}
                <button onClick={getRecommendation}>Get Recommendation</button>
                {recommendation && <p><strong>Recommendation:</strong> {recommendation}</p>}
            </div>

            <div className="chat-box">
                <h2>Chat with AI</h2>
                <div className="chat-history">
                    {chatHistory.map((msg, index) => (
                        <p key={index} className={msg.sender === "You" ? "user-message" : "chatbot-message"}>
                            <strong>{msg.sender}:</strong> {msg.text}
                        </p>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default Chatbot;
/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { VscChromeClose } from "react-icons/vsc";

const CohereChatbot = ({chatbot,setChatbot}) => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Ask me any FAQ." }
  ]);
  const [input, setInput] = useState("");
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post(
        "https://api.cohere.ai/v1/generate",
        {
          model: "command",
          prompt: input,
          max_tokens: 100
        },
        {
          headers: {
            Authorization: `Bearer EU1C429f4pATYCQtwNfcEgQnFQnPwzm9BeLobNim`,
            "Content-Type": "application/json"
          }
        }
      );

      const botReply = response.data.generations[0]?.text || "Sorry, I couldn't understand.";
      setMessages([...newMessages, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages([...newMessages, { sender: "bot", text: "Error fetching response." }]);
    }
  };

  return (
    <div className="w-96 border border-gray-300 rounded-lg p-4 flex flex-col bg-white shadow-lg">
        <div className="mb-3 flex justify-between items-center">
            <h1>AI Chatbot</h1>
            <h1><VscChromeClose className="cursor-pointer" onClick={()=>setChatbot(!chatbot)}  size={24}/></h1>
        </div>
      <div className="h-64 overflow-y-auto flex flex-col gap-2 p-2 bg-gray-100 rounded-md">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[70%] px-3 py-2 rounded-lg ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-gray-800 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex mt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask a question..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default CohereChatbot;

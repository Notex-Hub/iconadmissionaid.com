import { useState } from "react";
import { IoIosSend } from "react-icons/io";
import ReactMarkdown from "react-markdown";
import { generateContent } from "./GFenerateContent";



const Chatbot = ({chatbot,setChatbot}) => {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserInput = (e) => setUserInput(e.target.value);

  const handleClear = () => {
    setUserInput("");
    setResponse([]);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      setResponse([{ type: "system", message: "Please enter a prompt.." }]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await generateContent(userInput);
      setResponse((prev) => [
        ...prev,
        { type: "user", message: userInput },
        { type: "bot", message: res() },
      ]);
      setUserInput("");
    } catch (err) {
      console.error("Error generating response:", err);
      setResponse((prev) => [
        ...prev,
        { type: "system", message: "Failed to generate response" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 rounded-lg shadow-lg bg-white">
      <div className="flex items-center justify-between pb-2 border-b">
        <h2 className="text-xl font-semibold text-gray-800">🤖 AI Chatbot</h2>
        <button onClick={()=>setChatbot(!chatbot)} className="text-sm text-red-500 hover:text-red-600">
          X
        </button>
      </div>

      <div className="h-80 overflow-y-auto p-2 space-y-2 bg-gray-100 rounded-md mt-2">
        {response.length === 0 ? (
          <p className="text-center text-gray-500">Got Questions? Ask Anything!</p>
        ) : (
          response.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
              <p
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  msg.type === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-300 text-gray-800 self-start"
                }`}
              >
                <ReactMarkdown>{msg.message}</ReactMarkdown>
              </p>
            </div>
          ))
        )}
        {isLoading && <p className="text-center text-gray-500">⏳ Generating response...</p>}
      </div>

      <div className="flex items-center mt-3 space-x-2">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <IoIosSend size={24} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;

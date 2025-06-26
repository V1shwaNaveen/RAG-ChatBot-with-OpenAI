import { useState } from "react";
import "./chat.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessages = [...messages, { sender: "user", text: message }];
    setMessages(newMessages);
    setMessage("");

    try {
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong." },
      ]);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-green-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center p-4">
        <div className="w-full max-w-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 ">
              GreenBite
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-sm px-3 py-1 border rounded-lg dark:border-gray-600"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 space-y-2 overflow-y-auto h-[70vh]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`chat-box ${
                    msg.sender === "user" ? "chat-user" : "chat-bot"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Ask about GreenBite..."
            />
            <button
              onClick={sendMessage}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

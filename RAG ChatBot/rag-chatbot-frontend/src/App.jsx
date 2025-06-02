import React, { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setReply(data.reply);
    } catch (err) {
      console.error("Error:", err);
      setReply("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>🧠 RAG Chatbot</h1>

      <input
        style={{ width: "300px", padding: "10px" }}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask me anything..."
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        style={{ marginLeft: "10px", padding: "10px 20px" }}
      >
        {loading ? "Sending..." : "Send"}
      </button>

      {reply && (
        <div
          style={{
            marginTop: "30px",
            background: "#fffffff",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <strong>Bot:</strong> {reply}
        </div>
      )}
    </div>
  );
}

export default App;

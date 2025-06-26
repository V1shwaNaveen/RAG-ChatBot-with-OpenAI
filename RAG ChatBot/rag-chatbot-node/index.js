const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const fs = require("fs");
const pdfParse = require("pdf-parse");

dotenv.config();

const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.use(express.json());

let companyData = "";

(async () => {
  const buffer = fs.readFileSync("greenbite.pdf");
  const data = await pdfParse(buffer);
  companyData = data.text;
})();

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct", // You can try other models
        messages: [
          {
            role: "system",
            content: `You are an assistant who only answers questions about greenbite using company data:\n\n${companyData}. and you also try to give short and consice answers. If the user asks for data thats not related to greenbite you should not reply with them.`,
          },
          { role: "user", content: userMessage },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // required by OpenRouter
          "X-Title": "rag-chatbot", // optional, for tracking
        },
      }
    );

    const botReply = response.data.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (error) {
    console.error(
      "Error from OpenRouter:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

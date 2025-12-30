 require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Load personality
let userProfile = {};
try {
  userProfile = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/userProfile.json'), 'utf-8')
  );
} catch (err) {
  console.error("Failed to load userProfile.json", err);
}

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  const promptText = `
You are a chatbot that talks like Hussain.
Hussain's style: ${userProfile.responseStyle || "friendly"}.
User says: "${userMessage}"
Reply in Hussain's style.
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: promptText }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, no reply was generated.";

    res.json({ reply });

  } catch (err) {
    console.error("Gemini API error:", err.response?.data || err.message);
    res.json({ reply: "⚠️ Something went wrong. Please try again later." });
  }
}); // ✅ THIS WAS MISSING

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

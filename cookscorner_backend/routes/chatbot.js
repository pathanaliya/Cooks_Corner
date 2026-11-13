const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY in backend .env' });
  }

  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Request body must include a message string.' });
  }

  const prompt = `You are Chef Cosmo, an AI chef who generates high-quality recipes.
You can take various ingredients from the user and create a recipe based on them.
Additionally, if the user provides the name of a recipe, you should generate a complete recipe along with calorie information.
Please note: ONLY respond to recipe-related queries, and present the response in proper paragraph form using <br> tags.

User Question: ${message}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        }),
      }
    );

    const json = await response.json();
    if (!response.ok) {
      console.error('Chatbot API error response:', json);
      return res.status(response.status).json({ error: json.error?.message || 'Chatbot request failed.', details: json });
    }

    const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return res.json({ text });
  } catch (error) {
    console.error('Chatbot service error:', error);
    return res.status(500).json({ error: 'Chatbot service error.', details: error.message });
  }
});

module.exports = router;

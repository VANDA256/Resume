import express from "express";

const router = express.Router();

router.post("/generate-resume", async (req, res) => {
  try {
    const { rawText } = req.body;
    // In a real app, you would import OpenAI SDK and call it here using process.env.OPENAI_API_KEY
    // For this environment, since we use Gemini on frontend, we'll mock the backend fallback or we can implement fetch to api.openai.com
    
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY is missing." });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: "You are an expert ATS resume writer. Output ONLY raw JSON matching the schema: { personalInfo: { name, email, phone, title, summary }, experience: [{ company, role, startDate, endDate, description: [] }], education: [{ institution, degree, year }], skills: [] }" },
          { role: "user", content: rawText }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0]) {
      res.json(JSON.parse(data.choices[0].message.content));
    } else {
      res.status(500).json({ error: "Failed to parse OpenAI response" });
    }
  } catch (error) {
    console.error("OpenAI Fallback Error:", error);
    res.status(500).json({ error: "Failed to generate resume on backend." });
  }
});

export default router;

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.post("/api/generate-words", async (req, res) => {
  try {
    const { topic, age, difficulty, previousWords = [] } = req.body;

    if (!topic || !age || !difficulty) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const previousWordsInstruction = previousWords.length > 0
      ? `DO NOT include any of these words: ${previousWords.join(", ")}.`
      : "";

    const prompt = `Generate 10 English vocabulary words related to the topic "${topic}".
    The words should be appropriate for students of age ${age} and the difficulty level should be ${difficulty}.
    ${previousWordsInstruction}
    Provide an Arabic translation for each word, and a simple English example sentence demonstrating its usage.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: {
                type: Type.STRING,
                description: "The English vocabulary word.",
              },
              translation: {
                type: Type.STRING,
                description: "The Arabic translation of the word.",
              },
              example: {
                type: Type.STRING,
                description: "A simple English example sentence using the word.",
              },
            },
            required: ["word", "translation", "example"],
          },
        },
      },
    });

    const jsonStr = response.text?.trim() || "[]";
    const words = JSON.parse(jsonStr);

    res.json({ words });
  } catch (error: any) {
    console.error("Error generating words:", error);
    res.status(500).json({ error: "Failed to generate words", details: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

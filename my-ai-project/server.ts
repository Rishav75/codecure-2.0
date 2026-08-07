import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Init Gemini
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          { role: "user", parts: [{ text: "You are an AI Health Assistant for CodeCure AI. Keep your answers concise, helpful, and medical-focused. Never give definitive medical diagnoses. Provide general wellness advice." }]},
          ...history.map((h: any) => ({ role: h.role, parts: [{ text: h.content }] })),
          { role: "user", parts: [{ text: message }]}
        ],
      });
      res.json({ response: response.text });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

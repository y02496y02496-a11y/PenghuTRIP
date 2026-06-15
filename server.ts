import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client safely
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Weather API leveraging Google Search Grounding to get actual, live weather
app.post("/api/weather", async (req, res) => {
  try {
    const { location } = req.body;
    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }

    const currentYear = new Date().getFullYear();
    const prompt = `Provide the current weather forecast, temperature, humidity, wind condition, and packing/outdoor tips for "${location}" as of June/July ${currentYear}. Return the response in Chinese.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            temperature: { type: Type.STRING, description: "e.g., 28°C" },
            condition: { type: Type.STRING, description: "e.g., 多雲時晴, 局部陣雨" },
            description: { type: Type.STRING, description: "Detailed weather summary in Chinese" },
            humidity: { type: Type.STRING, description: "Humidity level, e.g., 75%" },
            wind: { type: Type.STRING, description: "Wind info, e.g., 東北風強" },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Practical travel, clothing, or activity recommendations based on this weather"
            }
          },
          required: ["temperature", "condition", "description", "tips"]
        }
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text.trim());
    res.json(data);
  } catch (error: any) {
    console.error("Error in /api/weather:", error);
    res.status(500).json({ error: error.message || "Failed to retrieve weather data" });
  }
});

// Landmark and food recommendation API using Grounding
app.post("/api/landmarks", async (req, res) => {
  try {
    const { location, type, keyword } = req.body;
    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }

    const typeDesc = type === "food" ? "美食、在地小吃、必吃餐廳" : "景點、歷史古蹟、打卡熱點";
    const searchKeyword = keyword ? ` (關於: ${keyword})` : "";
    const prompt = `Recommend 5 popular and highly rated ${typeDesc}${searchKeyword} in and around "${location}". Use Google Search to make sure the recommendations are real, currently operating, and famous. Respond in Chinese.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name of the restaurant or scenic spot" },
              description: { type: Type.STRING, description: "Clear, engaging summary of what this place is" },
              highlight: { type: Type.STRING, description: "Why do we recommend it, signature dishes, or key features" },
              address: { type: Type.STRING, description: "Approximate address or location details" },
              priceRange: { type: Type.STRING, description: "e.g., $ (平價), $$ (中價), $$$ (高級), or 免費" },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["name", "description", "highlight"]
          }
        }
      }
    });

    const text = response.text || "[]";
    const data = JSON.parse(text.trim());
    res.json(data);
  } catch (error: any) {
    console.error("Error in /api/landmarks:", error);
    res.status(500).json({ error: error.message || "Failed to retrieve landmarks recommendations" });
  }
});

// Vite middleware setup for hosting React SPA front-end alongside Express APIs
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

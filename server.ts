import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Endpoint: AI Design Thinking Coach
app.post("/api/coach", async (req, res) => {
  try {
    const { message, history, stage, challenge } = req.body;

    if (!message && !challenge) {
      return res.status(400).json({ error: "Missing message or challenge parameter" });
    }

    const ai = getGeminiClient();
    
    // Custom d.school Coach system instruction
    const systemInstruction = `You are an expert Stanford d.school Design Thinking Coach.
Your goal is to guide students through the creative, human-centered design process with warmth, enthusiasm, and radical collaboration.
You use d.school-style language: human-centered, playful, encouraging wild ideas, biases toward action, and focusing on empathy.
Do not write long boring texts. Use bullet points, bold text, and brief creative prompts or activities (e.g., "Try this: sketch 3 crazy ideas in 1 minute").
The user is working on the design challenge: "${challenge || 'General Design Thinking'}".
The current stage of focus is: "${stage || 'all phases'}".
Keep your responses inspiring, structured, and strictly under 250 words.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 1.0,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in AI Coach:", error);
    res.status(500).json({ error: error.message || "An error occurred with the AI Coach." });
  }
});

// Endpoint: Dynamic Design Tool Activities
app.post("/api/generate-activity", async (req, res) => {
  try {
    const { toolName, options } = req.body;

    if (!toolName) {
      return res.status(400).json({ error: "toolName is required" });
    }

    const ai = getGeminiClient();
    let prompt = "";
    let systemInstruction = "You are a Stanford d.school curriculum developer. Create custom, short, fun activities.";

    if (toolName === "Secret Handshake") {
      const vibe = options?.vibe || "silly";
      prompt = `Generate a unique, creative, step-by-step d.school team building icebreaker called "The ${vibe.toUpperCase()} Handshake".
      Make it include 3 distinct physical actions (e.g. elbow bump, high-five, secret sound) that are active, hilarious, and perfect for getting people out of their heads.
      Provide:
      1. A catchy name for the handshake.
      2. Step 1, Step 2, and Step 3 instructions.
      3. A 1-sentence tip on how this builds team connection.`;
    } else if (toolName === "Portrait of a Descendant") {
      const year = options?.year || "100 years";
      prompt = `Generate an empathy building speculative future scenario set ${year} in the future.
      Provide a "Portrait of a Descendant" prompt for a high school classroom:
      1. Describe a unique challenge they face due to climate, technology, or space-colonization (e.g., "Nocturnal school schedules because of heat").
      2. Ask 2 deep empathy-building questions that ask us to imagine how they feel, work, or connect.
      3. Recommend a 5-minute drawing activity.`;
    } else if (toolName === "AI Easy Button") {
      const industry = options?.industry || "Education";
      prompt = `Create a short ethical design challenge about AI in ${industry}.
      We want to avoid making AI the "easy button" that replaces critical thinking or human empathy.
      Provide:
      1. A short, realistic scenario where a user might rely too much on AI.
      2. A "Friction-by-Design" solution: how can we build a d.school-style prototype that forces the user to reflect or use their own empathy instead of letting AI do it all?
      3. A prompt for action.`;
    } else {
      prompt = `Create a quick 5-minute d.school creative booster prompt for design thinking.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.9,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error generating activity:", error);
    res.status(500).json({ error: error.message || "An error occurred generating the activity." });
  }
});

// Serve static assets in production or use Vite middleware in dev
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

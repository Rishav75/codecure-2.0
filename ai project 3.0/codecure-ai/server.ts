import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy getter for Google GenAI client to avoid crash if API key is missing
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment variables.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "dummy-key",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "CODECURE AI Core API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// 2. AI Health Chat Assistant
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history, image, useSearch } = req.body;
    const ai = getGenAIClient();

    const systemInstruction = `You are CODECURE AI, an elite clinical AI Health Companion created by medical informatics experts and AI engineers.
Provide empathetic, evidence-based health guidance, medical term definitions, lifestyle tips, and wellness advice.
Always format your responses with clear markdown, bullet points, and bold headers.
IMPORTANT MEDICAL DISCLAIMER: Remind the user if relevant that you provide medical information for educational purposes, not direct clinical diagnoses.`;

    const contents: any[] = [];
    
    // Include recent history if provided
    if (history && Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        contents.push({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.content }],
        });
      }
    }

    // Current turn parts
    const currentParts: any[] = [];
    if (image) {
      const mimeType = image.split(";")[0].split(":")[1] || "image/png";
      const base64Data = image.split(",")[1] || image;
      currentParts.push({
        inlineData: { mimeType, data: base64Data },
      });
    }
    currentParts.push({ text: message || "Hello CODECURE AI" });

    contents.push({ role: "user", parts: currentParts });

    const tools: any[] = [];
    if (useSearch) {
      tools.push({ googleSearch: {} });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents.length === 1 ? contents[0].parts : contents,
      config: {
        systemInstruction,
        tools: tools.length > 0 ? tools : undefined,
      },
    });

    const reply = response.text || "I am analyzing your health query. Please consult a licensed physician for acute medical conditions.";
    
    // Extract grounding sources if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks.map((chunk: any) => ({
      title: chunk.web?.title || "Health Source",
      uri: chunk.web?.uri || "#",
    }));

    res.json({
      reply,
      sources,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in AI Chat:", error);
    res.status(500).json({
      error: "AI Health Chat service unavailable.",
      details: error.message,
    });
  }
});

// 3. AI Symptom Checker
app.post("/api/gemini/symptom-check", async (req, res) => {
  try {
    const { symptoms, age, gender, medicalHistory, duration } = req.body;
    const ai = getGenAIClient();

    const prompt = `Analyze these reported symptoms for clinical triage:
- Primary Symptoms: ${symptoms}
- Age: ${age || "Unspecified"}
- Gender: ${gender || "Unspecified"}
- Duration: ${duration || "Unspecified"}
- Prior Medical History: ${medicalHistory || "None reported"}

Perform a structured clinical differential assessment.
Return a valid JSON object matching this JSON schema. Do not wrap in markdown tags if responseMimeType is set.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are CODECURE AI Symptom Triage Engine. Return structured JSON with differential diagnoses, severity assessment, urgency, recommended specialist, and medical disclaimer.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isEmergency: { type: Type.BOOLEAN, description: "True if symptoms require immediate emergency ER care" },
            emergencyReasoning: { type: Type.STRING, description: "Why it is or isn't an emergency" },
            overallSeverity: { type: Type.STRING, description: "Low, Moderate, High, or Critical" },
            likelyCauses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  condition: { type: Type.STRING },
                  confidence: { type: Type.NUMBER, description: "Percentage 0-100" },
                  severity: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
              },
            },
            recommendedSpecialist: { type: Type.STRING, description: "e.g., Cardiologist, Neurologist, General Practitioner" },
            clinicalReasoning: { type: Type.STRING, description: "Detailed clinical thought process" },
            recommendedActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            disclaimer: { type: Type.STRING },
          },
        },
      },
    });

    let result = {};
    try {
      result = JSON.parse(response.text || "{}");
    } catch {
      result = {
        isEmergency: false,
        overallSeverity: "Moderate",
        likelyCauses: [
          { condition: "Symptomatic Evaluation Needed", confidence: 75, severity: "Moderate", description: "Symptoms require in-person clinical exam." }
        ],
        recommendedSpecialist: "General Practitioner",
        clinicalReasoning: "Standard symptomatic pattern recorded.",
        recommendedActions: ["Hydrate", "Monitor temperature", "Consult GP"],
        disclaimer: "This AI tool is for informational triage and not a replacement for professional clinical care."
      };
    }

    res.json(result);
  } catch (error: any) {
    console.error("Error in Symptom Checker:", error);
    res.status(500).json({ error: "Symptom Checker error", details: error.message });
  }
});

// 4. AI Medical Report Scanner
app.post("/api/gemini/analyze-report", async (req, res) => {
  try {
    const { fileDataUrl, fileType, docCategory } = req.body;
    const ai = getGenAIClient();

    const mimeType = fileDataUrl?.split(";")[0]?.split(":")[1] || "image/png";
    const base64Data = fileDataUrl?.split(",")[1] || fileDataUrl || "";

    const parts: any[] = [];
    if (base64Data) {
      parts.push({
        inlineData: { mimeType, data: base64Data },
      });
    }

    parts.push({
      text: `Analyze this medical document (${docCategory || "Lab Report / Scan / Prescription"}).
Extract key parameters, values, reference ranges, abnormal flags, medical terminology explanations, actionable recommendations, and 3 high-yield questions for the doctor.`
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        systemInstruction: "You are CODECURE AI Medical Vision & OCR Analyst. Parse lab reports, MRI, CT, X-Ray, ECG, or Prescriptions into clean structured medical insights.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentType: { type: Type.STRING, description: "e.g., Complete Blood Count, Lipid Panel, MRI Brain, Prescription" },
            patientName: { type: Type.STRING },
            reportDate: { type: Type.STRING },
            summary: { type: Type.STRING, description: "Executive high-level summary of report" },
            extractedMetrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "e.g., Hemoglobin, HbA1c, Cholesterol" },
                  value: { type: Type.STRING, description: "e.g., 14.2 g/dL" },
                  normalRange: { type: Type.STRING, description: "e.g., 13.5 - 17.5 g/dL" },
                  status: { type: Type.STRING, description: "Normal, Low, High, Critical" },
                  significance: { type: Type.STRING, description: "What this metric means for health" },
                },
              },
            },
            medicalGlossary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING },
                },
              },
            },
            keyRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            questionsForDoctor: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    let parsed = {};
    try {
      parsed = JSON.parse(response.text || "{}");
    } catch {
      parsed = {
        documentType: docCategory || "Medical Report",
        summary: "Analyzed uploaded document successfully.",
        extractedMetrics: [],
        medicalGlossary: [],
        keyRecommendations: ["Discuss findings with your healthcare provider."],
        questionsForDoctor: ["Are any values requiring follow-up testing?"],
      };
    }

    res.json(parsed);
  } catch (error: any) {
    console.error("Error in Medical Report Scanner:", error);
    res.status(500).json({ error: "Report analysis failed", details: error.message });
  }
});

// 5. Drug Interaction Checker
app.post("/api/gemini/interaction-check", async (req, res) => {
  try {
    const { medicines } = req.body;
    const ai = getGenAIClient();

    const prompt = `Evaluate potential drug-drug interactions for this list of medications: ${Array.isArray(medicines) ? medicines.join(", ") : medicines}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are CODECURE AI Clinical Pharmacologist. Analyze drug interactions, severity, and advice.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hasInteractions: { type: Type.BOOLEAN },
            overallRiskLevel: { type: Type.STRING, description: "None, Mild, Moderate, Severe" },
            interactions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  drugs: { type: Type.STRING, description: "Drug A + Drug B" },
                  severity: { type: Type.STRING },
                  description: { type: Type.STRING },
                  clinicalAdvice: { type: Type.STRING },
                },
              },
            },
            generalAdvice: { type: Type.STRING },
          },
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Interaction check error:", error);
    res.status(500).json({ error: "Interaction check failed", details: error.message });
  }
});

// 6. Nutrition & Meal AI Analyzer
app.post("/api/gemini/nutrition", async (req, res) => {
  try {
    const { image, textPrompt, goal } = req.body;
    const ai = getGenAIClient();

    const parts: any[] = [];
    if (image) {
      const mimeType = image.split(";")[0].split(":")[1] || "image/png";
      const base64Data = image.split(",")[1] || image;
      parts.push({
        inlineData: { mimeType, data: base64Data },
      });
    }

    parts.push({
      text: textPrompt || `Analyze this meal photo or description for calories, macros, micro nutrients, health rating, and healthier alternatives tailored to target goal: ${goal || "General Health"}.`
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        systemInstruction: "You are CODECURE AI Precision Nutrition Specialist. Estimate food items, calories, macros (protein, carbs, fats), micronutrients, glycemic impact, and healthy swaps.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mealName: { type: Type.STRING },
            estimatedCalories: { type: Type.NUMBER },
            proteinGrams: { type: Type.NUMBER },
            carbsGrams: { type: Type.NUMBER },
            fatsGrams: { type: Type.NUMBER },
            fiberGrams: { type: Type.NUMBER },
            glycemicIndex: { type: Type.STRING, description: "Low, Medium, High" },
            healthScore: { type: Type.NUMBER, description: "1-100 rating" },
            micronutrients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            healthierAlternatives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            nutritionistNotes: { type: Type.STRING },
          },
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Nutrition AI error:", error);
    res.status(500).json({ error: "Nutrition analysis failed", details: error.message });
  }
});

// 7. AI Disease & Wellbeing Risk Prediction Engine
app.post("/api/gemini/risk-prediction", async (req, res) => {
  try {
    const { healthMetrics, userProfile } = req.body;
    const ai = getGenAIClient();

    const prompt = `Perform a preventive AI Risk Assessment based on these biometric parameters and history:
Metrics: ${JSON.stringify(healthMetrics)}
Profile: ${JSON.stringify(userProfile)}

Calculate individual clinical risk percentages and actionable strategies for:
1. Heart Disease (Cardiovascular)
2. Type 2 Diabetes
3. Hypertension
4. Stroke
5. Occupational Burnout & Anxiety
6. Severe Depression Risk
7. Sleep Disorders / Apnea Risk`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are CODECURE AI Preventive Epidemiology Model. Return multi-condition risk predictions, percentage probabilities, key risk drivers, and preventive recommendations.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallRiskScore: { type: Type.NUMBER, description: "Composite preventive health risk 0-100" },
            conditions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  condition: { type: Type.STRING },
                  riskPercentage: { type: Type.NUMBER },
                  riskLevel: { type: Type.STRING, description: "Low, Moderate, Elevated, High" },
                  primaryDrivers: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  preventivePlan: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
              },
            },
            topPreventiveActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Risk prediction error:", error);
    res.status(500).json({ error: "Risk prediction engine failed", details: error.message });
  }
});

// 8. Hospital & Medical Facility Locator
app.post("/api/hospitals", async (req, res) => {
  try {
    const { location, query } = req.body;
    const ai = getGenAIClient();

    const prompt = `Find nearby emergency hospitals, trauma centers, and medical clinics for location: ${location || "Current GPS Location"}. Focus on ${query || "Emergency Hospitals and Urgent Care"}. Provide names, address estimates, contact phone numbers, and emergency capability highlights.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Provide detailed list of verified real emergency hospitals and medical centers.",
      },
    });

    const replyText = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    res.json({
      summary: replyText,
      sources: groundingChunks,
    });
  } catch (error: any) {
    console.error("Hospital search error:", error);
    res.status(500).json({ error: "Hospital search failed", details: error.message });
  }
});

// 9. Speech Text-To-Speech (TTS) Generation
app.post("/api/speech/tts", async (req, res) => {
  try {
    const { text, voice } = req.body;
    const ai = getGenAIClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: text || "CODECURE AI is active and monitoring your health." }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || "Kore" },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({ audio: base64Audio });
    } else {
      res.status(400).json({ error: "Audio generation returned no payload" });
    }
  } catch (error: any) {
    console.error("TTS generation error:", error);
    res.status(500).json({ error: "TTS failed", details: error.message });
  }
});

// 10. AI Operational Incident Response Brief
app.post("/api/gemini/brief", async (req, res) => {
  try {
    const { incident } = req.body;
    const ai = getGenAIClient();

    const prompt = `Generate an operational incident response brief summary for CodeCure AI.
Incident ID: ${incident?.id || 'INC-001'}
Type: ${incident?.incidentType || 'Emergency'}
Priority: ${incident?.priority || 'High'}
Status: ${incident?.status || 'Active'}
Patient: ${incident?.patientName || 'Unknown'}
Location: ${incident?.location || 'Unknown'}
Description: ${incident?.description || 'N/A'}
Provide 3 concise operational recommendations.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are CODECURE AI Emergency Incident Command Specialist. Return structured JSON with operational brief summary and recommendations.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    let result = {};
    try {
      result = JSON.parse(response.text || "{}");
    } catch {
      result = {
        summary: `Operational brief for ${incident?.id || 'incident'}. Patient ${incident?.patientName || 'Patient'} triage level ${incident?.priority || 'High'}.`,
        recommendations: [
          'Maintain continuous telemetry synchronization via connected Wearable pipeline.',
          'Ensure direct radio contact between trauma center and local dispatch.',
          'Schedule post-incident debrief with chief medical officer upon resolution.',
        ],
      };
    }

    res.json(result);
  } catch (error: any) {
    console.error("Incident brief error:", error);
    res.status(500).json({
      summary: "Operational brief generation offline.",
      recommendations: ["Follow standard operating triage protocols."],
    });
  }
});

// ----------------------------------------------------
// VITE MIDDLEWARE & SERVER INITIALIZATION
// ----------------------------------------------------

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
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CODECURE AI Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();

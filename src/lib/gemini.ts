import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Resume Schema for structured output
const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        title: { type: Type.STRING },
        summary: { type: Type.STRING }
      }
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          role: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          description: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          institution: { type: Type.STRING },
          degree: { type: Type.STRING },
          year: { type: Type.STRING }
        }
      }
    },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  }
};

export async function generateResumeWithAI(rawText: string) {
  try {
    // Attempt Gemini first
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview", // Complex reasoning task
      contents: `You are an expert ATS resume writer and executive recruiter. I am going to give you raw, messy text which could be a WhatsApp chat export, voice transcript, or broken sentences. Extract all professional details and structure them into a polished, professional resume. Elevate the language to be professional and outcome-oriented. \n\nRAW TEXT:\n${rawText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
        topP: 0.8,
        temperature: 0.3
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Gemini AI error, falling back to OpenAI (backend route):", error);
    // Fallback to OpenAI backend endpoint
    const fallbackResponse = await fetch("/api/ai/generate-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawText })
    });
    
    if (!fallbackResponse.ok) {
      throw new Error("Both AI models failed to generate resume.");
    }
    
    return await fallbackResponse.json();
  }
}

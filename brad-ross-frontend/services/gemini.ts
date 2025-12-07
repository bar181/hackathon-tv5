import { GoogleGenAI, Type } from "@google/genai";
import { ContentItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePersonalizedContent = async (interests: string[]): Promise<ContentItem[]> => {
  // Matching the Visual Graph in HowTo.tsx
  const personaContext = `
    User Persona: "Toronto Dad" (Single Profile with Multi-Segment usage).
    Segments:
    1. Dad Solo (50%): Hard Sci-Fi, Docs, Physics.
    2. Co-Viewing (25%): Kids cartoons (Bluey, Paw Patrol).
    3. Teen (15%): Intense drama (Euphoria).
    4. Date Night (10%): Fri/Sat night RomComs.
  `;

  const prompt = `
    ${personaContext}
    
    Task: Generate 6 personalized video recommendations based on the user's selected interests: ${interests.join(', ')}.
    
    Guidelines:
    1. The recommendations should primarily focus on the "Dad Solo" segment matching the selected interests.
    2. HOWEVER, "Invisible Design": If the interests allow (e.g. "Family Movie Night"), intelligently surface content from the other segments (Co-Viewing or Date Night).
    3. Include at least one Canadian specific content item.
    4. The 'imageKeyword' should be a single visual English word.
    5. Language: English.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Title of the show/movie" },
              description: { type: Type.STRING, description: "Compelling summary" },
              category: { type: Type.STRING, description: "Genre (e.g. Sci-Fi, Kids, Drama)" },
              imageKeyword: { type: Type.STRING, description: "Visual keyword for image generation" },
              duration: { type: Type.STRING, description: "Duration string" },
            },
            required: ["title", "description", "category", "imageKeyword", "duration"]
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.map((item: any, index: number) => ({
        ...item,
        id: `ai-${Date.now()}-${index}`,
        isAI: true
      }));
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};
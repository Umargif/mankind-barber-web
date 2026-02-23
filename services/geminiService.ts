import { GoogleGenAI, Type } from "@google/genai";
import { StyleRecommendation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = 'gemini-2.5-flash-image';

export const analyzeStyle = async (
  imageBase64: string | null,
  userDescription: string
): Promise<StyleRecommendation[]> => {
  
  const parts: any[] = [];

  // Add text prompt
  parts.push({
    text: `You are a master barber at "Mankind Gentlemen Barber Shop". 
    Analyze the user's request. If an image is provided, analyze the face shape, hair texture, and current length.
    If no image is provided, rely on the description.
    
    User Description: "${userDescription}"
    
    Recommend 3 specific haircut or beard styles that would suit this gentleman perfectly.
    For each style, provide a name, a brief description of why it works, and how to style it.
    
    Return the response as a JSON array of objects with keys: styleName, description, suitability.`
  });

  // Add image if available
  if (imageBase64) {
    // Strip data url prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg' 
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              styleName: { type: Type.STRING },
              description: { type: Type.STRING },
              suitability: { type: Type.STRING },
            },
            required: ["styleName", "description", "suitability"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as StyleRecommendation[];
    }
    throw new Error("No response from AI style advisor.");
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw error;
  }
};

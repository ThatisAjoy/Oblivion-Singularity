import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface VoidReaction {
  massIncrease: number; 
  auraColor: string; 
  spinChange: number; 
  voidResponse: string; 
}

export async function offerToVoid(text: string): Promise<VoidReaction> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are the Oblivion Singularity, a digital black hole that consumes human thoughts, memories, and secrets.
    Analyze the following offering and determine how it affects your physical form.
    Offering: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          massIncrease: { 
            type: Type.NUMBER, 
            description: "How 'heavy' or significant the thought is. Range: 0.01 (trivial) to 0.15 (profound)." 
          },
          auraColor: { 
            type: Type.STRING, 
            description: "A hex color code representing the emotional resonance of the thought. E.g., red for anger, blue for sadness, gold for joy, purple for mystery." 
          },
          spinChange: { 
            type: Type.NUMBER, 
            description: "How chaotic the thought is. Range: -0.5 (calming, slows spin) to 0.5 (chaotic, increases spin)." 
          },
          voidResponse: { 
            type: Type.STRING, 
            description: "A cryptic, poetic response from the void acknowledging the offering (max 6 words)." 
          }
        },
        required: ["massIncrease", "auraColor", "spinChange", "voidResponse"]
      }
    }
  });
  
  if (!response.text) {
    throw new Error("The void did not respond.");
  }
  
  return JSON.parse(response.text) as VoidReaction;
}

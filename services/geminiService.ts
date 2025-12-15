import { GoogleGenAI, Content, Part } from "@google/genai";
import { Message, Role } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

const apiKey = process.env.API_KEY || '';

// Always create a new instance to ensure key validity if it were dynamic (though usually env is static)
const getAIClient = () => new GoogleGenAI({ apiKey });

export const sendMessageToGemini = async (
  currentMessage: string,
  history: Message[],
  image: string | null,
  isThinkingMode: boolean
): Promise<string> => {
  
  const ai = getAIClient();
  
  // Format history for the API
  const formattedHistory: Content[] = history.map(msg => ({
    role: msg.role === Role.USER ? 'user' : 'model',
    parts: [{ text: msg.text }] as Part[],
  }));

  const modelName = 'gemini-3-pro-preview';

  // Construct current message content
  const currentParts: Part[] = [];
  
  if (image) {
    // Extract base64 data (remove data:image/png;base64, prefix if present)
    const base64Data = image.split(',')[1] || image;
    const mimeType = image.split(';')[0].split(':')[1] || 'image/jpeg';
    
    currentParts.push({
      inlineData: {
        mimeType: mimeType,
        data: base64Data
      }
    });
  }

  currentParts.push({ text: currentMessage });

  // Add the new message to the contents array properly
  const contents: Content[] = [
    ...formattedHistory,
    {
      role: 'user',
      parts: currentParts
    }
  ];

  try {
    const config: any = {
      systemInstruction: SYSTEM_INSTRUCTION,
    };

    if (isThinkingMode) {
      // Per instructions: Set thinkingBudget to 32768, do NOT set maxOutputTokens
      config.thinkingConfig = { thinkingBudget: 32768 };
    } else {
      // Standard config for faster responses
      config.temperature = 0.7;
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: config
    });

    return response.text || "Lo siento, no pude generar una respuesta.";
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};

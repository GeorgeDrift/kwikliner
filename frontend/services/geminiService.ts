
import { GoogleGenAI, Chat } from "@google/genai";

// We keep a registry of active chat sessions to maintain context
const activeChats: Record<string, Chat> = {};

/**
 * Gets or creates a KwikLiner Assistant chat session for a user.
 * Re-initializes with a fresh GoogleGenAI instance if needed to ensure the latest API key is used.
 */
export const getKwikAssistantChat = (userId: string, userRole: string) => {
  // Always create a fresh instance of GoogleGenAI before interacting with the API to ensure the most current credentials.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  if (!activeChats[userId]) {
    activeChats[userId] = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are KwikLiner Assistant, an expert AI built for an African freight marketplace.
        You help ${userRole}s with logistics, route planning (focusing on SADC/COMESA regions like Malawi, Zimbabwe, Mozambique, Zambia), cargo compliance, and platform navigation.
        
        Key Platform Rules:
        1. Independence: Drivers own their accounts. Logistics companies manage linking & trip allocation without assuming employer liability.
        2. Post Load: Shippers have a dedicated "Overview" or "Post Load" widget where they list freight shipments (Route, Cargo, Weight, Payout).
        3. Hire Drivers: Once a shipment is posted, shippers use the "Hire Drivers" tab to find and assign talent to their specific load.
        4. Marketplace (KwikShop): A unified hub for specialized categories:
           - Spare Parts: Tires, filters, engine components.
           - Agri Equipment: Solar pumps, grain meters, cultivators.
           - Logistics Tech: GPS trackers, barcode scanners.
           - Services: Warehousing, forklift rentals.
        5. Roles: Shippers book shipments and hire drivers. Drivers fulfill trips. Logistics owners manage talent pools. Hardware owners sell goods.

        Be professional, concise, and helpful. Guide users to the "Post Load" section if they want to move freight or equipment.`,
        temperature: 0.7,
      },
    });
  }
  return activeChats[userId];
};

/**
 * Sends a message to the KwikLiner Assistant and returns the response text.
 */
export const sendMessageToAssistant = async (userId: string, userRole: string, message: string) => {
  try {
    const chat = getKwikAssistantChat(userId, userRole);
    // sendMessage returns a GenerateContentResponse object
    const response = await chat.sendMessage({ message });
    // Correctly extract text from the property (not a method) as per SDK guidelines.
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm sorry, I'm having trouble with my connection. Could you please try again?";
  }
};

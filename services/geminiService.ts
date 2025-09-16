import { GoogleGenAI, Type } from "@google/genai";
import type { ExtractedData } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Analyzes document text using the Gemini API to extract structured data.
 * @param text The text content of the document.
 * @returns A promise that resolves to an object containing the extracted data.
 */
export const analyzeDocument = async (text: string): Promise<ExtractedData> => {
  const prompt = `
    You are an expert data extraction agent. Analyze the following document text and extract the required information.
    The 'name' should be the primary individual or company name mentioned.
    The 'investment_amount' should be the monetary value, including currency symbols or codes.
    The 'address' should be the full mailing address.

    Respond ONLY with a valid JSON object that strictly adheres to the provided schema. Do not include any explanatory text, markdown formatting, or anything outside of the JSON structure.

    Document Text:
    ---
    ${text}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "The full name of the person or entity."
            },
            investment_amount: {
              type: Type.STRING,
              description: "The total investment amount, including currency."
            },
            address: {
              type: Type.STRING,
              description: "The complete mailing address."
            },
          },
          required: ["name", "investment_amount", "address"],
        },
      },
    });
    
    const jsonString = response.text.trim();
    if (!jsonString) {
      throw new Error("The API returned an empty response. The document may not contain the required information.");
    }

    const parsedData = JSON.parse(jsonString);
    return parsedData as ExtractedData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Provide a more user-friendly error message
    if (error instanceof Error && error.message.includes('json')) {
        throw new Error("AI failed to generate valid structured data. The document might be unclear or lack the required information.");
    }
    throw new Error("Failed to analyze the document with AI. Please try again.");
  }
};

/**
 * Generates a notification email draft using the Gemini API based on compliance status.
 * @param investorData The extracted data of the investor.
 * @param complianceStatus The compliance status ('Approved' or 'Flagged').
 * @returns A promise that resolves to the generated email text.
 */
export const generateNotificationEmail = async (
  investorData: ExtractedData,
  complianceStatus: 'Approved' | 'Flagged'
): Promise<string> => {
  let prompt: string;

  if (complianceStatus === 'Approved') {
    prompt = `
      You are an expert communications assistant.
      Draft a warm and professional welcome email to a new investor.
      
      Investor Name: ${investorData.name}
      Investment Amount: ${investorData.investment_amount}

      The email should be welcoming, acknowledge their investment, and briefly mention the next steps or that a relationship manager will be in touch.
      Keep the tone positive and professional.
      
      Respond ONLY with the text of the email. Do not include a subject line, a greeting like "Dear...", or a closing like "Sincerely,". Just provide the body of the email.
    `;
  } else { // complianceStatus === 'Flagged'
    prompt = `
      You are a compliance monitoring AI.
      Draft an URGENT internal compliance alert. This is a high-priority notification for internal review only.

      An automated watchlist check has flagged a new investor. Immediate manual review is required.

      Details:
      - Name: ${investorData.name}
      - Investment Amount: ${investorData.investment_amount}
      - Address: ${investorData.address}

      The alert should be concise, professional, and clearly state the need for urgent action. Do not include any speculative language.

      Respond ONLY with the text of the internal alert. Do not include a subject line or any other explanatory text.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.5,
      },
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating notification email:", error);
    throw new Error("Failed to generate notification email with AI.");
  }
};
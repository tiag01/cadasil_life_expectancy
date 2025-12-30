import { GoogleGenAI } from "@google/genai";
import { CadasilStage, Sex } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not set in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAnalysis = async (
  age: number,
  stage: CadasilStage,
  sex: Sex,
  meanExpectancy: number,
  medianSurvival: number
): Promise<string> => {
  const ai = createClient();
  if (!ai) return "Error: API Key missing.";

  const prompt = `
    You are an expert genetic counselor and neurologist specializing in CADASIL (NOTCH3 mutation).
    
    A user is viewing a probability model based on data from JAMA Neurology 2024 ("Life Expectancy in CADASIL") using the NOTCH3-SVD staging system.
    
    Input Parameters:
    - Patient Age: ${age}
    - Sex: ${sex}
    - Current Stage: ${stage}
    
    Model Results:
    - Estimated Mean Life Expectancy (from now): ${meanExpectancy} additional years
    - Estimated Median Survival Age: ${Math.round(age + medianSurvival)} years old
    
    Please provide a scientific, compassionate interpretation.
    1. Briefly explain the current stage in plain English. 
       - If Stage 1/2: Explain this is based on MRI (WMH = White Matter Hyperintensities, Lacunes = small strokes).
       - If Stage 3/4: Explain this is based on physical disability levels.
    2. Discuss the prognosis based on Sex and Age.
    3. Mention that progression varies; some patients stay in early stages for decades.
    4. Provide a disclaimer: This is a statistical model, not an individual prediction. Genotype and lifestyle matter.
    
    Keep the tone professional yet supportive. Max 150 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Analysis could not be generated at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while communicating with the AI service. Please try again later.";
  }
};
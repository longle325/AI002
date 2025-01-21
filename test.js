import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("YOUR_API_KEY");

async function listAvailableModels() {
  try {
    // There's no direct listModels() function.
    // The best way to check for model availability is to try to get it.
    const modelNames = ["gemini-pro", "gemini-ultra", "text-bison-001"]; // Add other models you want to check
    const availableModels = [];

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        // If this doesn't throw, the model is likely available
        availableModels.push(modelName);
        console.log(`Model ${modelName} is available.`);
      } catch (error) {
        if (error.message.includes("404 Not Found")) {
          console.log(`Model ${modelName} is NOT available.`);
        } else {
          console.error(`Error checking model ${modelName}:`, error);
        }
      }
    }
    if (availableModels.length === 0) {
        console.log("No models found. Please check your API key and project settings.");
    } else {
        console.log("Available models:", availableModels);
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listAvailableModels();
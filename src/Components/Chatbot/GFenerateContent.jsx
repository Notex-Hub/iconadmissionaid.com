
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI('AIzaSyB4hwVy29X6vLE9ROTsrVGxk0sYxMlTaz0');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateContent = async (prompt) => {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return result.response.text; // return the response
}
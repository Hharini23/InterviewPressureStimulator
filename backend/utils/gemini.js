const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

// Ensure API key is present
if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️ WARNING: GEMINI_API_KEY is not defined in .env file.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const extractJSON = (text) => {
    try {
        // Find the first '[' or '{' and the last ']' or '}'
        const firstBracket = text.search(/[\[\{]/);
        const lastBracket = text.lastIndexOf(text.match(/[\]\}]/g)?.pop());
        if (firstBracket === -1 || lastBracket === -1) return null;
        
        const jsonStr = text.substring(firstBracket, lastBracket + 1);
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("JSON Extraction Error:", e);
        return null;
    }
};

const generateQuestions = async (role, difficulty) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        You are a highly experienced and demanding interviewer for a [${role}] position. 
        Your goal is to screen candidates at a [${difficulty}] level.
        
        Generate exactly 5 challenging interview questions in JSON format.
        Each question must be a JSON object with:
        - "text": The question content.
        - "category": (e.g., Technical, Behavioral, System Design).
        - "stressFactor": A specific constraint to add pressure (e.g., "Answer in 30s", "Explain logic without using jargon").
        - "timeLimit": Suggested time in seconds to answer (between 30 and 120).

        Return ONLY the array of JSON objects. Do not include markdown formatting or extra text.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("AI Raw Output (Questions):", text);
        
        const data = extractJSON(text);
        if (!data || !Array.isArray(data)) {
            throw new Error("AI failed to return a valid JSON array of questions.");
        }
        return data;
    } catch (error) {
        console.error("AI Question Generation Error:", error);
        throw error;
    }
};

const evaluateInterview = async (role, questions, responses) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const combinedData = questions.map((q, i) => ({
        question: q.text,
        answer: responses.find(r => r.questionIndex === i)?.answer || "No answer provided",
        timeTaken: responses.find(r => r.questionIndex === i)?.duration || 0,
        retries: responses.find(r => r.questionIndex === i)?.retries || 0
    }));

    const prompt = `
        Evaluate the following interview performance for a [${role}] role.
        
        Session Data:
        ${JSON.stringify(combinedData, null, 2)}

        Provide a detailed evaluation in JSON format exactly as follows:
        {
          "scores": { "accuracy": 0-100, "clarity": 0-100, "confidence": 0-100, "speed": 0-100, "overall": 0-100 },
          "behavioralInsights": ["Insight 1", "Insight 2", "Insight 3"],
          "improvementSuggestions": ["Tip 1", "Tip 2", "Tip 3"],
          "stressHandlingScore": 0-100
        }

        Return ONLY the raw JSON object.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("AI Raw Output (Evaluation):", text);
        
        const data = extractJSON(text);
        if (!data || typeof data !== 'object') {
            throw new Error("AI failed to return a valid JSON object for evaluation.");
        }
        return data;
    } catch (error) {
        console.error("AI Evaluation Error:", error);
        throw error;
    }
};

module.exports = { generateQuestions, evaluateInterview };

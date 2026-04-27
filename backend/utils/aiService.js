const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const extractJSON = (text) => {
    // Try to extract JSON from markdown code blocks first
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
        try { return JSON.parse(codeBlockMatch[1].trim()); } catch(e) {}
    }
    // Otherwise find the first valid [ or { to last ] or }
    const start = text.search(/[\[\{]/);
    if (start === -1) return null;
    const sub = text.substring(start);
    // Find the matching bracket
    let depth = 0, end = -1;
    const open = sub[0], close = open === '[' ? ']' : '}';
    for (let i = 0; i < sub.length; i++) {
        if (sub[i] === open) depth++;
        else if (sub[i] === close) { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end === -1) return null;
    try { return JSON.parse(sub.substring(0, end + 1)); } catch (e) { return null; }
};

const generateQuestions = async (role, difficulty) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are an expert interviewer. Generate exactly 5 interview questions for a ${role} role at ${difficulty} difficulty level.

Return ONLY a valid JSON array (no markdown, no extra text) in this exact format:
[
  {
    "text": "Question text here",
    "category": "Technical",
    "stressFactor": "Answer in under 45 seconds",
    "timeLimit": 60
  }
]

Make the questions relevant, challenging, and realistic for a ${role} interview.`;

    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    console.log("AI Questions Raw:", text.substring(0, 200));

    const data = extractJSON(text);
    if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error(`AI returned invalid questions format: ${text.substring(0, 100)}`);
    }
    return data;
};

const evaluateInterview = async (role, questions, responses) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const responseData = questions.map((q, i) => ({
        question: q.text,
        answer: responses.find(r => r.questionIndex === i)?.answer || "No answer provided",
        timeTaken: responses.find(r => r.questionIndex === i)?.duration || 0,
    }));

    const prompt = `Evaluate this ${role} interview performance. Return ONLY valid JSON, no markdown.

Data: ${JSON.stringify(responseData)}

Return this exact JSON structure:
{
  "scores": {
    "accuracy": 75,
    "clarity": 80,
    "confidence": 70,
    "speed": 65,
    "overall": 73
  },
  "behavioralInsights": [
    "Insight 1 here",
    "Insight 2 here",
    "Insight 3 here"
  ],
  "improvementSuggestions": [
    "Suggestion 1 here",
    "Suggestion 2 here",
    "Suggestion 3 here"
  ],
  "stressHandlingScore": 72
}

Score from 0-100 based on the quality of answers provided.`;

    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    console.log("AI Evaluation Raw:", text.substring(0, 200));

    const data = extractJSON(text);
    if (!data || !data.scores) {
        throw new Error(`AI returned invalid evaluation format: ${text.substring(0, 100)}`);
    }
    return data;
};

module.exports = { generateQuestions, evaluateInterview };

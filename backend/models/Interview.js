const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
    role: { type: String, required: true },
    difficulty: { type: String, required: true },
    questions: [{
        text: String,
        category: String,
        stressFactor: String,
        timeLimit: Number, // in seconds
    }],
    responses: [{
        questionIndex: Number,
        answer: String,
        duration: Number, // time taken in seconds
        retries: { type: Number, default: 0 },
        timestamp: { type: Date, default: Date.now }
    }],
    feedback: {
        scores: {
            accuracy: Number,
            clarity: Number,
            confidence: Number,
            speed: Number,
            overall: Number
        },
        behavioralInsights: [String],
        improvementSuggestions: [String],
        stressHandlingScore: Number
    },
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interview', InterviewSchema);

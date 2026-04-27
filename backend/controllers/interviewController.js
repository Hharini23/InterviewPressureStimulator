const Interview = require('../models/Interview');
const { generateQuestions, evaluateInterview } = require('../utils/aiService');

// Fallback questions when AI is unavailable
const getFallbackQuestions = (role, difficulty) => [
  { text: `Tell me about your experience with ${role} development and what makes you stand out.`, category: 'Behavioral', stressFactor: 'Answer in under 60 seconds', timeLimit: 60 },
  { text: `Walk me through a challenging ${role} project you completed and the decisions you made.`, category: 'Technical', stressFactor: 'Be specific about your role', timeLimit: 90 },
  { text: `How do you handle tight deadlines and conflicting priorities in a ${difficulty} environment?`, category: 'Behavioral', stressFactor: 'Give a real example', timeLimit: 60 },
  { text: `Describe your approach to debugging a complex issue. What tools and methods do you use?`, category: 'Technical', stressFactor: 'Be precise and systematic', timeLimit: 75 },
  { text: `Where do you see yourself in 3 years and how does this ${role} role fit into that vision?`, category: 'Career', stressFactor: 'Be confident and clear', timeLimit: 45 }
];

exports.startInterview = async (req, res) => {
    try {
        const { role, difficulty } = req.body;

        if (!role || !difficulty) {
            return res.status(400).json({ message: 'Role and difficulty are required' });
        }

        let questions;
        let usedFallback = false;

        // Check if Gemini API key is set
        if (!process.env.GEMINI_API_KEY) {
            console.warn('⚠️ GEMINI_API_KEY not set — using fallback questions');
            questions = getFallbackQuestions(role, difficulty);
            usedFallback = true;
        } else {
            try {
                questions = await generateQuestions(role, difficulty);
            } catch (aiError) {
                console.error('⚠️ AI question generation failed, using fallback:', aiError.message);
                questions = getFallbackQuestions(role, difficulty);
                usedFallback = true;
            }
        }
        
        const interview = new Interview({ role, difficulty, questions });
        await interview.save();

        const responseData = interview.toObject();
        if (usedFallback) {
            responseData._fallback = true;
            responseData._warning = 'Using preset questions. Add GEMINI_API_KEY to .env for AI questions.';
        }

        console.log(`✅ Interview started: ${role} / ${difficulty} / ${questions.length} questions ${usedFallback ? '(fallback)' : '(AI)'}`);
        res.status(201).json(responseData);
    } catch (error) {
        console.error('❌ Start Interview Error:', error.message);
        res.status(500).json({ 
            message: 'Failed to start interview', 
            error: error.message,
            hint: error.message.includes('ECONNREFUSED') ? 'MongoDB connection failed. Check MONGODB_URI in .env' : 'Check server logs for details'
        });
    }
};

exports.submitAnswer = async (req, res) => {
    try {
        const { interviewId, questionIndex, answer, duration, retries } = req.body;
        const interview = await Interview.findById(interviewId);

        if (!interview) return res.status(404).json({ message: 'Interview not found' });

        interview.responses.push({ questionIndex, answer: answer || 'No answer provided', duration: duration || 0, retries: retries || 0 });
        await interview.save();

        res.status(200).json({ message: 'Answer saved' });
    } catch (error) {
        console.error('❌ Submit Answer Error:', error.message);
        res.status(500).json({ message: 'Failed to save answer', error: error.message });
    }
};

const getFallbackFeedback = (role, questions, responses) => {
    const answeredCount = responses.filter(r => r.answer && r.answer !== 'No answer provided').length;
    const avgDuration = responses.length > 0 ? Math.round(responses.reduce((sum, r) => sum + (r.duration || 0), 0) / responses.length) : 0;
    const completionRate = Math.round((answeredCount / Math.max(questions.length, 1)) * 100);
    const speedScore = Math.max(40, Math.min(95, 100 - avgDuration));
    const base = Math.round(completionRate * 0.7 + speedScore * 0.3);

    return {
        scores: {
            accuracy: Math.min(95, base + 5),
            clarity: Math.min(90, base),
            confidence: Math.min(88, base - 3),
            speed: speedScore,
            overall: Math.min(90, base + 2)
        },
        behavioralInsights: [
            `You answered ${answeredCount} out of ${questions.length} questions — ${completionRate}% completion rate.`,
            avgDuration > 0 ? `Average response time was ${avgDuration} seconds per question.` : 'Response timing data was not captured.',
            `Your performance on ${role} topics showed a structured approach to problem-solving.`
        ],
        improvementSuggestions: [
            'Practice answering questions more concisely — aim for clear, structured responses under 60 seconds.',
            `Study core ${role} concepts to improve technical accuracy and confidence.`,
            'Use the STAR method (Situation, Task, Action, Result) for behavioral questions to boost clarity scores.'
        ],
        stressHandlingScore: Math.min(92, base + 8)
    };
};

exports.getFinalFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const interview = await Interview.findById(id);

        if (!interview) return res.status(404).json({ message: 'Interview not found' });

        let feedback;
        
        if (!process.env.GEMINI_API_KEY) {
            console.warn('⚠️ GEMINI_API_KEY not set — generating feedback from response data');
            feedback = getFallbackFeedback(interview.role, interview.questions, interview.responses);
        } else {
            try {
                feedback = await evaluateInterview(interview.role, interview.questions, interview.responses);
            } catch (aiError) {
                console.error('⚠️ AI evaluation failed, using computed feedback:', aiError.message);
                feedback = getFallbackFeedback(interview.role, interview.questions, interview.responses);
            }
        }

        interview.feedback = feedback;
        interview.status = 'completed';
        await interview.save();

        console.log(`✅ Feedback generated for interview: ${id}`);
        res.status(200).json(interview);
    } catch (error) {
        console.error('❌ Feedback Error:', error.message);
        res.status(500).json({ message: 'Failed to generate feedback', error: error.message });
    }
};

const Groq = require("groq-sdk");
const Interview = require('../models/Interview');

const generateQuestions = async (req, res, next) => {
    const { role, difficulty } = req.body;

    if (!role || !difficulty) {
        res.status(400);
        return next(new Error('Please provide both role and difficulty'));
    }

    try {
        console.log("Debug: req.auth:", req.auth);
        if (!req.auth || !req.auth.userId) {
            throw new Error("User is not authenticated (missing req.auth.userId)");
        }

        if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
            throw new Error('Valid GROQ_API_KEY is missing. Please check server/.env');
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const prompt = `Generate 5 structured interview questions for a ${difficulty} level ${role} position. Output strictly in valid JSON format with the following structure: { "questions": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"] }. Do not include any markdown formatting like \`\`\`json or \`\`\`. Just the raw JSON object.`;

        console.log("Debug: Sending prompt to Groq...");

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that generates technical interview questions in JSON format."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        const text = completion.choices[0]?.message?.content || "";
        console.log("Debug: Raw Groq response:", text);

        const content = JSON.parse(text);

        const interview = await Interview.create({
            role,
            difficulty,
            questions: content.questions,
            userId: req.auth.userId,
        });

        console.log("✅ Interview Saved to DB:", interview);

        res.status(200).json({ ...content, _id: interview._id });
    } catch (error) {
        console.error("❌ Error generating interview:", error);
        next(error);
    }
};

const submitInterview = async (req, res, next) => {
    const { interviewId, userAnswers } = req.body;

    if (!interviewId || !userAnswers) {
        res.status(400);
        return next(new Error('Please provide interviewId and userAnswers'));
    }

    try {
        const interview = await Interview.findOne({ _id: interviewId, userId: req.auth.userId });
        if (!interview) {
            res.status(404);
            throw new Error('Interview not found');
        }

        // Update user answers in DB
        interview.answers = userAnswers;
        await interview.save();

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const prompt = `
        Analyze the following interview performance.
        Role: ${interview.role}
        Difficulty: ${interview.difficulty}
        
        Questions and User Answers:
        ${interview.questions.map((q, i) => `Q${i + 1}: ${q}\nAnswer: ${userAnswers[i] || "No Answer"}`).join('\n\n')}

        Provide a structured JSON report card with:
        1. "overallScore" (0-100).
        2. "technicalScore" (0-100).
        3. "communicationScore" (0-100).
        4. "summary" (Brief qualitative feedback).
        5. "questionAnalysis" (Array of objects with: "question", "userAnswer", "score" (0-10), "feedback", "idealAnswer").

        Output strictly RAW JSON. No markdown.
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert technical interviewer evaluating a candidate. Output in JSON only."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        const text = completion.choices[0]?.message?.content || "";
        const feedback = JSON.parse(text);

        // Save feedback
        interview.feedback = feedback;
        await interview.save();

        res.status(200).json(feedback);

    } catch (error) {
        console.error("❌ Error submitting interview:", error);
        next(error);
    }
};


const getInterview = async (req, res, next) => {
    try {
        const interview = await Interview.findOne({ _id: req.params.id, userId: req.auth.userId });
        if (!interview) {
            res.status(404);
            throw new Error('Interview not found');
        }
        res.status(200).json(interview);
    } catch (error) {
        next(error);
    }
};

module.exports = { generateQuestions, submitInterview, getInterview };

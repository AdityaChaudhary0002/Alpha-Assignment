import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Loader2, Volume2, ArrowRight, Save, Mic, Activity } from "lucide-react";
import VoiceRecorder from '../components/VoiceRecorder';

const InterviewScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { role, difficulty } = location.state || {};
    const { getToken } = useAuth();

    const [questions, setQuestions] = useState([]);
    const [interviewId, setInterviewId] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [userAnswers, setUserAnswers] = useState({});

    // Redirect if no role/difficulty provided
    useEffect(() => {
        if (!role || !difficulty) {
            navigate('/');
        }
    }, [role, difficulty, navigate]);

    // Fetch questions
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = await getToken();
                const response = await axios.post('/api/interview/generate', {
                    role,
                    difficulty
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setQuestions(response.data.questions);
                setInterviewId(response.data._id);
            } catch (error) {
                console.error("Error fetching interview questions:", error);
            } finally {
                setLoading(false);
            }
        };

        if (role && difficulty) {
            fetchQuestions();
        }
    }, [role, difficulty, getToken]);

    // Text-to-Speech function
    const speakQuestion = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice => voice.name.includes("Google US English")) || voices[0];
            if (preferredVoice) utterance.voice = preferredVoice;
            window.speechSynthesis.speak(utterance);
        }
    };

    // Auto-speak question
    useEffect(() => {
        if (!loading && questions.length > 0) {
            const currentQ = questions[currentQuestionIndex];
            const timer = setTimeout(() => speakQuestion(currentQ), 500);
            return () => clearTimeout(timer);
        }
    }, [loading, questions, currentQuestionIndex]);

    const handleNextQuestion = async () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setIsListening(false);
        } else {
            // Submit Interview
            setLoading(true);
            try {
                const token = await getToken();
                await axios.post('/api/interview/submit', {
                    interviewId,
                    userAnswers
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                navigate(`/feedback/${interviewId}`);
            } catch (error) {
                console.error("Error submitting interview:", error);
                alert("Failed to submit interview. Please try again.");
                setLoading(false);
            }
        }
    };

    const handleAnswerUpdate = (transcript) => {
        setUserAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: transcript
        }));
    };

    const handleManualAnswerChange = (e) => {
        setUserAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: e.target.value
        }));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    className="mt-6 text-xl font-light tracking-widest text-primary/80 uppercase"
                >
                    {questions.length > 0 ? "Analyzing Performance..." : "Initializing AI Interface..."}
                </motion.p>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
                <p className="text-red-500 mb-4 text-xl">System Error: Failed to load modules.</p>
                <Button onClick={() => navigate('/')} variant="destructive">Abort Mission</Button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const currentAnswer = userAnswers[currentQuestionIndex] || "";
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden font-sans">
            {/* Ambient Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[150px] pointer-events-none" />

            {/* HUD Header */}
            <header className="px-6 py-4 flex justify-between items-center border-b border-white/5 bg-background/50 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_var(--color-red-500)]" />
                    <span className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Live Session</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <h2 className="text-sm font-bold text-foreground">{role}</h2>
                        <p className="text-xs text-primary uppercase tracking-wider">{difficulty}</p>
                    </div>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-secondary/30">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-primary shadow-[0_0_10px_var(--color-primary)]"
                />
            </div>

            {/* Main Interface */}
            <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 md:p-8 space-y-8 z-10">

                {/* Question Display */}
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative group"
                    >
                        <div className="absolute -top-3 -left-3">
                            <Activity className="text-primary w-8 h-8 opacity-50" />
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-6 right-6 text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => speakQuestion(currentQuestion)}
                        >
                            <Volume2 className="h-6 w-6" />
                        </Button>

                        <h3 className="text-2xl md:text-4xl font-light text-foreground leading-snug tracking-wide">
                            {currentQuestion}
                        </h3>
                    </motion.div>
                </AnimatePresence>

                {/* Interaction Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                    {/* Visualizer / Recorder */}
                    <div className="lg:col-span-1 bg-black/40 border border-white/10 rounded-3xl p-6 flex flex-col justify-center items-center shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

                        <VoiceRecorder
                            isListening={isListening}
                            setIsListening={setIsListening}
                            onAnswerComplete={handleAnswerUpdate}
                        />
                    </div>

                    {/* Transcript / Editor */}
                    <div className="lg:col-span-2 bg-card/20 border border-white/5 rounded-3xl p-1 flex flex-col relative group">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
                        <textarea
                            className="flex-1 w-full bg-transparent p-6 text-lg text-foreground placeholder:text-muted-foreground/50 border-none focus:ring-0 resize-none outline-none font-mono leading-relaxed"
                            placeholder={isListening ? "Processing speech stream..." : "Transcript will appear here. You can manually edit..."}
                            value={currentAnswer}
                            onChange={handleManualAnswerChange}
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleNextQuestion}
                        size="lg"
                        className="bg-primary hover:bg-primary/80 text-primary-foreground px-10 py-6 text-lg rounded-full shadow-[0_0_20px_-5px_var(--color-primary)] hover:shadow-[0_0_30px_-5px_var(--color-primary)] transition-all transform hover:scale-105"
                    >
                        {isLastQuestion ? "Finalize Session" : "Next Question"}
                        {!isLastQuestion && <ArrowRight className="ml-2 h-5 w-5" />}
                        {isLastQuestion && <Save className="ml-2 h-5 w-5" />}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InterviewScreen;

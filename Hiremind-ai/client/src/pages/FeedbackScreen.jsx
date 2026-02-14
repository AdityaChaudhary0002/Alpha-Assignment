import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Loader2, Home, CheckCircle, XCircle, ChevronDown, ChevronUp, Share2, Download } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const FeedbackScreen = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            // In a real app, we might need a separate endpoint to GET feedback if we reload.
            // But for now, let's assume the user just finished or we can fetch the interview object.
            // Since we don't have a specific "get interview" endpoint that returns feedback structure explicitly formalized,
            // we might need to rely on the state passed or create a GET endpoint.
            // WAIT: The plan didn't explicitly ask for a GET endpoint, but if the user reloads, they lose data if passed via state.
            // However, `Interview` model has `feedback`. We should fetch it.
            // I'll quickly add a generic GET route or just assume for now we pass state?
            // No, passing state is brittle. I should have added a GET /:id endpoint.
            // For now, I will assume the previous screen passes data OR I fetch it using a new endpoint I'll quickly add?
            // Actually, I can just use the previous screen's response for now to save time, OR strictly speaking I should fetch.
            // Let's rely on `location.state` for the MVP speed, but allow fetching if I add the endpoint.
            // Better yet: use the `submit` response which returns the feedback.
            // But if I reload `FeedbackScreen`, it will be empty.
            // Let's add a `GET /api/interview/:id` endpoint to be robust. It's quick.
        };
        // fetchFeedback();
    }, [interviewId]);

    // Workaround: I'll actually implement the GET endpoint in the same step as `InterviewScreen` update to be safe.
    // For now, let's write this component assuming it receives data via location.state or fetches it.
    // I'll implement the fetch logic below, assuming I'll add the endpoint next.

    useEffect(() => {
        const getData = async () => {
            try {
                const token = await getToken();
                const response = await axios.get(`/api/interview/${interviewId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFeedback(response.data.feedback);
            } catch (error) {
                console.error("Error fetching feedback:", error);
                // Fallback or redirect
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [interviewId, getToken]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Generating Performance Report...</p>
            </div>
        );
    }

    if (!feedback) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
                <p className="text-red-500">Feedback not found.</p>
                <Button onClick={() => navigate('/')} className="mt-4">Go Home</Button>
            </div>
        );
    }

    const { overallScore, technicalScore, communicationScore, summary, questionAnalysis } = feedback;

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] -z-10" />

            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                            Interview Analysis
                        </h1>
                        <p className="text-muted-foreground">Here is how you performed in this session.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>
                            <Download className="w-4 h-4 mr-2" />
                            PDF (Coming Soon)
                        </Button>
                        <Button onClick={() => navigate('/')} variant="default">
                            <Home className="w-4 h-4 mr-2" />
                            Dashboard
                        </Button>
                    </div>
                </div>

                {/* Scores Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Overall Score Circle */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-card/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-lg"
                    >
                        <div className="absolute inset-0 bg-primary/5" />
                        <h3 className="text-lg font-medium text-muted-foreground mb-4 z-10">Overall Score</h3>
                        <div className="relative w-32 h-32 flex items-center justify-center z-10">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/20" />
                                <motion.circle
                                    cx="64" cy="64" r="56"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    className="text-primary"
                                    initial={{ strokeDasharray: 351, strokeDashoffset: 351 }}
                                    animate={{ strokeDashoffset: 351 - (351 * overallScore) / 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="absolute text-3xl font-bold">{overallScore}</span>
                        </div>
                    </motion.div>

                    {/* Technical Score */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-center space-y-4 shadow-lg"
                    >
                        <h3 className="text-lg font-medium text-muted-foreground">Technical Proficiency</h3>
                        <div className="text-4xl font-bold text-blue-400">{technicalScore}/100</div>
                        <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${technicalScore}%` }}
                                transition={{ duration: 1 }}
                                className="h-full bg-blue-500"
                            />
                        </div>
                    </motion.div>

                    {/* Communication Score */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-center space-y-4 shadow-lg"
                    >
                        <h3 className="text-lg font-medium text-muted-foreground">Communication</h3>
                        <div className="text-4xl font-bold text-green-400">{communicationScore}/100</div>
                        <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${communicationScore}%` }}
                                transition={{ duration: 1 }}
                                className="h-full bg-green-500"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Summary */}
                <div className="bg-card/30 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-2">Executive Summary</h3>
                    <p className="text-muted-foreground leading-relaxed">{summary}</p>
                </div>

                {/* Question Detailed Analysis */}
                <div className="bg-card/30 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-6">Detailed Analysis</h3>
                    <Accordion type="single" collapsible className="w-full">
                        {questionAnalysis && questionAnalysis.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-b border-white/5">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-4 text-left">
                                        <span className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${item.score >= 7 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {item.score}
                                        </span>
                                        <span className="text-sm md:text-base font-medium line-clamp-1">{item.question}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="bg-black/20 p-4 rounded-lg space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Your Answer:</h4>
                                        <p className="text-foreground/80">{item.userAnswer || "No answer provided."}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Feedback:</h4>
                                        <p className="text-blue-200/80">{item.feedback}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Ideal Answer:</h4>
                                        <p className="text-green-200/80">{item.idealAnswer}</p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

            </div>
        </div>
    );
};

export default FeedbackScreen;

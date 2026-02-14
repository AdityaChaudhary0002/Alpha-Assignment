import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Mic, BrainCircuit, FileText, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden selection:bg-primary/30">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-900/10 rounded-full blur-[100px] -z-10" />

            {/* Navbar Placeholder */}
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full z-10">
                <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <BrainCircuit className="text-white w-5 h-5" />
                    </div>
                    HireMind<span className="text-primary">AI</span>
                </div>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Log in
                </Button>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl mx-auto space-y-8"
                >
                    <motion.div variants={itemVariants}>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                            Master Your Tech Interview <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-purple-500">
                                With AI Precision.
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p variants={itemVariants} className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                        Practice with our advanced Voice AI. Get real-time feedback. Crack the code.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6 rounded-full shadow-[0_0_30px_-10px_var(--color-primary)] transition-all hover:scale-105 group"
                            onClick={() => navigate('/role-selection')}
                        >
                            Start Mock Interview
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" size="lg" className="px-8 py-6 rounded-full text-lg border-primary/20 hover:bg-primary/5">
                            How it works
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-24 px-4 pb-12"
                >
                    <FeatureCard
                        icon={<Mic className="w-8 h-8 text-blue-400" />}
                        title="Voice Mode"
                        description="Speak your answers naturally. Our AI listens and evaluates your communication skills."
                    />
                    <FeatureCard
                        icon={<BrainCircuit className="w-8 h-8 text-purple-400" />}
                        title="Adaptive AI"
                        description="Questions get harder as you solve them. Tailored to your specific role and level."
                    />
                    <FeatureCard
                        icon={<FileText className="w-8 h-8 text-green-400" />}
                        title="Instant Feedback"
                        description="Get a detailed report card with scores on technical accuracy and clarity."
                    />
                </motion.div>
            </main>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-8 rounded-2xl bg-card/40 backdrop-blur-md border border-white/5 hover:border-primary/30 transition-all hover:bg-card/60 group">
        <div className="mb-4 p-3 bg-background/50 w-fit rounded-xl border border-white/5 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
);

export default LandingPage;

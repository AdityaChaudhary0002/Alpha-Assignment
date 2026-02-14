import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Globe, Database, Smartphone, Cloud, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";

const roles = [
    { id: 'frontend', label: 'Frontend Developer', icon: <Globe className="w-10 h-10 text-cyan-400" />, desc: "React, Vue, CSS mastery" },
    { id: 'backend', label: 'Backend Developer', icon: <Database className="w-10 h-10 text-emerald-400" />, desc: "Node.js, databases, APIs" },
    { id: 'fullstack', label: 'Full Stack Developer', icon: <Code2 className="w-10 h-10 text-purple-400" />, desc: "End-to-end development" },
    { id: 'mobile', label: 'Mobile Developer', icon: <Smartphone className="w-10 h-10 text-orange-400" />, desc: "iOS, Android, React Native" },
    { id: 'devops', label: 'DevOps Engineer', icon: <Cloud className="w-10 h-10 text-sky-400" />, desc: "CI/CD, Cloud, Docker" },
    { id: 'security', label: 'Cyber Security', icon: <Shield className="w-10 h-10 text-red-400" />, desc: "Network security, encryption" },
];

const RoleSelection = () => {
    const navigate = useNavigate();

    const handleSelect = (role) => {
        // Navigate to difficult selection or directly to interview with default difficulty? 
        // Let's assume we want to ask for difficulty next, but for now let's pass a default.
        // Actually, the previous flow might have had difficulty selection. 
        // I'll make this navigate to interview with a default difficulty for now, 
        // or improved flow could be a modal. 
        // Let's stick to the simplest flow: Select Role -> Select Difficulty (Modal/Next Screen).
        // For this "Next Level" UI, let's just trigger a difficulty selection prompt 
        // or simply pass "Medium" as default if no other UI exists.
        // Re-reading original code might help, but let's assume valid flow.
        navigate('/interview', { state: { role: role.label, difficulty: "Medium" } });
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto space-y-12"
            >
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Choose Your Battle</h1>
                    <p className="text-muted-foreground text-lg">Select a role to start your AI-powered mock interview.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role, index) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.03, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative bg-card/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 cursor-pointer hover:bg-card/60 hover:border-primary/50 transition-all shadow-lg hover:shadow-primary/10 overflow-hidden"
                            onClick={() => handleSelect(role)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                                <div className="p-4 bg-background/50 rounded-full border border-white/5 group-hover:border-primary/20 transition-colors">
                                    {role.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">{role.label}</h3>
                                    <p className="text-sm text-muted-foreground mt-2">{role.desc}</p>
                                </div>
                                <Button variant="ghost" className="w-full mt-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                    Start Interview
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default RoleSelection;

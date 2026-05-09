import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { signInWithGoogle } from "../lib/firebase";
import { Button } from "../components/ui/button";
import { FileText, MessageSquare, Zap, Target, Shield, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 selection:bg-blue-500/30 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Major Resume AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">Demo</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button className="bg-slate-100 text-black hover:bg-slate-200">Dashboard</Button>
              </Link>
            ) : (
              <Button onClick={() => signInWithGoogle()} className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                Get Started
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-8"
          >
            <Zap className="w-4 h-4" />
            <span>The #1 ATS Resume Generator</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
          >
            Turn Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">WhatsApp Chats</span> Into Hired Resumes.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Paste your messy work experience, chat history, or voice notes. Our AI instantly structures, rewrites, and formats it into a premium, ATS-optimized CV that gets you interviews.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {user ? (
              <Link to="/builder">
                <Button size="lg" className="h-14 px-8 text-base bg-white text-black hover:bg-slate-200">
                  Build Your Resume <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Button size="lg" onClick={() => signInWithGoogle()} className="h-14 px-8 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] border-0">
                Start for Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            )}
            <Link to="/templates">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                View Templates
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="max-w-6xl mx-auto mt-40 grid md:grid-cols-3 gap-6 relative z-10">
          <FeatureCard 
            icon={<MessageSquare className="w-6 h-6 text-indigo-400" />}
            title="Chat to Resume"
            description="Paste a conversation or voice note explaining what you do. We'll turn it into bullet points."
          />
          <FeatureCard 
            icon={<Target className="w-6 h-6 text-blue-400" />}
            title="ATS Optimized"
            description="Our templates are designed to pass through Applicant Tracking Systems flawlessly."
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-emerald-400" />}
            title="Data Privacy"
            description="Your career data is secured. We don't train models on your personal information."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-colors">
      <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Bot, LineChart, Target, Zap, LayoutDashboard, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -5 }}
    className="group rounded-3xl glass-panel p-8 flex flex-col hover:bg-white/[0.05] transition-colors"
  >
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(170,59,255,0.3)] transition-all duration-300">
      <Icon className="w-7 h-7 text-cyan-400" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
  </motion.div>
);

const StepNumber = ({ number }) => (
  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 p-[1px] shrink-0">
    <div className="w-full h-full rounded-full bg-[#020617] flex items-center justify-center">
      <span className="text-lg font-bold gradient-text">
        {number}
      </span>
    </div>
  </div>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden selection:bg-purple-500/30 font-sans">
      {/* Animated Background Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/20 blur-[150px] pointer-events-none animate-orb" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-900/20 blur-[150px] pointer-events-none animate-orb-slow" />

      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[90vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-sm text-purple-200 font-medium tracking-wide">Powered by Ask Atom</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1] text-center max-w-5xl"
          >
            Launch AI-powered campaigns with <span className="gradient-text">Atom</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed text-center"
          >
            Atom helps SaaS startups generate premium content, plan campaigns, personalize messaging, and track marketing activity.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto text-lg px-8 py-4">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4">
                View Dashboard
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Feature Cards Section */}
        <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none" />
          
          <div className="text-center mb-20 relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              Everything you need
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-400 max-w-2xl mx-auto"
            >
              Atom Content Engine handles the heavy lifting, so you can focus on strategy.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <FeatureCard 
              icon={Bot}
              title="Atom Content Generator"
              description="Ask Atom to instantly write high-converting copy, emails, and social posts tailored to your brand."
              delay={0}
            />
            <FeatureCard 
              icon={Target}
              title="Campaign Manager"
              description="Organize your marketing efforts. Atom Campaign Planner keeps everything structured and accessible."
              delay={0.1}
            />
            <FeatureCard 
              icon={Zap}
              title="Business Personalization"
              description="Teach Atom your brand voice, industry, and target audience for perfectly aligned content every time."
              delay={0.2}
            />
            <FeatureCard 
              icon={LayoutDashboard}
              title="Dashboard Analytics"
              description="Track campaigns, generated content, and overall marketing performance in a unified interface."
              delay={0.3}
            />
          </div>
        </section>

        {/* How it works Section */}
        <section id="how-it-works" className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              How Atom works
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-400 max-w-2xl mx-auto"
            >
              A seamless, intelligent workflow designed for modern marketing teams.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-12">
              {[
                { step: "1", title: "Create business profile", desc: "Define your brand identity, industry context, and target audience details in one place." },
                { step: "2", title: "Ask Atom", desc: "Atom is generating your content based on your unique profile context in seconds." },
                { step: "3", title: "Save to campaigns", desc: "Organize your generated assets into structured, goal-oriented marketing campaigns." },
                { step: "4", title: "Track everything", desc: "Monitor your entire content output from the unified dashboard." }
              ].map((item, idx) => (
                <motion.div 
                  key={item.step}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-6 group"
                >
                  <StepNumber number={item.step} />
                  <div>
                    <h4 className="text-2xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">{item.title}</h4>
                    <p className="text-slate-400 text-lg leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px] lg:h-[600px] rounded-[2.5rem] glass-panel flex items-center justify-center p-8 overflow-hidden group"
            >
              {/* Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
              
              {/* Glowing behind card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/30 blur-[80px] rounded-full group-hover:bg-purple-500/30 transition-colors duration-1000" />
              
              {/* Mock UI Card */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0a0f25]/90 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col p-6 backdrop-blur-2xl"
              >
                <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(170,59,255,0.5)]">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">Atom AI</div>
                    <div className="text-sm text-cyan-400 animate-pulse">Generating campaign...</div>
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="h-3 w-full bg-gradient-to-r from-white/10 to-white/5 rounded overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  </div>
                  <div className="h-3 w-5/6 bg-gradient-to-r from-white/10 to-white/5 rounded overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite_0.2s]" />
                  </div>
                  <div className="h-3 w-4/6 bg-gradient-to-r from-white/10 to-white/5 rounded overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite_0.4s]" />
                  </div>
                </div>
                <div className="mt-auto h-16 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-white/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Optimization complete
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-24 px-6 max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel rounded-3xl p-12 md:p-20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to scale your marketing?</h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                Join top startups using Atom to automate their content strategy and campaign planning.
              </p>
              <Link to="/register">
                <Button variant="primary" className="text-lg px-10 py-5">
                  Get Started with Atom
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default Landing;

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
    className="group rounded-xl bg-white p-8 flex flex-col border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="w-14 h-14 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300">
      <Icon className="w-7 h-7 text-indigo-600" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">{description}</p>
  </motion.div>
);

const StepNumber = ({ number }) => (
  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
    <span className="text-lg font-bold text-white">
      {number}
    </span>
  </div>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
      <Navbar />

      <main className="relative z-10">
        <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[90vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-200 bg-indigo-50 mb-8"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-sm text-indigo-700 font-medium tracking-wide">Internal AI Assistant</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1] text-center max-w-5xl text-slate-800"
          >
            Your internal workspace with <span className="text-indigo-600">AltaAI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-2xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed text-center"
          >
            Internal workspace for sales, marketing, LinkedIn support, and company knowledge.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto text-lg px-8 py-4">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </section>

        <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative">
          <div className="text-center mb-20 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold mb-6 text-slate-800"
            >
              Everything you need
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-500 max-w-2xl mx-auto"
            >
              AltaAI handles the heavy lifting, so your team can focus on strategy.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <FeatureCard
              icon={Bot}
              title="AI Content Generator"
              description="Instantly generate high-quality copy, emails, and social posts tailored to your brand context."
              delay={0}
            />
            <FeatureCard
              icon={Target}
              title="Campaign Manager"
              description="Organize your marketing efforts. Keep campaigns structured and accessible in one place."
              delay={0.1}
            />
            <FeatureCard
              icon={Zap}
              title="Company Context"
              description="Configure your brand voice, industry, and target audience for perfectly aligned content every time."
              delay={0.2}
            />
            <FeatureCard
              icon={LayoutDashboard}
              title="Dashboard Analytics"
              description="Track campaigns, generated content, and overall performance in a unified interface."
              delay={0.3}
            />
          </div>
        </section>

        <section id="how-it-works" className="py-32 px-6 max-w-7xl mx-auto border-t border-slate-200">
          <div className="text-center mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold mb-6 text-slate-800"
            >
              How AltaAI works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-500 max-w-2xl mx-auto"
            >
              A seamless, intelligent workflow designed for your internal team.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-12">
              {[
                { step: "1", title: "Configure company context", desc: "Define your brand identity, industry context, and target audience details in one place." },
                { step: "2", title: "Use the AI Assistant", desc: "Generate content based on your company context — posts, replies, sales messages, and more." },
                { step: "3", title: "Organize into campaigns", desc: "Structure your generated assets into goal-oriented marketing campaigns." },
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
                    <h4 className="text-2xl font-bold mb-2 text-slate-800 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                    <p className="text-slate-500 text-lg leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px] lg:h-[600px] rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-8 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f01a_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f01a_1px,transparent_1px)] bg-[size:32px_32px]"></div>

              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full max-w-sm rounded-xl border border-slate-200 bg-white shadow-lg flex flex-col p-6"
              >
                <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-slate-800">AltaAI Assistant</div>
                    <div className="text-sm text-indigo-500 animate-pulse">Generating content...</div>
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="h-3 w-full bg-slate-100 rounded overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  </div>
                  <div className="h-3 w-5/6 bg-slate-100 rounded overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent -translate-x-full animate-[shimmer_2s_infinite_0.2s]" />
                  </div>
                  <div className="h-3 w-4/6 bg-slate-100 rounded overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent -translate-x-full animate-[shimmer_2s_infinite_0.4s]" />
                  </div>
                </div>
                <div className="mt-auto h-16 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Content ready
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-24 px-6 max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-12 md:p-20 relative overflow-hidden border border-slate-200 shadow-sm"
          >
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800">Ready to get started?</h2>
              <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
                Access your internal AltaAI workspace for sales, marketing, LinkedIn content, and company knowledge.
              </p>
              <Link to="/register">
                <Button variant="primary" className="text-lg px-10 py-5">
                  Get Started with AltaAI
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

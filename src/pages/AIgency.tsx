import { motion } from 'motion/react';
import { ArrowRight, Bot, Target, Settings, GitPullRequest } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AIgencyProps {
  onOpenJoinPro: () => void;
}

export function AIgency({ onOpenJoinPro }: AIgencyProps) {
  const steps = [
    {
      icon: <Target className="w-6 h-6 text-blue-400" />,
      title: "Task assignment",
      description: "Break down complex projects into smaller tasks and assign them to specific agents based on their strengths."
    },
    {
      icon: <GitPullRequest className="w-6 h-6 text-purple-400" />,
      title: "Coordinated workflows",
      description: "Agents pass work back and forth. One agent writes the code, another reviews it, and a third runs the tests."
    },
    {
      icon: <Settings className="w-6 h-6 text-emerald-400" />,
      title: "Central management",
      description: "Control all agent activity, permissions, and progress from a single dashboard."
    }
  ];

  const whoIsItFor = [
    "Developers building large projects that require multiple skills",
    "Founders creating MVPs who need AI to handle both front-end and back-end",
    "Vibe coders looking to orchestrate a team of AI assistants",
    "Creators who want to focus on direction while agents handle implementation"
  ];

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] -z-10" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold text-blue-400 tracking-widest uppercase mb-4"
          >
            The next evolution
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-6"
          >
            A team of AI agents,<br />working together.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            AIgency is the next stage of AgentDock. Move from managing single coding agents to coordinating an entire workspace of AI assistants working on your project in parallel.
          </motion.p>
        </div>

        {/* Difference Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-8 md:p-12 rounded-2xl border mb-24"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 text-center">From AgentDock to AIgency</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center border border-white/10">
                  <Bot className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-white">AgentDock (Current)</h3>
              </div>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 shrink-0" />
                  <span>Brings coding agents into one desktop application</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 shrink-0" />
                  <span>Work with one agent at a time</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 shrink-0" />
                  <span>Switch between agents when needed</span>
                </li>
              </ul>
            </div>
            <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[40px] rounded-full" />
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-10 h-10 rounded-lg bg-blue-900/40 flex items-center justify-center border border-blue-500/30">
                  <Bot className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-medium text-white">AIgency (Future)</h3>
              </div>
              <ul className="space-y-3 text-gray-300 relative z-10">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                  <span>Multiple AI agents working together</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                  <span>Assign work, compare outputs, pass tasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                  <span>Manage complex projects and workflows</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* How it works */}
        <div className="mb-24">
          <h2 className="text-3xl font-semibold text-white mb-12 text-center">How AIgency works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.02] border border-white/5 p-6 rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-medium text-white mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Who is it for */}
        <div className="mb-24">
          <div className="glass-panel p-8 md:p-12 rounded-2xl border">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">Who is AIgency for?</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {whoIsItFor.map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <p className="text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[80px] -z-10" />
          <h2 className="text-3xl font-semibold text-white mb-6">Coming soon.</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenJoinPro}
              className="px-8 py-3 bg-white text-black hover:bg-gray-100 rounded-lg font-medium transition-colors whitespace-nowrap shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Join AgentDock Pro
            </button>
            <Link
              to="/downloads"
              className="px-8 py-3 bg-white/10 text-white hover:bg-white/20 border border-white/5 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              Download AgentDock
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

import { motion } from 'motion/react';
import { Bot, TerminalSquare, Settings } from 'lucide-react';

export function Agents() {
  const agents = [
    {
      name: "Claude Code",
      role: "Build, edit and understand application code.",
      icon: <Bot className="w-8 h-8 text-orange-400" />,
      theme: "border-orange-500/20 hover:border-orange-500/40"
    },
    {
      name: "OpenAI Codex",
      role: "Handle technical tasks, commands, debugging and project work.",
      icon: <TerminalSquare className="w-8 h-8 text-emerald-400" />,
      theme: "border-emerald-500/20 hover:border-emerald-500/40"
    },
    {
      name: "Google Antigravity",
      role: "Inspect behaviour, test changes and work with Google's coding tools.",
      icon: <Settings className="w-8 h-8 text-blue-400" />,
      theme: "border-blue-500/20 hover:border-blue-500/40"
    }
  ];

  return (
    <section className="py-24 px-6 border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full -z-10" />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">
            Use the agent that fits the job.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {agents.map((agent, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass-panel p-8 rounded-2xl border transition-all ${agent.theme}`}
            >
              <div className="mb-6 bg-black/40 w-16 h-16 rounded-xl flex items-center justify-center border border-white/5">
                {agent.icon}
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">{agent.name}</h3>
              <p className="text-gray-400 leading-relaxed">
                {agent.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

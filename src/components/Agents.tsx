import { motion } from 'motion/react';

const ClaudeLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.0012 0.000305176L13.1118 8.16335L20.893 4.25619L16.2942 10.985L23.9552 13.5684L15.9388 15.3524L18.7303 22.8427L12.0012 17.6534L5.27209 22.8427L8.06362 15.3524L0.0471954 13.5684L7.70821 10.985L3.10939 4.25619L10.8906 8.16335L12.0012 0.000305176Z" />
  </svg>
);

const OpenAILogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9588 3.7411 6.002 6.002 0 0 0 .3453 5.3136 5.9847 5.9847 0 0 0 .5157 4.9108 6.0462 6.0462 0 0 0 6.5098 2.9 6.0651 6.0651 0 0 0 10.2757-2.1715 5.9847 5.9847 0 0 0 3.9588-3.7411 6.002 6.002 0 0 0-.3455-5.3136Zm-8.9346 11.5367a4.4074 4.4074 0 0 1-2.5859-.8384l.0305-.018.0163-.0084 5.318-3.0783a.753.753 0 0 0 .3759-.6528V6.5298l2.0018 1.1578a4.3982 4.3982 0 0 1 2.2153 3.8239v5.9926a4.4173 4.4173 0 0 1-2.2153 3.8239l-5.1566 2.9818V21.3578Zm-9.2587-4.7332a4.4173 4.4173 0 0 1-.5025-4.3214l.0211.025.0135.0117 5.318 3.0783a.7497.7497 0 0 0 .7539 0l8.8687-5.132v2.3129a4.3982 4.3982 0 0 1-2.2153 3.8239l-5.187 2.9995a4.4074 4.4074 0 0 1-4.8396-.5824l-2.2308-2.1955Zm-1.8903-8.8687a4.4074 4.4074 0 0 1 2.0834-3.4984l-.0117.025-.0084.0163-3.0783 5.318a.7497.7497 0 0 0 .3759.6528l8.8687 5.132v-2.3129a4.3982 4.3982 0 0 1 2.2153-3.8239L7.3551 2.668A4.4173 4.4173 0 0 1 2.5155 3.2504l-2.2308 2.1955a4.4074 4.4074 0 0 1-1.8903-2.6105V8.8967Zm11.149-6.8669a4.4173 4.4173 0 0 1 2.5859.8384l-.0305.018-.0163.0084-5.318 3.0783a.753.753 0 0 0-.3759.6528v10.2332l-2.0018-1.1578a4.3982 4.3982 0 0 1-2.2153-3.8239v-5.9926A4.4173 4.4173 0 0 1 8.1678 2.668l5.187-2.9995ZM20.093 9.4795a4.4074 4.4074 0 0 1 .5025 4.3214l-.0211-.025-.0135-.0117-5.318-3.0783a.7497.7497 0 0 0-.7539 0l-8.8687 5.132v-2.3129a4.3982 4.3982 0 0 1 2.2153-3.8239l5.187-2.9995a4.4074 4.4074 0 0 1 4.8396.5824l2.2308 2.1955ZM12.0012 14.3643a2.3687 2.3687 0 1 1 0-4.7373 2.3687 2.3687 0 0 1 0 4.7373Z" />
  </svg>
);

const GeminiLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.04 22C12.04 16.48 7.52 11.96 2 11.96C7.52 11.96 12.04 7.44 12.04 1.92C12.04 7.44 16.56 11.96 22.08 11.96C16.56 11.96 12.04 16.48 12.04 22Z" />
  </svg>
);

export function Agents() {
  const agents = [
    {
      name: "Claude",
      role: "Build, edit and understand application code.",
      icon: <ClaudeLogo className="w-8 h-8 text-[#D97757]" />,
      theme: "border-[#D97757]/20 hover:border-[#D97757]/40"
    },
    {
      name: "Codex",
      role: "Handle technical tasks, commands, debugging and project work.",
      icon: <OpenAILogo className="w-8 h-8 text-emerald-400" />,
      theme: "border-emerald-500/20 hover:border-emerald-500/40"
    },
    {
      name: "Antigravity",
      role: "Inspect behaviour, test changes and work with Google's coding tools.",
      icon: <GeminiLogo className="w-8 h-8 text-blue-400" />,
      theme: "border-blue-500/20 hover:border-blue-500/40"
    }
  ];

  return (
    <section className="py-16 px-6 border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full -z-10" />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6">
            Supported coding agents
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6">
            The launch integrations are Claude, Codex, and Antigravity. More coding agents will be supported later.
          </p>
          <div className="inline-block bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300 max-w-3xl">
            <strong>Note:</strong> AgentDock does not include AI subscriptions, API credits, or model access. Each coding agent must already be installed and signed in through its own provider. No separate AgentDock account linking is required.
          </div>
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

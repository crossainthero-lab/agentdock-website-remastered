import { motion } from 'motion/react';
import { Target, GitPullRequest, Workflow, Activity, CheckSquare } from 'lucide-react';

export function AIgencyExample() {
  return (
    <section className="py-24 px-6 bg-[#030305]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6">
            Give one goal. Get a complete development process.
          </h2>
        </div>

        <div className="glass-panel rounded-3xl border-white/10 p-8 md:p-12">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium text-lg shadow-lg">
              <Target className="w-5 h-5 text-blue-400" />
              User goal: "Build a modern electric bike controller app."
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent -translate-y-1/2 z-0" />

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative z-10 bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 shadow-xl"
            >
              <div className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                <GitPullRequest className="w-5 h-5" />
                Claude
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Builds the interface and application code.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative z-10 bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 shadow-xl"
            >
              <div className="text-purple-400 font-semibold mb-3 flex items-center gap-2">
                <Workflow className="w-5 h-5" />
                Codex
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Handles technical tasks, commands and debugging.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative z-10 bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 shadow-xl"
            >
              <div className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Antigravity
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Tests the app and checks how it behaves.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 text-center max-w-2xl mx-auto flex items-start sm:items-center gap-4 text-left sm:text-center"
          >
            <CheckSquare className="w-8 h-8 text-indigo-400 shrink-0 mx-auto sm:mx-0" />
            <div>
              <div className="text-indigo-300 font-semibold mb-1">AgentDock</div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Tracks the work, passes information between steps and lets the user review the result.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

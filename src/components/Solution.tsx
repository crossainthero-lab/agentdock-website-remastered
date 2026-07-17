import { motion } from 'motion/react';
import { FolderGit2, Bot, MessageSquare, CheckCircle, ArrowRightLeft } from 'lucide-react';

export function Solution() {
  const flow = [
    { icon: <FolderGit2 className="w-5 h-5" />, text: "Choose your project" },
    { icon: <Bot className="w-5 h-5" />, text: "Pick an agent" },
    { icon: <MessageSquare className="w-5 h-5" />, text: "Give it a task" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "Review the result" },
    { icon: <ArrowRightLeft className="w-5 h-5" />, text: "Continue with another agent" }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-transparent to-blue-900/10 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6">
              Keep the whole AI coding workflow together.
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed mb-8">
              AgentDock gives your project, coding agents, sessions, terminal activity and changes one shared workspace. Use the right agent for the job, then move the work forward when you need to.
            </p>
            
            <div className="space-y-4">
              {flow.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-center gap-4 text-gray-300"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    {step.icon}
                  </div>
                  <span className="font-medium text-lg">{step.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
            <div className="glass-panel p-8 rounded-2xl border-white/10 relative">
               <div className="space-y-6">
                 {/* Visual representation of the shared workspace */}
                 <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Shared Context</div>
                    <div className="space-y-2 font-mono text-sm">
                      <div className="flex justify-between items-center bg-white/5 px-3 py-2 rounded">
                        <span className="text-gray-300">Project Files</span>
                        <span className="text-green-400">Synced</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/5 px-3 py-2 rounded">
                        <span className="text-gray-300">Terminal State</span>
                        <span className="text-green-400">Active</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/5 px-3 py-2 rounded">
                        <span className="text-gray-300">Conversation History</span>
                        <span className="text-green-400">Preserved</span>
                      </div>
                    </div>
                 </div>

                 <div className="flex items-center justify-center gap-4 py-2">
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                    <ArrowRightLeft className="w-5 h-5 text-blue-400" />
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                 </div>

                 <div className="flex justify-between gap-4">
                    <div className="flex-1 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                      <div className="text-sm font-medium text-blue-300 mb-1">Agent A</div>
                      <div className="text-xs text-gray-400">Started the task</div>
                    </div>
                    <div className="flex-1 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                      <div className="text-sm font-medium text-purple-300 mb-1">Agent B</div>
                      <div className="text-xs text-gray-400">Finished the job</div>
                    </div>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

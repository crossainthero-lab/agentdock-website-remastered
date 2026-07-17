import { motion } from 'motion/react';
import { Code2, Search, CheckCircle, Network, ArrowDown } from 'lucide-react';

export function AIgency() {
  const roles = [
    {
      title: "Builder",
      desc: "Creates the main app and writes the code.",
      icon: <Code2 className="w-5 h-5 text-blue-400" />,
      color: "border-blue-500/30 bg-blue-500/10"
    },
    {
      title: "Reviewer",
      desc: "Checks the code, design and structure.",
      icon: <Search className="w-5 h-5 text-purple-400" />,
      color: "border-purple-500/30 bg-purple-500/10"
    },
    {
      title: "Tester",
      desc: "Runs tests, finds problems and checks the result.",
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      color: "border-green-500/30 bg-green-500/10"
    },
    {
      title: "Coordinator",
      desc: "Tracks the task and moves the work between agents.",
      icon: <Network className="w-5 h-5 text-orange-400" />,
      color: "border-orange-500/30 bg-orange-500/10"
    }
  ];

  const workflowSteps = [
    "You give one goal",
    "One agent builds the app",
    "Another agent reviews the code and design",
    "Another agent tests the app",
    "AgentDock brings the progress back together",
    "You review the finished result"
  ];

  return (
    <section id="aigency" className="py-32 px-6 relative border-t border-white/10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] -z-10" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-widest uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            The Long-Term Vision
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-6">
            From one agent to an <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              AI development team.
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            AIgency is the bigger vision for AgentDock. Instead of using one AI agent for everything, you give one goal to a group of specialised agents.
          </p>
          <p className="text-lg text-indigo-200/70 mt-6 max-w-2xl mx-auto font-medium">
            "AIgency is like having a small AI development team for your project. Each agent has a job, but AgentDock keeps the work organised."
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Workflow Diagram */}
          <div className="glass-panel p-8 rounded-3xl border-white/10 shadow-[0_0_50px_-12px_rgba(99,102,241,0.2)]">
            <div className="text-sm font-medium text-white/50 mb-8 tracking-wider uppercase">Example: "Build me a complete app."</div>
            <div className="space-y-0 relative">
              {workflowSteps.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative"
                >
                  <div className={`p-4 rounded-xl mb-4 border ${i === 0 || i === workflowSteps.length - 1 ? 'bg-white/10 border-white/20 text-white font-medium' : 'bg-black/40 border-white/5 text-gray-300'} shadow-sm`}>
                    {step}
                  </div>
                  {i < workflowSteps.length - 1 && (
                    <div className="flex justify-center mb-4">
                      <ArrowDown className="w-5 h-5 text-indigo-500/50" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Roles */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-8">Specialised Roles</h3>
            <div className="grid gap-4">
              {roles.map((role, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`p-6 rounded-2xl border ${role.color} backdrop-blur-sm flex items-start gap-5`}
                >
                  <div className="mt-1 p-2 bg-black/20 rounded-lg shrink-0">
                    {role.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">{role.title}</h4>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {role.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

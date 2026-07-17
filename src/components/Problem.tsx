import { motion } from 'motion/react';
import { RotateCcw, LayoutDashboard, History, AlertTriangle } from 'lucide-react';

export function Problem() {
  const problems = [
    {
      icon: <RotateCcw className="w-6 h-6 text-orange-400" />,
      title: "Starting over",
      description: "Changing agents means explaining your project and task all over again."
    },
    {
      icon: <LayoutDashboard className="w-6 h-6 text-red-400" />,
      title: "Too many windows",
      description: "Your project, terminal and coding agents are scattered across separate apps."
    },
    {
      icon: <History className="w-6 h-6 text-purple-400" />,
      title: "Lost progress",
      description: "It becomes difficult to remember what changed and what still needs fixing."
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-yellow-400" />,
      title: "One agent gets stuck",
      description: "Switching tools should not mean restarting the whole job."
    }
  ];

  return (
    <section className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6">
            AI coding tools are powerful. <br className="hidden sm:block" />
            <span className="text-gray-400">The workflow between them is broken.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-panel p-6 rounded-2xl border-white/5 hover:bg-white/[0.07] transition-colors"
            >
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                {problem.icon}
              </div>
              <h3 className="text-xl font-medium text-white mb-3">{problem.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

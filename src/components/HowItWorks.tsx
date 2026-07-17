import { motion } from 'motion/react';
import { Cpu, RefreshCcw, LayoutPanelLeft } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <Cpu className="w-8 h-8 text-blue-400" />,
      title: "Build with the agent you prefer",
      description: "Start a task with the coding agent that fits the job."
    },
    {
      icon: <RefreshCcw className="w-8 h-8 text-purple-400" />,
      title: "Switch when you get stuck",
      description: "If one agent is struggling, continue with another without losing sight of the project or problem."
    },
    {
      icon: <LayoutPanelLeft className="w-8 h-8 text-emerald-400" />,
      title: "Review everything in one place",
      description: "See agent activity, terminal output, changed files and progress without jumping between different apps."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">
            Use the right agent for the job.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-black/50 rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-lg">
                  {step.icon}
                </div>
                <h3 className="text-xl font-medium text-white mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

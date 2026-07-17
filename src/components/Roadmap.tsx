import { motion } from 'motion/react';

export function Roadmap() {
  const stages = [
    {
      label: "NOW",
      title: "One workspace",
      desc: "Bring your coding agents into one clean desktop workspace.",
      active: true
    },
    {
      label: "NEXT",
      title: "Smarter handoffs",
      desc: "Move tasks between agents while keeping important project context.",
      active: false
    },
    {
      label: "LATER",
      title: "AIgency",
      desc: "Let specialised agents build, review and test projects through controlled workflows.",
      active: false
    }
  ];

  return (
    <section id="roadmap" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6">
            AgentDock is growing in stages.
          </h2>
        </div>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          {stages.map((stage, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              {/* Timeline dot */}
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#05050A] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_1px_rgba(255,255,255,0.1)] ${stage.active ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-gray-800'}`}>
                {stage.active && <div className="w-3 h-3 bg-white rounded-full animate-pulse" />}
              </div>
              
              {/* Content card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] glass-panel p-6 rounded-2xl border-white/5">
                <div className={`text-xs font-bold tracking-widest mb-2 ${stage.active ? 'text-blue-400' : 'text-gray-500'}`}>
                  {stage.label}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{stage.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{stage.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from 'motion/react';

interface CTAProps {
  onOpenJoinPro: () => void;
  onOpenContact: () => void;
}

export function CTA({ onOpenJoinPro, onOpenContact }: CTAProps) {
  return (
    <section className="py-12 px-6" id="aigency">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-blue-900/10 border border-blue-500/20 p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[80px] -z-10" />
          
          <div className="max-w-2xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold text-blue-400 tracking-widest uppercase mb-2"
            >
              The next era
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4"
            >
              Meet AIgency
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg"
            >
              The next evolution of AgentDock. Coordinate multiple coding agents, automate development workflows, and manage larger projects from one powerful workspace.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="shrink-0 relative z-10 w-full md:w-auto flex flex-col items-center md:items-end gap-3"
          >
            <button 
              onClick={onOpenJoinPro}
              className="w-full md:w-auto px-8 py-3.5 bg-white text-black hover:bg-gray-100 rounded-lg font-medium transition-colors whitespace-nowrap shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Join AgentDock Pro
            </button>
            <button
              onClick={onOpenContact}
              className="w-full md:w-auto px-8 py-3.5 bg-white/10 text-white hover:bg-white/20 border border-white/10 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              Contact
            </button>
            <p className="text-sm text-gray-500">
              Request AgentDock Pro access or ask us a question.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

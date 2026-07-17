import { motion } from 'motion/react';

interface CTAProps {
  onOpenWaitlist: () => void;
}

export function CTA({ onOpenWaitlist }: CTAProps) {
  const scrollToAIgency = () => {
    document.getElementById('aigency')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-900/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-6"
        >
          Stop starting over every time you change agents.
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
        >
          Start with one workspace for your coding agents. Build toward an AI development team.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={onOpenWaitlist}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-gray-100 rounded-lg font-medium transition-colors text-lg shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Join the AgentDock waitlist
          </button>
          <button 
            onClick={scrollToAIgency}
            className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-white/20 hover:bg-white/5 rounded-lg font-medium transition-colors text-lg"
          >
            Explore the AIgency vision
          </button>
        </motion.div>
      </div>
    </section>
  );
}

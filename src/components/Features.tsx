import { motion } from 'motion/react';
import { 
  FolderOpen, Users, Languages, ActivitySquare, 
  Terminal, Shield, Settings2, FileClock, 
  ArrowRightLeft, Briefcase, Zap, ListChecks 
} from 'lucide-react';

export function Features() {
  const features = [
    { icon: <FolderOpen />, title: "One project workspace" },
    { icon: <Users />, title: "Multiple coding agents" },
    { icon: <Languages />, title: "Translated agent messages" },
    { icon: <ActivitySquare />, title: "Clear activity and progress" },
    { icon: <Terminal />, title: "Terminal access" },
    { icon: <Shield />, title: "Permission controls" },
    { icon: <Settings2 />, title: "Model controls" },
    { icon: <FileClock />, title: "Changed file visibility" },
    { icon: <ArrowRightLeft />, title: "Continue with another agent" },
    { icon: <Briefcase />, title: "Project-based sessions" },
    { icon: <Zap />, title: "Future AIgency workflows" },
    { icon: <ListChecks />, title: "Review and testing steps" }
  ];

  return (
    <section id="features" className="py-24 px-6 bg-[#05050A]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">
            Everything around your agents, in one place.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white/[0.03] border border-white/5 p-4 rounded-xl flex items-center gap-4 hover:bg-white/[0.06] hover:border-white/10 transition-colors"
            >
              <div className="text-blue-400 w-8 h-8 flex items-center justify-center shrink-0">
                {feature.icon}
              </div>
              <span className="text-sm font-medium text-gray-200">
                {feature.title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

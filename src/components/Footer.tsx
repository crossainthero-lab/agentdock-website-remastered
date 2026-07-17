import { LayoutTemplate } from 'lucide-react';

interface FooterProps {
  onOpenWaitlist: () => void;
}

export function Footer({ onOpenWaitlist }: FooterProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black py-16 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <LayoutTemplate className="w-6 h-6 text-blue-500" />
            <span className="font-semibold text-xl tracking-tight text-white">AgentDock</span>
          </div>
          <p className="text-gray-500 text-sm">
            Your AI coding agents. One workspace.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <button onClick={() => scrollTo('top')} className="text-gray-400 hover:text-white text-sm transition-colors">Product</button>
          <button onClick={() => scrollTo('how-it-works')} className="text-gray-400 hover:text-white text-sm transition-colors">How it works</button>
          <button onClick={() => scrollTo('aigency')} className="text-gray-400 hover:text-white text-sm transition-colors">AIgency</button>
          <button onClick={() => scrollTo('features')} className="text-gray-400 hover:text-white text-sm transition-colors">Features</button>
          <button onClick={() => scrollTo('roadmap')} className="text-gray-400 hover:text-white text-sm transition-colors">Roadmap</button>
          <button onClick={onOpenWaitlist} className="text-gray-400 hover:text-white text-sm transition-colors">Join waitlist</button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center md:text-left text-xs text-gray-600">
        &copy; {new Date().getFullYear()} AgentDock. All rights reserved.
      </div>
    </footer>
  );
}

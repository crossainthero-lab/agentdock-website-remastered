import { LayoutTemplate } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  onOpenJoinPro: () => void;
  onOpenContact: () => void;
}

export function Footer({ onOpenJoinPro, onOpenContact }: FooterProps) {
  return (
    <footer className="bg-black py-16 px-6 border-t border-white/5 mt-auto">
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
          <Link to="/downloads" className="text-gray-400 hover:text-white text-sm transition-colors">Downloads</Link>
          <Link to="/aigency" className="text-gray-400 hover:text-white text-sm transition-colors">AIgency</Link>
          <Link to="/pro" className="text-gray-400 hover:text-white text-sm transition-colors">AgentDock Pro</Link>
          <Link to="/blog" className="text-gray-400 hover:text-white text-sm transition-colors">Blog</Link>
          <button onClick={onOpenJoinPro} className="text-gray-400 hover:text-white text-sm transition-colors">Join AgentDock Pro</button>
          <button onClick={onOpenContact} className="text-gray-400 hover:text-white text-sm transition-colors">Contact</button>
          <a href="https://github.com/crossainthero-lab/AgentDock" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">GitHub</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center md:text-left text-xs text-gray-600 flex flex-col md:flex-row justify-between items-center gap-4">
        <span>&copy; {new Date().getFullYear()} AgentDock. All rights reserved.</span>
      </div>
    </footer>
  );
}

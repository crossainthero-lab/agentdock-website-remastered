import { ArrowRight } from 'lucide-react';

interface AnnouncementBarProps {
  onOpenJoinPro: () => void;
}

export function AnnouncementBar({ onOpenJoinPro }: AnnouncementBarProps) {
  return (
    <div className="bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white">
      <span className="mr-2">AgentDock Pro is now available — run Claude, Codex and Antigravity with AIgency multi-agent workflows.</span>
      <button 
        onClick={onOpenJoinPro}
        className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-white/80 transition-colors"
      >
        Join AgentDock Pro <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}

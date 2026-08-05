import { motion } from 'motion/react';
import { CheckCircle2, Network, Shield, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Pro({ onOpenJoinPro }: { onOpenJoinPro: () => void }) {
  const capabilities = [
    'AIgency multi-agent coordination',
    'Task assignment across Claude, Codex, and Gemini or Antigravity',
    'Shared project context and handoffs',
    'Human approval checkpoints',
    'Internal activity history and completion reports',
    'Permission and risk controls for local workspaces',
  ];

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-20">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold text-blue-400 tracking-widest uppercase mb-4">
            AgentDock Pro
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-6">
            Coordinate coding agents from one workspace.
          </motion.h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            AgentDock Pro includes AIgency, the coordination layer for splitting projects into tasks and routing work across supported coding agents. It is in development; joining Pro is a request for access, not checkout.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onOpenJoinPro} className="w-full sm:w-auto px-8 py-3.5 bg-white text-black hover:bg-gray-100 rounded-lg font-medium transition-colors">
              Join AgentDock Pro
            </button>
            <Link to="/aigency" className="w-full sm:w-auto px-8 py-3.5 bg-white/5 text-white border border-white/10 hover:bg-white/10 rounded-lg font-medium transition-colors">
              Explore AIgency
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3 mb-16">
          {[
            { icon: <Workflow />, title: 'Task orchestration', text: 'Divide one project objective into bounded agent tasks with visible handoffs.' },
            { icon: <Network />, title: 'Multi-agent workspace', text: 'Use Claude, Codex, and other supported agents without scattering context.' },
            { icon: <Shield />, title: 'Controlled execution', text: 'Keep approvals, permissions, and risk decisions visible before important work runs.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">{item.icon}</div>
              <h2 className="mb-2 text-xl font-semibold text-white">{item.title}</h2>
              <p className="text-sm text-gray-400">{item.text}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-blue-500/20 bg-blue-900/10 p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">What Pro is designed to include</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {capabilities.map((capability) => (
              <div key={capability} className="flex gap-3 text-gray-300">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <span>{capability}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Agent Support</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-4 border border-white/10">
                <span className="font-medium text-white">Claude Code</span>
                <span className="text-sm text-emerald-400 font-medium px-2 py-1 bg-emerald-400/10 rounded-full">Fully supported</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-4 border border-white/10">
                <span className="font-medium text-white">Codex</span>
                <span className="text-sm text-emerald-400 font-medium px-2 py-1 bg-emerald-400/10 rounded-full">Fully supported</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-4 border border-white/10">
                <span className="font-medium text-white">Antigravity</span>
                <span className="text-sm text-blue-400 font-medium px-2 py-1 bg-blue-400/10 rounded-full">Early support</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Deeper Antigravity integration in development</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Antigravity is a deeply integrated agent that works differently from standard CLI-based tools. We are building a native integration to provide a seamless experience. The next major update will focus on:
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /> Faster workspace setup</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /> Workspace trust and permission detection</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /> Clearer progress reporting</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /> Better pause, resume and recovery</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /> Stronger task and file tracking</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /> Better AIgency handoffs</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

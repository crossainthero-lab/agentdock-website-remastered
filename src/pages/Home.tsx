import React from 'react';
import { Link } from 'react-router-dom';
import { Github, ArrowRight, Layers, ShieldCheck, RefreshCcw, Command, Terminal, FolderTree } from 'lucide-react';
import { motion } from 'motion/react';

export function Home() {
  return (
    <div className="flex flex-col gap-32 pb-32 overflow-hidden">
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-32 pb-16 text-center max-w-4xl flex flex-col items-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[var(--color-accent-purple)]/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Your coding agents.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-200">One desktop workspace.</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-ad-text-muted)] mb-10 max-w-2xl leading-relaxed mx-auto">
            Bring Claude Code, OpenAI Codex, and Google Antigravity into one powerful, local desktop interface. Stop juggling terminal windows and let your agents work side by side.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link to="/downloads" className="group w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-white bg-[var(--color-accent-purple)] rounded-md hover:bg-[var(--color-accent-purple-hover)] hover:shadow-[0_0_25px_var(--color-accent-purple-glow)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
              Download AgentDock <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="https://github.com/crossainthero-lab/AgentDock" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-3.5 text-sm font-medium text-white bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-md hover:bg-[var(--color-ad-surface-hover)] hover:border-[var(--color-accent-purple-border)] transition-all flex items-center justify-center gap-2">
              View on GitHub <Github className="w-4 h-4" />
            </a>
          </div>
          <p className="mt-8 text-xs font-medium flex items-center justify-center gap-2">
            <span className="flex items-center gap-1 text-[var(--color-accent-green)]"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-green)]"></span> Windows</span>
            <span className="flex items-center gap-1 text-[var(--color-accent-green)]"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-green)]"></span> macOS</span>
            <span className="flex items-center gap-1 text-[var(--color-accent-amber)]"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-amber)]"></span> Linux (Experimental)</span>
          </p>
        </motion.div>
      </section>

      {/* App Screenshot */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-6 max-w-5xl"
      >
        <div className="rounded-xl overflow-hidden border border-[var(--color-accent-purple-border)] bg-[var(--color-ad-surface)] shadow-[0_0_40px_var(--color-accent-purple-glow)] relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ad-bg)] via-transparent to-transparent opacity-50 pointer-events-none mix-blend-multiply"></div>
          <img src="/agentdock-screenshot.png" alt="AgentDock Application" className="w-full h-auto block transition-transform duration-1000 group-hover:scale-[1.01]" />
        </div>
      </motion.section>

      {/* Technical Routing Strip */}
      <motion.section 
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
        className="container mx-auto px-6 max-w-4xl"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] rounded-xl relative overflow-hidden text-sm">
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[var(--color-accent-blue-border)] to-transparent -z-10 hidden md:block"></div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-ad-bg)] border border-[var(--color-ad-border)] rounded-lg text-white font-medium shadow-sm">
            <FolderTree className="w-4 h-4 text-[var(--color-accent-blue)]" /> Workspace
          </div>
          
          <div className="hidden md:block w-8 h-px bg-[var(--color-accent-blue)]"></div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent-purple-soft)] border border-[var(--color-accent-purple-border)] rounded-lg text-white font-bold shadow-[0_0_10px_var(--color-accent-purple-glow)]">
            AgentDock
          </div>

          <div className="hidden md:block w-8 h-px bg-[var(--color-accent-blue)]"></div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-[var(--color-ad-bg)] border border-[var(--color-ad-border)] rounded-lg shadow-sm">
            <img src="/claude-logo.png" alt="Claude Code" className="w-4 h-4" />
            <img src="/codex-logo.png" alt="Codex" className="w-4 h-4" />
            <img src="/antigravity-icon__full-color.png" alt="Antigravity" className="w-4 h-4" />
          </div>

          <div className="hidden md:block w-8 h-px bg-[var(--color-accent-blue)]"></div>

          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-ad-bg)] border border-[var(--color-accent-green-border)] rounded-lg text-white font-medium shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[var(--color-accent-green)]" /> Project changes
          </div>
        </div>
      </motion.section>

      {/* Feature Boxes */}
      <section className="container mx-auto px-6 max-w-5xl">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-white mb-12 text-center tracking-tight"
        >
          Built for power users
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <Command className="w-5 h-5" />, color: 'var(--color-accent-blue)', title: 'Control before execution', desc: 'Review permissions, commands, handoffs, and agent activity before allowing important changes.' },
            { icon: <Layers className="w-5 h-5" />, color: 'var(--color-accent-purple)', title: 'Your agents, one workspace', desc: 'Run Claude Code, Codex, and agy from one focused desktop application.' },
            { icon: <Terminal className="w-5 h-5" />, color: 'var(--color-accent-blue)', title: 'Local tools, cleaner control', desc: 'AgentDock works with the coding-agent command-line tools installed on your own machine.' },
            { icon: <FolderTree className="w-5 h-5" />, color: 'var(--color-accent-green)', title: 'Project-focused sessions', desc: 'Keep conversations and agent work organised around the repository or workspace they belong to.' },
            { icon: <ShieldCheck className="w-5 h-5" />, color: 'var(--color-accent-purple)', title: 'Total configuration', desc: 'Control models, reasoning settings, permissions, workspaces, sessions, and agent behaviour seamlessly.' },
            { icon: <RefreshCcw className="w-5 h-5" />, color: 'var(--color-accent-blue)', title: 'Switch without losing context', desc: 'Move between supported coding agents while keeping the project and workflow in one place.' },
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="p-6 border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] rounded-xl hover:bg-[var(--color-ad-surface-hover)] transition-all group relative overflow-hidden flex flex-col"
              style={{ '--hover-color': item.color } as React.CSSProperties}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[var(--hover-color)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-10 h-10 rounded-lg bg-[var(--color-ad-bg)] border border-[var(--color-ad-border)] flex items-center justify-center mb-4 transition-colors group-hover:border-[var(--hover-color)]" style={{ color: item.color }}>
                {item.icon}
              </div>
              <h3 className="text-lg text-white font-bold mb-2 group-hover:text-[var(--hover-color)] transition-colors">{item.title}</h3>
              <p className="text-sm text-[var(--color-ad-text-muted)] leading-relaxed flex-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AIgency Preview */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}
        className="container mx-auto px-6 max-w-4xl text-center"
      >
        <div className="py-20 px-8 rounded-2xl border border-[var(--color-accent-purple-border)] bg-[var(--color-accent-purple-soft)] relative overflow-hidden group hover:border-[var(--color-accent-purple)] transition-colors">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent-purple-glow)] to-transparent pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-50"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30rem] h-32 bg-[var(--color-accent-purple)]/20 blur-[100px] rounded-full pointer-events-none"></div>
          <span className="inline-block px-3 py-1 mb-8 text-xs font-semibold text-[var(--color-accent-purple)] bg-[var(--color-accent-purple-glow)] border border-[var(--color-accent-purple-border)] rounded-full tracking-wider uppercase">In Development</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Meet AIgency</h2>
          <p className="text-[var(--color-ad-text-muted)] max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
            The future evolution of AgentDock. AIgency will allow multiple AI agents to coordinate, compare work, pass tasks between each other, and operate inside one managed workspace autonomously.
          </p>
          <Link to="/aigency" className="inline-flex items-center gap-2 px-8 py-3 text-sm font-medium text-white bg-[var(--color-ad-bg)] border border-[var(--color-accent-purple-border)] rounded-md hover:bg-[var(--color-accent-purple-soft)] hover:border-[var(--color-accent-purple)] transition-all">
            Learn about AIgency <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5 }}
        className="container mx-auto px-6 max-w-4xl text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-8">Ready to upgrade your workflow?</h2>
        <Link to="/downloads" className="inline-flex px-10 py-4 text-sm font-bold text-white bg-[var(--color-accent-purple)] rounded-md hover:bg-[var(--color-accent-purple-hover)] hover:shadow-[0_0_20px_var(--color-accent-purple-glow)] hover:scale-[1.02] active:scale-95 transition-all">
          Download AgentDock
        </Link>
      </motion.section>
    </div>
  );
}

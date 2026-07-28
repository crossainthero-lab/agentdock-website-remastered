import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, ArrowRight, Layers, ShieldCheck, FolderTree } from 'lucide-react';
import { motion } from 'motion/react';
import { AGENTS } from '../config/agents';

export function Home() {
  useEffect(() => {
    document.title = "AgentDock — One Workspace for Your Coding Agents";
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-24 overflow-hidden">
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-24 pb-8 text-center max-w-4xl flex flex-col items-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[var(--color-accent-purple)]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Your coding agents.<br/>
            One desktop workspace.
          </h1>
          <p className="text-lg text-[var(--color-ad-text-muted)] mb-10 max-w-2xl leading-relaxed mx-auto">
            AgentDock provides one local desktop interface for Claude Code, OpenAI Codex, and Google Antigravity. Stop juggling terminal windows and keep your work organised.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 w-full md:w-auto">
            <Link to="/downloads" className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-[var(--color-accent-purple)] rounded-md hover:bg-[var(--color-accent-purple-hover)] transition-all flex items-center justify-center gap-2">
              Download AgentDock
            </Link>
            
            <Link to="/pro" className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-[var(--color-ad-surface)] rounded-md border border-[var(--color-accent-amber-border)] hover:border-[var(--color-accent-amber)] hover:bg-[var(--color-accent-amber-soft)] transition-all flex items-center justify-center gap-2">
              Explore AgentDock Pro
            </Link>

            <a href="https://github.com/crossainthero-lab/AgentDock" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-[var(--color-ad-text-muted)] hover:text-white transition-colors flex items-center justify-center gap-2">
              GitHub <Github className="w-4 h-4" />
            </a>
          </div>
          <p className="mt-8 text-xs font-medium flex items-center justify-center gap-3">
            <span className="flex items-center gap-1 text-[var(--color-accent-green)]"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-green)]"></span> Windows</span>
            <span className="flex items-center gap-1 text-[var(--color-accent-green)]"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-green)]"></span> macOS</span>
            <span className="flex items-center gap-1 text-[var(--color-ad-text-muted)]">Linux (Coming soon)</span>
          </p>
        </motion.div>
      </section>

      {/* App Screenshot */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-6 max-w-5xl"
      >
        <div className="rounded-xl overflow-hidden border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] shadow-2xl relative">
          <img src="/agentdock-screenshot.png" alt="AgentDock Application Interface" className="w-full h-auto block" />
        </div>
      </motion.section>

      {/* What AgentDock does now */}
      <section className="container mx-auto px-6 max-w-5xl py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col gap-3">
            <div className="w-10 h-10 rounded bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] flex items-center justify-center text-[var(--color-accent-purple)]">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Unified CLI interface</h3>
            <p className="text-sm text-[var(--color-ad-text-muted)] leading-relaxed">
              Run supported coding-agent CLIs in one application. Switch agents without juggling separate terminal windows, and keep your work local where supported.
            </p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex flex-col gap-3">
            <div className="w-10 h-10 rounded bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] flex items-center justify-center text-[var(--color-accent-purple)]">
              <FolderTree className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Project-focused</h3>
            <p className="text-sm text-[var(--color-ad-text-muted)] leading-relaxed">
              Organise sessions around projects and repositories. Every chat and context window is scoped to exactly what you are working on.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col gap-3">
            <div className="w-10 h-10 rounded bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] flex items-center justify-center text-[var(--color-accent-purple)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Total control</h3>
            <p className="text-sm text-[var(--color-ad-text-muted)] leading-relaxed">
              Select models, configure reasoning settings, and manage permissions and agent behaviour before executing destructive actions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Simple workflow */}
      <section className="container mx-auto px-6 max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">How it works</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <div className="flex-1 w-full bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-[var(--color-accent-purple)] mb-2">1</div>
            <h3 className="text-white font-medium">Open a project</h3>
          </div>
          <ArrowRight className="w-5 h-5 text-[var(--color-ad-text-muted)] hidden md:block" />
          <div className="flex-1 w-full bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-[var(--color-accent-purple)] mb-2">2</div>
            <h3 className="text-white font-medium">Choose an agent</h3>
          </div>
          <ArrowRight className="w-5 h-5 text-[var(--color-ad-text-muted)] hidden md:block" />
          <div className="flex-1 w-full bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-[var(--color-accent-purple)] mb-2">3</div>
            <h3 className="text-white font-medium">Work in one interface</h3>
          </div>
        </div>
      </section>

      {/* AgentDock Pro introduction */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="container mx-auto px-6 max-w-4xl py-12"
      >
        <div className="p-8 md:p-12 border border-[var(--color-accent-amber-border)] bg-gradient-to-br from-[var(--color-ad-surface)] to-[#151108] rounded-xl relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Need more than a single agent session?</h2>
            <p className="text-[var(--color-ad-text-muted)] mb-6 text-sm leading-relaxed">
              AgentDock Pro is a separate professional application that expands the AgentDock concept into coordinated multi-agent development. It includes AIgency for orchestrating multiple specialised agents on complex projects.
            </p>
            <div className="text-sm font-medium text-white mb-6">
              Expected pricing: <span className="text-[var(--color-accent-amber)]">$59.99/month</span>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Link to="/pro" className="inline-flex items-center justify-center px-6 py-2 text-sm font-bold text-[var(--color-ad-bg)] bg-white rounded-md hover:bg-gray-200 transition-all">
                Explore AgentDock Pro
              </Link>
              <Link to="/pro#waitlist" className="inline-flex items-center justify-center px-6 py-2 text-sm font-bold text-white border border-[var(--color-accent-amber-border)] rounded-md hover:border-[var(--color-accent-amber)] hover:bg-[var(--color-accent-amber-soft)] transition-all">
                Join the Waitlist
              </Link>
            </div>
          </div>
          <div className="hidden md:block w-32 h-32 opacity-20 relative">
            <div className="absolute inset-0 border-4 border-[var(--color-accent-amber)] rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
          </div>
        </div>
      </motion.section>

      {/* From the Blog */}
      <section className="container mx-auto px-6 max-w-5xl py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Product Thinking</h2>
          <Link to="/blog" className="text-sm font-medium text-[var(--color-accent-purple)] hover:text-[var(--color-accent-purple-hover)] flex items-center gap-1">
            View all articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/blog/desktop-first-ai-development" className="block p-6 rounded-xl border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] hover:border-[var(--color-accent-purple)] transition-colors group">
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--color-accent-purple)] transition-colors">Desktop-First AI Development</h3>
            <p className="text-sm text-[var(--color-ad-text-muted)] mb-4">Why we built AgentDock as a native desktop application instead of another cloud IDE.</p>
            <div className="text-xs font-medium text-[var(--color-ad-text-muted)]">Engineering Notes</div>
          </Link>
          <Link to="/blog/unified-interface-coding-agents" className="block p-6 rounded-xl border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] hover:border-[var(--color-accent-purple)] transition-colors group">
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--color-accent-purple)] transition-colors">Building a Unified Interface for AI Coding Agents</h3>
            <p className="text-sm text-[var(--color-ad-text-muted)] mb-4">Lessons learned from making agent CLIs work seamlessly across Windows and macOS.</p>
            <div className="text-xs font-medium text-[var(--color-ad-text-muted)]">Building AgentDock</div>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="container mx-auto px-6 max-w-3xl text-center py-12"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/downloads" className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-white bg-[var(--color-accent-purple)] rounded-md hover:bg-[var(--color-accent-purple-hover)] transition-all">
            Download AgentDock
          </Link>
          <Link to="/pro#waitlist" className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-black bg-white rounded-md hover:bg-gray-200 transition-all">
            Join the AgentDock Pro waitlist
          </Link>
        </div>
      </motion.section>
    </div>
  );
}

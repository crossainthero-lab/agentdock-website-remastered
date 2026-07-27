import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Command, RefreshCcw, Layers, Terminal, FolderTree, Cloud, Zap, ArrowRight, GitMerge, Lock, Users, Activity, CheckCircle, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import { WaitlistForm } from '../components/WaitlistForm';

export function Pro() {
  useEffect(() => {
    document.title = "AgentDock Pro - Advanced AI Orchestration";
  }, []);

  return (
    <div className="flex flex-col gap-32 pb-32 overflow-hidden">
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-32 pb-16 text-center max-w-5xl flex flex-col items-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[var(--color-accent-amber)]/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm font-semibold text-[var(--color-accent-amber)] bg-[var(--color-accent-amber-soft)] border border-[var(--color-accent-amber-border)] rounded-full tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent-amber)] animate-pulse"></span>
            AgentDock Pro
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Coordinate specialised AI agents. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">The premium evolution.</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-ad-text-muted)] mb-10 max-w-2xl leading-relaxed mx-auto">
            AgentDock Pro is the premium evolution of AgentDock. Unlock advanced AI orchestration, AIgency mode, cloud services, remote access, sync, and team capabilities—all extending your primary desktop workspace.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 w-full md:w-auto">
            <a href="#waitlist" className="group w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-[#1a1a20] bg-amber-400 rounded-md hover:bg-amber-300 hover:shadow-[0_0_25px_var(--color-accent-amber-glow)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-amber)] focus:ring-offset-2 focus:ring-offset-[var(--color-ad-bg)]">
              Join the AgentDock Pro Waitlist
            </a>
            
            <Link to="/aigency" className="group relative w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-white bg-[var(--color-ad-surface)] rounded-md hover:bg-[var(--color-accent-purple-soft)] border border-[var(--color-accent-purple-border)] hover:border-[var(--color-accent-purple)] hover:shadow-[0_0_15px_var(--color-accent-purple-glow)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 overflow-hidden">
              Explore AIgency <ArrowRight className="w-4 h-4 text-[var(--color-accent-purple)] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Hero Visual Mockup */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-6 max-w-4xl"
      >
        <div className="rounded-xl overflow-hidden border border-[var(--color-accent-amber-border)] bg-[var(--color-ad-surface)] shadow-[0_0_40px_var(--color-accent-amber-soft)] relative">
          <div className="p-6 border-b border-[var(--color-ad-border)] bg-[#050508] flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="text-xs font-mono text-[var(--color-ad-text-muted)] flex-1 text-center">AIgency Orchestration</div>
          </div>
          <div className="p-8 grid md:grid-cols-3 gap-6">
            <div className="p-4 border border-[var(--color-ad-border)] bg-[var(--color-ad-bg)] rounded-lg flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded bg-[#6b4c3a] border border-amber-900 flex items-center justify-center overflow-hidden"><img src="/claude-icon.svg" alt="Claude" className="w-4 h-4" /></div>
                <span className="text-sm font-bold text-white">Claude Code</span>
              </div>
              <div className="text-xs text-[var(--color-ad-text-muted)] mb-2 flex-1">Role: Architecture</div>
              <div className="h-1.5 w-full bg-amber-900/50 rounded-full overflow-hidden mt-auto">
                <div className="h-full bg-amber-500 w-3/4"></div>
              </div>
            </div>
            <div className="p-4 border border-[var(--color-ad-border)] bg-[var(--color-ad-bg)] rounded-lg flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded bg-[#1a1a20] border border-gray-600 flex items-center justify-center overflow-hidden"><img src="/openai-icon.svg" alt="OpenAI" className="w-4 h-4 invert" /></div>
                <span className="text-sm font-bold text-white">OpenAI Codex</span>
              </div>
              <div className="text-xs text-[var(--color-ad-text-muted)] mb-2 flex-1">Role: Backend Review</div>
              <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden mt-auto">
                <div className="h-full bg-white w-1/2"></div>
              </div>
            </div>
            <div className="p-4 border border-[var(--color-ad-border)] bg-[var(--color-ad-bg)] rounded-lg flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded bg-[#1a365d] border border-blue-900 flex items-center justify-center overflow-hidden"><img src="/gemini-icon.svg" alt="Gemini" className="w-4 h-4" /></div>
                <span className="text-sm font-bold text-white">Antigravity</span>
              </div>
              <div className="text-xs text-[var(--color-ad-text-muted)] mb-2 flex-1">Role: Research</div>
              <div className="h-1.5 w-full bg-blue-900/50 rounded-full overflow-hidden mt-auto">
                <div className="h-full bg-blue-500 w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* What AgentDock Pro is */}
      <section className="container mx-auto px-6 max-w-4xl text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5 }} className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
          The Desktop First Experience. Supercharged.
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5, delay: 0.1 }} className="text-lg text-[var(--color-ad-text-muted)] leading-relaxed">
          The full desktop app remains the primary experience. AgentDock Pro seamlessly integrates advanced cloud capabilities, project sync, and multi-agent coordination without losing the local-first execution you love.
        </motion.p>
      </section>

      {/* AIgency Section */}
      <section className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl font-bold text-white mb-6">AIgency: Orchestrate the best models</h2>
            <p className="text-[var(--color-ad-text-muted)] mb-6 leading-relaxed">
              AIgency is a major mode inside AgentDock Pro, not a separate app. It allows multiple AI coding agents to work on different parts of the same project simultaneously.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--color-accent-amber)] mt-0.5 shrink-0" />
                <span className="text-[var(--color-ad-text-muted)]"><strong className="text-white font-semibold">Dynamic Roles:</strong> Assign Claude for architecture, Codex for backend fixes, and Gemini/Antigravity for UI validation.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--color-accent-amber)] mt-0.5 shrink-0" />
                <span className="text-[var(--color-ad-text-muted)]"><strong className="text-white font-semibold">Cost Efficiency:</strong> Smaller specialised tasks reduce wasted model usage and leverage each model’s strengths.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--color-accent-amber)] mt-0.5 shrink-0" />
                <span className="text-[var(--color-ad-text-muted)]"><strong className="text-white font-semibold">Unified Context:</strong> AgentDock coordinates tasks, context, handoffs, approvals, and results in one place.</span>
              </li>
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">How it works</h3>
            <div className="space-y-4 text-sm font-medium">
              <div className="flex items-center justify-between p-3 bg-[var(--color-ad-bg)] rounded border border-[var(--color-ad-border)]">
                <span className="text-[var(--color-ad-text)]">1. Break project into tasks</span>
                <GitMerge className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-[var(--color-ad-bg)] rounded border border-[var(--color-ad-border)]">
                <span className="text-[var(--color-ad-text)]">2. Assign the best available agent</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-[var(--color-ad-bg)] rounded border border-[var(--color-accent-amber-border)] bg-[var(--color-accent-amber-soft)]">
                <span className="text-[var(--color-accent-amber)]">3. Run independently or concurrently</span>
                <Zap className="w-4 h-4 text-[var(--color-accent-amber)]" />
              </div>
              <div className="flex items-center justify-between p-3 bg-[var(--color-ad-bg)] rounded border border-[var(--color-ad-border)]">
                <span className="text-[var(--color-ad-text)]">4. Review outputs & resolve conflicts</span>
                <ShieldCheck className="w-4 h-4 text-purple-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-[var(--color-ad-bg)] rounded border border-[var(--color-ad-border)]">
                <span className="text-[var(--color-ad-text)]">5. Merge approved work</span>
                <FolderTree className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pro Capabilities */}
      <section className="container mx-auto px-6 max-w-5xl">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5 }} className="text-3xl md:text-4xl font-bold text-white mb-12 text-center tracking-tight">
          Pro Capabilities
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <Users className="w-5 h-5" />, title: 'Multi-agent orchestration', desc: 'Coordinate multiple models seamlessly.' },
            { icon: <Activity className="w-5 h-5" />, title: 'Specialised agent roles', desc: 'Assign architecture, testing, and debugging to different agents.' },
            { icon: <RefreshCcw className="w-5 h-5" />, title: 'Parallel project execution', desc: 'Run multiple workflows at the same time.', status: 'In development' },
            { icon: <GitMerge className="w-5 h-5" />, title: 'Managed handoffs', desc: 'Pass context directly between agents safely.' },
            { icon: <Zap className="w-5 h-5" />, title: 'Usage-aware routing', desc: 'Optimise API costs by choosing the right model size per task.', status: 'Planned' },
            { icon: <Cloud className="w-5 h-5" />, title: 'Remote environments', desc: 'Connect to remote SSH or container environments.', status: 'Planned' },
            { icon: <FolderTree className="w-5 h-5" />, title: 'Cloud sync', desc: 'Sync your workspace configurations across machines.', status: 'Coming later' },
            { icon: <Command className="w-5 h-5" />, title: 'Integrations', desc: 'Connect GitHub, Jira, and other developer tools.', status: 'Coming later' },
            { icon: <Smartphone className="w-5 h-5" />, title: 'Browser companion', desc: 'Check projects and control workflows remotely.', status: 'Coming later' },
            { icon: <Terminal className="w-5 h-5" />, title: 'Execution history', desc: 'Full observability of all agent actions and decisions.' },
            { icon: <Users className="w-5 h-5" />, title: 'Team collaboration', desc: 'Share agent templates and approved workflows.', status: 'Coming later' },
            { icon: <Lock className="w-5 h-5" />, title: 'Advanced approvals', desc: 'Granular controls for agent commands and file access.' }
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: (idx % 3) * 0.1, duration: 0.5 }}
              className="p-6 border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] rounded-xl hover:bg-[var(--color-ad-surface-hover)] transition-all group flex flex-col relative"
            >
              {item.status && (
                <span className="absolute top-4 right-4 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[var(--color-ad-bg)] border border-[var(--color-ad-border)] text-[var(--color-ad-text-muted)]">
                  {item.status}
                </span>
              )}
              <div className="w-10 h-10 rounded-lg bg-[var(--color-ad-bg)] border border-[var(--color-ad-border)] flex items-center justify-center mb-4 text-[var(--color-accent-amber)] group-hover:border-[var(--color-accent-amber)] transition-colors">
                {item.icon}
              </div>
              <h3 className="text-lg text-white font-bold mb-2 group-hover:text-[var(--color-accent-amber)] transition-colors">{item.title}</h3>
              <p className="text-sm text-[var(--color-ad-text-muted)] leading-relaxed flex-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Local and Cloud Architecture */}
      <section className="container mx-auto px-6 max-w-4xl">
        <div className="p-8 md:p-12 border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent-amber-soft)] blur-[80px] rounded-full pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Local power, cloud flexibility</h2>
            <p className="text-[var(--color-ad-text-muted)] mb-8 max-w-2xl text-lg leading-relaxed">
              AgentDock Pro is not a cloud-only pivot. It enhances your local setup with optional services.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-white font-semibold">
                  <Terminal className="w-5 h-5 text-[var(--color-accent-purple)]" /> Desktop App
                </div>
                <p className="text-sm text-[var(--color-ad-text-muted)]">The complete experience with local agents and local project files where supported.</p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-white font-semibold">
                  <Cloud className="w-5 h-5 text-[var(--color-accent-blue)]" /> Optional Cloud
                </div>
                <p className="text-sm text-[var(--color-ad-text-muted)]">AgentDock cloud services for remote execution, sync, access, and collaboration.</p>
              </div>
              <div className="flex flex-col gap-3 md:col-span-2">
                <div className="flex items-center gap-3 text-white font-semibold">
                  <Smartphone className="w-5 h-5 text-[var(--color-accent-amber)]" /> Web Companion
                </div>
                <p className="text-sm text-[var(--color-ad-text-muted)]">A lightweight companion app for checking projects and controlling supported workflows remotely—not a replacement for the desktop app.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="container mx-auto px-6 max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Built for professionals</h2>
        <p className="text-lg text-[var(--color-ad-text-muted)] leading-relaxed">
          AgentDock Pro is designed for developers, technical founders, software teams, agencies, and people who already manage multiple coding-agent subscriptions and need a unified way to harness them all.
        </p>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="container mx-auto px-6 max-w-4xl text-center scroll-mt-24">
        <h2 className="text-3xl font-bold text-white mb-4">Join the AgentDock Pro Waitlist</h2>
        <p className="text-[var(--color-ad-text-muted)] mb-10 max-w-xl mx-auto">
          Be among the first to experience multi-agent orchestration. Pricing and availability will be announced later.
        </p>
        <WaitlistForm source="agentdock-pro-page" />
        <p className="text-xs text-[var(--color-ad-text-muted)] mt-6">
          We will only email you regarding AgentDock updates. Your data is secure and never sold.
        </p>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 max-w-3xl pb-16">
        <h2 className="text-3xl font-bold text-white mb-10 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            { q: 'Is AgentDock Pro a separate application?', a: 'No. AgentDock Pro is a premium tier unlocked within the core AgentDock desktop application.' },
            { q: 'Is AIgency a separate product?', a: 'AIgency is a major new mode within AgentDock Pro that focuses on multi-agent orchestration.' },
            { q: 'Will AgentDock Pro require cloud execution?', a: 'No. The desktop app remains local-first, but Pro unlocks optional cloud services for syncing and remote execution.' },
            { q: 'Which agents will it support?', a: 'Initially Claude Code, OpenAI Codex, and Google Antigravity, with more models and agents planned.' },
            { q: 'Will existing AgentDock users need to reinstall?', a: 'No, existing users will be able to upgrade seamlessly within the app.' },
            { q: 'When will it launch?', a: 'We are currently in active development. Pricing and a firm launch date will be announced later.' },
            { q: 'How will pricing work?', a: 'Pricing details will be revealed closer to launch, but it will be structured to accommodate individual professionals and teams.' }
          ].map((faq, i) => (
            <div key={i} className="border-b border-[var(--color-ad-border)] pb-6 last:border-b-0">
              <h4 className="text-lg font-bold text-white mb-2">{faq.q}</h4>
              <p className="text-[var(--color-ad-text-muted)]">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

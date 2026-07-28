import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ArrowDown, Users, CheckCircle, Network, Lock, ListChecks, ArrowUpRight, Check, X, Clock, Workflow } from 'lucide-react';
import { motion } from 'motion/react';
import { WaitlistForm } from '../components/WaitlistForm';

export function Pro() {
  useEffect(() => {
    document.title = "AgentDock Pro — Multi-Agent Orchestration";
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-24 overflow-hidden">
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-24 pb-8 text-center max-w-4xl flex flex-col items-center relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm font-semibold text-[var(--color-accent-amber)] bg-[var(--color-accent-amber-soft)] border border-[var(--color-accent-amber-border)] rounded-full tracking-wide">
            AgentDock Pro
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Multiple specialised agents.<br/>
            One coordinated project.
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-ad-text-muted)] mb-10 max-w-2xl leading-relaxed mx-auto">
            AgentDock Pro upgrades the AgentDock desktop experience with AIgency multi-agent orchestration, advanced controls and optional connected services.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 w-full md:w-auto">
            <a href="#waitlist" className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-black bg-white rounded-md hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
              Join the Pro Waitlist
            </a>
            
            <a href="#aigency" className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-[var(--color-ad-surface)] rounded-md border border-[var(--color-ad-border)] hover:bg-[var(--color-ad-surface-hover)] transition-all flex items-center justify-center gap-2">
              See how AIgency works <ArrowDown className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* Product Relationship */}
      <section className="container mx-auto px-6 max-w-3xl text-center py-8">
        <div className="flex flex-col items-center gap-4 text-sm font-medium">
          <div className="px-6 py-3 bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-lg text-white w-full max-w-xs shadow-sm">
            AgentDock desktop app
          </div>
          <ArrowDown className="w-5 h-5 text-[var(--color-ad-text-muted)]" />
          <div className="px-6 py-3 bg-[var(--color-accent-amber-soft)] border border-[var(--color-accent-amber-border)] rounded-lg text-[var(--color-accent-amber)] w-full max-w-xs shadow-sm">
            AgentDock Pro upgrade
          </div>
          <ArrowDown className="w-5 h-5 text-[var(--color-ad-text-muted)]" />
          <div className="px-6 py-3 bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-lg text-white w-full max-w-sm shadow-sm flex flex-col gap-1">
            <span>AIgency</span>
            <span className="text-[var(--color-ad-text-muted)] text-xs">+ advanced controls + connected services</span>
          </div>
        </div>
        <div className="mt-8 text-[var(--color-ad-text-muted)] leading-relaxed">
          <strong>AgentDock Pro is not a separate application.</strong> AIgency is a mode inside Pro. The desktop app remains the primary experience.
        </div>
      </section>

      {/* Three Pillars */}
      <section className="container mx-auto px-6 max-w-5xl py-12">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="flex flex-col gap-4 p-6 bg-[var(--color-ad-surface)] border border-[var(--color-accent-amber-border)] rounded-xl relative">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Workflow className="w-5 h-5 text-[var(--color-accent-amber)]" /> AIgency orchestration
            </h3>
            <ul className="text-sm text-[var(--color-ad-text-muted)] space-y-2">
              <li>• Multiple specialised agents</li>
              <li>• Task planning and delegation</li>
              <li>• Parallel or sequential execution</li>
              <li>• Agent-to-agent handoffs</li>
              <li>• Review and conflict resolution</li>
              <li>• Unified project history</li>
            </ul>
          </div>
          <div className="flex flex-col gap-4 p-6 bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-xl relative">
            <span className="absolute top-4 right-4 text-[10px] uppercase font-semibold text-[var(--color-ad-text-muted)] bg-[var(--color-ad-bg)] px-2 py-1 rounded">Planned</span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-400" /> Connected development
            </h3>
            <ul className="text-sm text-[var(--color-ad-text-muted)] space-y-2">
              <li>• Remote environments</li>
              <li>• Cloud sync</li>
              <li>• Browser companion</li>
              <li>• Developer-tool integrations</li>
            </ul>
          </div>
          <div className="flex flex-col gap-4 p-6 bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-xl relative">
             <span className="absolute top-4 right-4 text-[10px] uppercase font-semibold text-[var(--color-ad-text-muted)] bg-[var(--color-ad-bg)] px-2 py-1 rounded">Planned</span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-400" /> Advanced control
            </h3>
            <ul className="text-sm text-[var(--color-ad-text-muted)] space-y-2">
              <li>• Granular approvals</li>
              <li>• Execution history</li>
              <li>• Usage-aware routing</li>
              <li>• Team workflows & shared configs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* AIgency Workflow */}
      <section id="aigency" className="container mx-auto px-6 max-w-5xl py-12 scroll-mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">How AIgency works</h2>
          <p className="text-[var(--color-ad-text-muted)] max-w-2xl mx-auto">
            AIgency divides a complex goal into smaller tasks, assigning them to the most suitable coding agent.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] flex items-center justify-center text-white font-bold shrink-0">1</div>
              <div>
                <h4 className="font-bold text-white">User submits a goal</h4>
                <p className="text-sm text-[var(--color-ad-text-muted)]">You provide the overarching objective for the project.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] flex items-center justify-center text-white font-bold shrink-0">2</div>
              <div>
                <h4 className="font-bold text-white">Work is divided into tasks</h4>
                <p className="text-sm text-[var(--color-ad-text-muted)]">AIgency creates a plan of smaller, actionable items.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] flex items-center justify-center text-white font-bold shrink-0">3</div>
              <div>
                <h4 className="font-bold text-white">Tasks assigned to suitable agents</h4>
                <p className="text-sm text-[var(--color-ad-text-muted)]">Each task is routed to the best model for the job.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] flex items-center justify-center text-white font-bold shrink-0">4</div>
              <div>
                <h4 className="font-bold text-white">Agents work separately</h4>
                <p className="text-sm text-[var(--color-ad-text-muted)]">Tasks run sequentially or concurrently in isolated contexts.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] flex items-center justify-center text-white font-bold shrink-0">5</div>
              <div>
                <h4 className="font-bold text-white">Review and resolve conflicts</h4>
                <p className="text-sm text-[var(--color-ad-text-muted)]">AIgency automatically validates outputs and flags conflicts.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] flex items-center justify-center text-white font-bold shrink-0">6</div>
              <div>
                <h4 className="font-bold text-white">Approve and merge</h4>
                <p className="text-sm text-[var(--color-ad-text-muted)]">You review the final changes and approve them into the project.</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-xl p-6 shadow-lg">
            <h4 className="text-sm font-bold text-[var(--color-ad-text-muted)] uppercase tracking-wider mb-6">Example Execution</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[var(--color-ad-bg)] border border-[var(--color-ad-border)] rounded-lg">
                <img src="/claude-icon.svg" alt="Claude" className="w-6 h-6" />
                <div className="flex-1">
                  <h5 className="font-bold text-white text-sm">Claude Code</h5>
                  <p className="text-xs text-[var(--color-ad-text-muted)]">Handles architecture and core planning.</p>
                </div>
              </div>
              <div className="flex justify-center -my-2"><ArrowDown className="w-4 h-4 text-[var(--color-ad-text-muted)] relative z-10 bg-[var(--color-ad-surface)]" /></div>
              <div className="flex items-center gap-4 p-4 bg-[var(--color-ad-bg)] border border-[var(--color-ad-border)] rounded-lg">
                <img src="/openai-icon.svg" alt="OpenAI" className="w-6 h-6 invert" />
                <div className="flex-1">
                  <h5 className="font-bold text-white text-sm">OpenAI Codex</h5>
                  <p className="text-xs text-[var(--color-ad-text-muted)]">Implements and reviews backend systems.</p>
                </div>
              </div>
              <div className="flex justify-center -my-2"><ArrowDown className="w-4 h-4 text-[var(--color-ad-text-muted)] relative z-10 bg-[var(--color-ad-surface)]" /></div>
              <div className="flex items-center gap-4 p-4 bg-[var(--color-ad-bg)] border border-[var(--color-ad-border)] rounded-lg">
                <img src="/gemini-icon.svg" alt="Antigravity" className="w-6 h-6" />
                <div className="flex-1">
                  <h5 className="font-bold text-white text-sm">Google Antigravity</h5>
                  <p className="text-xs text-[var(--color-ad-text-muted)]">Validates UI, researches solutions, or writes tests.</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link to="/docs/aigency-architecture" className="text-sm text-[var(--color-accent-blue)] hover:underline inline-flex items-center gap-1">
                Read technical architecture <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="container mx-auto px-6 max-w-4xl py-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">AgentDock vs Pro</h2>
        <div className="overflow-x-auto rounded-xl border border-[var(--color-ad-border)]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[var(--color-ad-surface)] border-b border-[var(--color-ad-border)] text-white">
              <tr>
                <th className="p-4 font-bold">Feature</th>
                <th className="p-4 font-bold text-center">AgentDock</th>
                <th className="p-4 font-bold text-center text-[var(--color-accent-amber)]">AgentDock Pro</th>
              </tr>
            </thead>
            <tbody className="bg-[var(--color-ad-bg)] divide-y divide-[var(--color-ad-border)] text-[var(--color-ad-text-muted)]">
              {[
                { name: 'Unified agent interface', free: true, pro: 'Available' },
                { name: 'Local project support', free: true, pro: 'Available' },
                { name: 'Model and permission controls', free: true, pro: 'Available' },
                { name: 'Separate agent sessions', free: true, pro: 'Available' },
                { name: 'AIgency orchestration', free: false, pro: 'Planned' },
                { name: 'Multi-agent task delegation', free: false, pro: 'Planned' },
                { name: 'Managed handoffs', free: false, pro: 'Planned' },
                { name: 'Advanced execution history', free: false, pro: 'Planned' },
                { name: 'Cloud sync', free: false, pro: 'Future' },
                { name: 'Remote access', free: false, pro: 'Future' },
                { name: 'Browser companion', free: false, pro: 'Future' },
                { name: 'Team features', free: false, pro: 'Future' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[var(--color-ad-surface-hover)] transition-colors">
                  <td className="p-4 text-white">{row.name}</td>
                  <td className="p-4 text-center">
                    {row.free ? <Check className="w-4 h-4 mx-auto text-[var(--color-accent-green)]" /> : <X className="w-4 h-4 mx-auto text-gray-600" />}
                  </td>
                  <td className="p-4 text-center font-medium">
                    {row.pro === 'Available' ? <Check className="w-4 h-4 mx-auto text-[var(--color-accent-amber)]" /> : 
                     row.pro === 'Planned' ? <span className="text-blue-400 text-xs uppercase font-bold">Planned</span> :
                     <span className="text-gray-500 text-xs uppercase font-bold">Future</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Roadmap */}
      <section className="container mx-auto px-6 max-w-4xl py-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Roadmap</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-xl relative">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Clock className="w-4 h-4 text-white" /> Initial Pro release</h3>
            <p className="text-sm text-[var(--color-ad-text-muted)]">Focus on the AIgency foundation, multi-agent orchestration, and task handoffs.</p>
          </div>
          <div className="p-6 bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-xl relative opacity-80">
            <h3 className="font-bold text-white mb-2">Next</h3>
            <p className="text-sm text-[var(--color-ad-text-muted)]">Connected services, remote environments, and workflow expansion.</p>
          </div>
          <div className="p-6 bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-xl relative opacity-60">
            <h3 className="font-bold text-white mb-2">Later</h3>
            <p className="text-sm text-[var(--color-ad-text-muted)]">Teams, broader integrations, and more advanced cloud capabilities.</p>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="container mx-auto px-6 max-w-3xl text-center py-12 scroll-mt-24">
        <div className="p-8 border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">Join the AgentDock Pro Waitlist</h2>
          <p className="text-[var(--color-ad-text-muted)] mb-8 max-w-xl mx-auto text-sm leading-relaxed">
            Be among the first to experience multi-agent orchestration. Pricing and availability will be announced later.
          </p>
          <WaitlistForm source="agentdock-pro-page" />
        </div>
      </section>

    </div>
  );
}

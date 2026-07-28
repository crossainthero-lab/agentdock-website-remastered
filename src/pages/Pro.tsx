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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[var(--color-accent-amber)]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm font-semibold text-[var(--color-accent-amber)] bg-[var(--color-accent-amber-soft)] border border-[var(--color-accent-amber-border)] rounded-full tracking-wide uppercase">
            In Development
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Build software with an entire<br/>AI engineering team.
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-ad-text-muted)] mb-6 max-w-2xl leading-relaxed mx-auto">
            AgentDock Pro is a separate premium application that coordinates specialised AI agents across planning, implementation, debugging, testing, review, research, documentation, and delivery.
          </p>
          <div className="text-sm font-medium text-white mb-10">
            Expected price: <span className="text-[var(--color-accent-amber)]">$59.99/month</span>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 w-full md:w-auto">
            <a href="#waitlist" className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-black bg-white rounded-md hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
              Join the Waitlist
            </a>
            
            <Link to="/pro/aigency/technical" className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-[var(--color-ad-surface)] rounded-md border border-[var(--color-ad-border)] hover:bg-[var(--color-ad-surface-hover)] transition-all flex items-center justify-center gap-2">
              View AIgency Architecture
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Difference Clearly */}
      <section className="container mx-auto px-6 max-w-4xl py-12">
        <div className="bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-xl p-8 shadow-lg text-center md:text-left flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold text-white">What is AgentDock Pro?</h2>
            <p className="text-sm text-[var(--color-ad-text-muted)] leading-relaxed">
              <strong>AgentDock Pro is a separate premium application.</strong> It is not a mode or tab inside standard AgentDock. It includes <strong>AIgency</strong> as one of its major features to orchestrate multiple specialised agents for complex software development.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="container mx-auto px-6 max-w-4xl py-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">AgentDock vs AgentDock Pro</h2>
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
                { name: 'Standard desktop application', free: true, pro: false },
                { name: 'Separate premium application', free: false, pro: true },
                { name: 'Direct conversations with individual coding agents', free: true, pro: true },
                { name: 'Unified interface for supported CLIs', free: true, pro: true },
                { name: 'Projects, sessions, models, terminal, Git', free: true, pro: true },
                { name: 'Includes AIgency', free: false, pro: true },
                { name: 'Coordinates multiple specialised agents', free: false, pro: 'Planned' },
                { name: 'Advanced task planning and dependency management', free: false, pro: 'Planned' },
                { name: 'Persistent project intelligence', free: false, pro: 'Planned' },
                { name: 'Cloud and remote execution capabilities', free: false, pro: 'Planned' },
                { name: 'Advanced integrations', free: false, pro: 'Planned' },
                { name: 'Professional workflow controls', free: false, pro: 'Future' },
                { name: 'Team and organisation capabilities', free: false, pro: 'Future' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[var(--color-ad-surface-hover)] transition-colors">
                  <td className="p-4 text-white">{row.name}</td>
                  <td className="p-4 text-center">
                    {row.free ? <Check className="w-4 h-4 mx-auto text-[var(--color-accent-green)]" /> : <X className="w-4 h-4 mx-auto text-gray-600" />}
                  </td>
                  <td className="p-4 text-center font-medium">
                    {row.pro === true ? <Check className="w-4 h-4 mx-auto text-[var(--color-accent-amber)]" /> : 
                     row.pro === 'Planned' ? <span className="text-blue-400 text-xs uppercase font-bold">Planned</span> :
                     row.pro === 'Future' ? <span className="text-gray-500 text-xs uppercase font-bold">Future</span> :
                     <X className="w-4 h-4 mx-auto text-gray-600" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="container mx-auto px-6 max-w-5xl py-12">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Pro Capabilities</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-xl p-8">
            <h3 className="text-xl font-bold text-white mb-4">AIgency orchestration</h3>
            <p className="text-sm text-[var(--color-ad-text-muted)] leading-relaxed mb-4">
              AIgency divides a project into smaller tasks and assigns those tasks to different agents according to their strengths. Workflows run where agents perform different responsibilities rather than all agents repeating the same task.
            </p>
            <ul className="text-sm text-[var(--color-ad-text-muted)] space-y-2">
              <li>• Claude handles architecture and broad implementation</li>
              <li>• Codex handles backend logic, debugging, or targeted fixes</li>
              <li>• Gemini or Antigravity handles research, analysis, or visual inspection</li>
              <li>• Dedicated agents perform tests, reviews, documentation, and release checks</li>
            </ul>
          </div>

          <div className="bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-xl p-8">
            <h3 className="text-xl font-bold text-white mb-4">Specialised agent roles</h3>
            <p className="text-sm text-[var(--color-ad-text-muted)] leading-relaxed mb-4">
              AgentDock Pro supports configuring agents with highly specific roles that align with your development lifecycle.
            </p>
            <ul className="text-sm text-[var(--color-ad-text-muted)] grid grid-cols-2 gap-2">
              <li>• Planner</li>
              <li>• Architect</li>
              <li>• Frontend developer</li>
              <li>• Backend developer</li>
              <li>• Debugger</li>
              <li>• Tester</li>
              <li>• Code reviewer</li>
              <li>• Security reviewer</li>
              <li>• Researcher</li>
              <li>• Release manager</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-3">Task graph and dependencies</h3>
            <p className="text-sm text-[var(--color-ad-text-muted)] leading-relaxed">
              AgentDock Pro can represent work as connected tasks with dependencies, status, ownership, blockers, outputs, and handoffs. Agents understand what must be completed before they can begin.
            </p>
          </div>
          
          <div className="bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-3">Shared project context</h3>
            <p className="text-sm text-[var(--color-ad-text-muted)] leading-relaxed">
              Persistent knowledge about repository structure, decisions, requirements, previous runs, generated artifacts, tests, known issues, user approvals, and project conventions across all agents.
            </p>
          </div>

          <div className="bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-3">Human oversight</h3>
            <p className="text-sm text-[var(--color-ad-text-muted)] leading-relaxed">
              You remain in control through approval checkpoints, permission boundaries, run pausing, agent reassignment, task cancellation, artifact review, Git diff review, and cost visibility.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-3">Cloud and remote capabilities</h3>
            <p className="text-sm text-[var(--color-ad-text-muted)] leading-relaxed">
              The full desktop application remains the primary experience. The Pro subscription can include cloud services, remote environments, synchronisation, integrations, and lightweight browser access.
            </p>
          </div>
          
          <div className="bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-3">Integrations</h3>
            <p className="text-sm text-[var(--color-ad-text-muted)] leading-relaxed">
              Current and planned integrations for GitHub, Git providers, Cloudflare, deployment platforms, remote development environments, issue trackers, documentation systems, and model providers.
            </p>
          </div>

          <div className="bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-3">Professional controls</h3>
            <p className="text-sm text-[var(--color-ad-text-muted)] leading-relaxed">
              Future capabilities such as usage controls, run budgets, model selection policies, agent permissions, audit history, organisation workspaces, shared project access, team roles, and secure secrets handling.
            </p>
          </div>
        </div>
      </section>

      {/* From the Blog */}
      <section className="container mx-auto px-6 max-w-5xl py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Building AgentDock Pro</h2>
          <Link to="/blog" className="text-sm font-medium text-[var(--color-accent-purple)] hover:text-[var(--color-accent-purple-hover)] flex items-center gap-1">
            View all articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/blog/building-aigency" className="block p-6 rounded-xl border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] hover:border-[var(--color-accent-purple)] transition-colors group">
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--color-accent-purple)] transition-colors">Building AIgency</h3>
            <p className="text-sm text-[var(--color-ad-text-muted)] mb-4">How we're designing an orchestration engine for multiple coding agents.</p>
            <div className="text-xs font-medium text-[var(--color-ad-text-muted)]">Building AgentDock Pro</div>
          </Link>
          <Link to="/blog/remote-environments-future" className="block p-6 rounded-xl border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] hover:border-[var(--color-accent-purple)] transition-colors group">
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--color-accent-purple)] transition-colors">Remote Environments and the Future of AgentDock Pro</h3>
            <p className="text-sm text-[var(--color-ad-text-muted)] mb-4">Why offloading complex task execution to the cloud matters for serious development.</p>
            <div className="text-xs font-medium text-[var(--color-ad-text-muted)]">Engineering Notes</div>
          </Link>
        </div>
      </section>

      {/* AIgency Architecture CTA */}
      <section className="container mx-auto px-6 max-w-3xl text-center py-12">
        <div className="p-12 border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] rounded-2xl flex flex-col items-center">
          <Workflow className="w-12 h-12 text-white mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">AIgency Technical Architecture</h2>
          <p className="text-[var(--color-ad-text-muted)] mb-8 text-sm leading-relaxed max-w-lg">
            Dive into the system overview, orchestrator responsibilities, task graph resolution, workspace isolation, and event streaming underpinning AIgency.
          </p>
          <Link to="/pro/aigency/technical" className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-md hover:bg-[var(--color-ad-surface-hover)] transition-all">
            View AIgency Technical Architecture
          </Link>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="container mx-auto px-6 max-w-3xl text-center py-12 scroll-mt-24">
        <div className="p-12 border border-[var(--color-accent-amber-border)] bg-gradient-to-b from-[var(--color-ad-surface)] to-[#1a150a] rounded-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">Join the AgentDock Pro Waitlist</h2>
          <p className="text-[var(--color-ad-text-muted)] mb-4 text-sm leading-relaxed">
            Expected launch price: <span className="text-[var(--color-accent-amber)] font-bold">$59.99/month</span>
          </p>
          <p className="text-[var(--color-ad-text-muted)] mb-8 max-w-xl mx-auto text-xs leading-relaxed opacity-80">
            Final pricing and inclusions may change before release.
          </p>
          <WaitlistForm source="agentdock-pro-page" />
        </div>
      </section>

    </div>
  );
}

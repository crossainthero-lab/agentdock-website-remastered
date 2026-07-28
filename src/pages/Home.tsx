import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Layers, Shield, Cpu, RefreshCw, GitBranch } from 'lucide-react';
import { SectionHeading, FeatureCard, ProductScreenshotFrame, CallToAction } from '../components/ui';

export function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--color-accent-purple-soft)] via-transparent to-transparent pointer-events-none"></div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
            >
              One workspace for your AI coding agents.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-[var(--color-ad-text-muted)] mb-10 leading-relaxed"
            >
              AgentDock brings tools such as Claude Code, Codex, and Antigravity into one organised desktop workspace for projects, conversations, permissions, diagnostics, and agent workflows.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a href="/downloads" className="px-8 py-3.5 text-sm font-bold text-white bg-[var(--color-accent-purple)] rounded-md hover:bg-[var(--color-accent-purple-hover)] hover:shadow-[0_0_20px_var(--color-accent-purple-glow)] transition-all">
                Download AgentDock
              </a>
              <a href="https://github.com/crossainthero-lab/AgentDock" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 text-sm font-bold text-white bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-md hover:bg-[var(--color-ad-surface-hover)] transition-all">
                View on GitHub
              </a>
              <a href="/pro" className="px-8 py-3.5 text-sm font-bold text-[var(--color-accent-purple)] bg-[var(--color-accent-purple-soft)] border border-[var(--color-accent-purple-border)] rounded-md hover:bg-[var(--color-accent-purple)] hover:text-white transition-all">
                Explore AgentDock Pro
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <ProductScreenshotFrame alt="AgentDock Standard Desktop Workspace Interface" />
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-6 border-t border-[var(--color-ad-border)] bg-[var(--color-ad-surface)]/30">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeading 
                title="The fragmentation problem." 
                subtitle="AI coding tools are incredibly powerful, but they are spread across separate terminals, applications, and browser windows." 
              />
              <ul className="space-y-4">
                {[
                  "Projects and conversations become fragmented.",
                  "Each agent CLI behaves differently.",
                  "Switching agents interrupts your development flow.",
                  "Raw terminal output can be difficult to follow.",
                  "Permissions, sessions, models, and diagnostics are managed inconsistently."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-[var(--color-accent-amber-soft)] text-[var(--color-accent-amber)] flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <span className="text-[var(--color-ad-text-muted)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 rounded-2xl border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <h3 className="text-xl font-bold text-white mb-4 relative z-10">The Solution</h3>
              <p className="text-[var(--color-ad-text-muted)] mb-6 relative z-10">
                Developers need one organised layer without abandoning their preferred underlying tools. AgentDock sits above supported local agent tools and presents them through one consistent workspace.
              </p>
              
              {/* CSS Diagram */}
              <div className="flex flex-col items-center gap-2 relative z-10 p-6 bg-[var(--color-ad-bg)] rounded-xl border border-[var(--color-ad-border)]">
                <div className="px-4 py-2 bg-[var(--color-ad-surface-hover)] border border-[var(--color-ad-border)] rounded-md text-sm font-medium text-white w-full text-center">Developer</div>
                <div className="h-4 w-px bg-[var(--color-ad-border)]"></div>
                <div className="px-4 py-3 bg-[var(--color-accent-purple-soft)] border border-[var(--color-accent-purple-border)] rounded-md text-sm font-bold text-[var(--color-accent-purple)] w-full text-center shadow-[0_0_15px_var(--color-accent-purple-glow)]">AgentDock Workspace</div>
                <div className="h-4 w-px bg-[var(--color-ad-border)]"></div>
                <div className="flex gap-2 w-full">
                  <div className="px-2 py-2 bg-[var(--color-ad-surface-hover)] border border-[var(--color-ad-border)] rounded-md text-xs font-medium text-[var(--color-ad-text-muted)] flex-1 text-center">Claude Code</div>
                  <div className="px-2 py-2 bg-[var(--color-ad-surface-hover)] border border-[var(--color-ad-border)] rounded-md text-xs font-medium text-[var(--color-ad-text-muted)] flex-1 text-center">Antigravity</div>
                  <div className="px-2 py-2 bg-[var(--color-ad-surface-hover)] border border-[var(--color-ad-border)] rounded-md text-xs font-medium text-[var(--color-ad-text-muted)] flex-1 text-center">Codex</div>
                </div>
                <div className="h-4 w-px bg-[var(--color-ad-border)]"></div>
                <div className="px-4 py-2 bg-[var(--color-ad-surface-hover)] border border-[var(--color-ad-border)] rounded-md text-sm font-medium text-[var(--color-accent-green)] border-b-2 border-b-[var(--color-accent-green)] w-full text-center">Local Repository & Environment</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 px-6 border-t border-[var(--color-ad-border)]">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading 
            title="Desktop capabilities." 
            subtitle="AgentDock is a desktop application, not a generic web chatbot or a replacement IDE. It focuses purely on managing AI agents on your machine." 
            className="text-center mx-auto"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            <FeatureCard 
              icon={<Layers />}
              title="Unified workspace"
              description="Manage multiple projects and agent sessions from one clean interface instead of losing track of separate terminal windows."
              badge="Available now"
              delay={0}
            />
            <FeatureCard 
              icon={<Terminal />}
              title="Clean conversations"
              description="Translates raw terminal output into readable, interactive conversations while preserving all context and code blocks."
              badge="Available now"
              delay={0.1}
            />
            <FeatureCard 
              icon={<Shield />}
              title="Permission handling"
              description="Centralises terminal permission requests and file access approvals so you remain in control of your local environment."
              badge="Available now"
              delay={0.2}
            />
            <FeatureCard 
              icon={<RefreshCw />}
              title="Agent handoffs"
              description="Start a task with a fast agent, then seamlessly hand the context over to a more capable reasoning agent to finish the complex parts."
              badge="Preview"
              delay={0.3}
            />
            <FeatureCard 
              icon={<Cpu />}
              title="CLI diagnostics"
              description="Automatically detects installed agent CLIs on your system and provides diagnostic tooling to ensure they are configured correctly."
              badge="Available now"
              delay={0.4}
            />
            <FeatureCard 
              icon={<GitBranch />}
              title="Git awareness"
              description="Understands your local git repositories and worktrees, allowing agents to operate within the correct branch context."
              badge="Preview"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-[var(--color-ad-border)] bg-[var(--color-ad-surface)]/30">
        <div className="container mx-auto max-w-4xl">
          <SectionHeading title="How AgentDock works." className="text-center" />
          <div className="mt-16 relative">
            <div className="absolute left-[27px] top-4 bottom-4 w-px bg-[var(--color-ad-border)] hidden md:block"></div>
            <div className="space-y-12">
              {[
                { step: 1, title: "Install AgentDock", desc: "Download and install the desktop application for macOS, Windows, or Linux." },
                { step: 2, title: "Connect agents", desc: "Install a supported AI coding-agent CLI (like Claude Code or Antigravity) and ensure it is on your PATH." },
                { step: 3, title: "Open a project", desc: "Point AgentDock to your local repository directory to initialise a workspace." },
                { step: 4, title: "Choose your agent", desc: "Select which installed agent you want to handle the current task." },
                { step: 5, title: "Work seamlessly", desc: "Provide instructions and watch the agent execute commands and write code in an organised UI." },
                { step: 6, title: "Switch when needed", desc: "Easily switch agents mid-session to hand off the context to a different model." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-6 relative z-10">
                  <div className="w-14 h-14 rounded-full bg-[var(--color-ad-bg)] border-2 border-[var(--color-accent-purple-border)] flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-[0_0_15px_var(--color-accent-purple-glow)]">
                    {item.step}
                  </div>
                  <div className="pt-3">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-[var(--color-ad-text-muted)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 p-6 rounded-xl bg-[var(--color-ad-surface-hover)] border border-[var(--color-ad-border)] text-sm text-[var(--color-ad-text-muted)]">
            <strong>Note:</strong> AgentDock is a workspace interface. You may require your own subscriptions, API keys, or access for the underlying AI services (Claude, OpenAI, Google) depending on the CLI tools you choose to connect.
          </div>
        </div>
      </section>

      {/* Pro Preview */}
      <section className="py-24 px-6 border-t border-[var(--color-ad-border)]">
        <div className="container mx-auto max-w-5xl">
          <div className="p-12 rounded-3xl border border-[var(--color-accent-purple-border)] bg-gradient-to-br from-[var(--color-accent-purple-soft)] to-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent-purple)] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
            <div className="max-w-2xl relative z-10">
              <span className="inline-block px-3 py-1 bg-[var(--color-accent-purple)] text-white text-xs font-bold rounded-full mb-6 tracking-widest uppercase">In Development</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">AgentDock Pro & AIgency</h2>
              <p className="text-xl text-[var(--color-ad-text-muted)] mb-8">
                AgentDock Pro expands the original concept into a premium multi-agent development system. It introduces AIgency—allowing you to coordinate multiple specialised agents to tackle complex workflows, alongside cloud-supported sync and remote environments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/pro" className="px-6 py-3 text-sm font-bold text-white bg-[var(--color-accent-purple)] rounded-md hover:bg-[var(--color-accent-purple-hover)] hover:shadow-[0_0_20px_var(--color-accent-purple-glow)] transition-all text-center">
                  Explore AgentDock Pro
                </a>
                <a href="/waitlist" className="px-6 py-3 text-sm font-bold text-white bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-md hover:bg-[var(--color-ad-surface-hover)] transition-all text-center">
                  Join the waitlist
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 px-6 border-t border-[var(--color-ad-border)]">
        <div className="container mx-auto max-w-5xl">
          <CallToAction 
            title="Start building with AgentDock." 
            description="Download the free desktop workspace today and bring order to your local AI coding agents."
            primaryText="Download AgentDock"
            primaryTo="/downloads"
            secondaryText="View on GitHub"
            secondaryTo="https://github.com/crossainthero-lab/AgentDock"
          />
        </div>
      </section>
    </div>
  );
}

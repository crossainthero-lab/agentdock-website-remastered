import React from 'react';
import { motion } from 'motion/react';
import { Network, Server, Cloud, Shield, CheckCircle, RefreshCw, Workflow, Layers, GitBranch, Terminal } from 'lucide-react';
import { SectionHeading, FeatureCard, ProductScreenshotFrame, StatusBadge, CallToAction } from '../components/ui';

export function Pro() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-[var(--color-ad-surface)] border-b border-[var(--color-ad-border)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--color-accent-blue-soft)] via-transparent to-transparent pointer-events-none"></div>
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <span className="inline-block px-3 py-1 bg-[var(--color-accent-blue-soft)] border border-[var(--color-accent-blue-border)] text-[var(--color-accent-blue)] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">Premium Edition (In Development)</span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight max-w-4xl mx-auto">
            Turn individual AI agents into a coordinated development system.
          </h1>
          <p className="text-xl text-[var(--color-ad-text-muted)] mb-10 leading-relaxed max-w-3xl mx-auto">
            AgentDock Pro is the premium application for managing specialised agents, complex workflows, shared project context, approvals, handoffs, remote environments, and AIgency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href="/waitlist" className="px-8 py-3.5 text-sm font-bold text-white bg-[var(--color-accent-purple)] rounded-md hover:bg-[var(--color-accent-purple-hover)] hover:shadow-[0_0_20px_var(--color-accent-purple-glow)] transition-all">
              Join the waitlist
            </a>
            <a href="#aigency" className="px-8 py-3.5 text-sm font-bold text-white bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-md hover:bg-[var(--color-ad-surface-hover)] transition-all">
              Explore AIgency
            </a>
          </div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <ProductScreenshotFrame alt="AgentDock Pro Multi-Agent Workflow Interface">
              <img src="/agdc-pro-v0.1.0.png" alt="AgentDock Pro Multi-Agent Workflow Interface" className="w-full h-full object-cover rounded-xl" />
            </ProductScreenshotFrame>
          </motion.div>
        </div>
      </section>

      {/* AgentDock vs AgentDock Pro */}
      <section className="py-24 px-6 border-b border-[var(--color-ad-border)]">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading title="The right workspace for the task." className="text-center mb-16" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)]">
              <h3 className="text-2xl font-bold text-white mb-2">AgentDock</h3>
              <p className="text-[var(--color-ad-text-muted)] mb-8">For individual developers managing single-agent sessions on local repositories.</p>
              <ul className="space-y-4">
                {[
                  "Individual agent sessions",
                  "Local projects",
                  "Unified desktop interface",
                  "Core project organisation",
                  "Permissions and diagnostics",
                  "Agent switching and handoffs",
                  "Standard local workflows"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[var(--color-accent-purple)] shrink-0" />
                    <span className="text-[var(--color-ad-text)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 rounded-2xl border border-[var(--color-accent-purple-border)] bg-gradient-to-br from-[var(--color-accent-purple-soft)] to-[var(--color-ad-surface)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent-purple)] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
              <h3 className="text-2xl font-bold text-white mb-2 relative z-10">AgentDock Pro</h3>
              <p className="text-[var(--color-ad-text-muted)] mb-8 relative z-10">For advanced coordination of multi-agent workflows and extended cloud services.</p>
              <ul className="space-y-4 relative z-10">
                {[
                  "AIgency multi-agent orchestration",
                  "Specialised agent responsibilities",
                  "Coordinated execution & workflow graphs",
                  "Shared project intelligence",
                  "Cloud-supported services & Sync",
                  "Remote environments & Integrations",
                  "Premium automation"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[var(--color-accent-purple)] shrink-0" />
                    <span className="text-[var(--color-ad-text)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AIgency Section */}
      <section id="aigency" className="py-24 px-6 border-b border-[var(--color-ad-border)] bg-[var(--color-ad-surface)]/30">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading 
            title="Introducing AIgency." 
            subtitle="AIgency is a major feature inside AgentDock Pro. Instead of making every agent attempt the entire task, AIgency coordinates multiple AI agents working on different parts of the same project based on their strengths."
          />
          <div className="grid lg:grid-cols-2 gap-16 mt-16">
            <div>
              <h3 className="text-xl font-bold text-white mb-6">The Workflow</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--color-ad-border)] before:to-transparent">
                {[
                  "Provide a project objective",
                  "AIgency analyses objective and repository",
                  "System divides objective into bounded tasks",
                  "Tasks assigned to suitable agents",
                  "Agents work sequentially or in parallel",
                  "Dependencies and blockers remain visible",
                  "Agents hand work to other agents when required",
                  "Review or verification agents inspect output",
                  "Failed work retried, corrected, or reassigned",
                  "User remains in control of approvals"
                ].map((step, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] text-[var(--color-ad-text-muted)] group-hover:border-[var(--color-accent-purple)] group-hover:text-[var(--color-accent-purple)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm transition-colors z-10 font-bold text-sm">
                      {i + 1}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)]">
                      <p className="text-sm text-[var(--color-ad-text)]">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-6">Workflow Visibility</h3>
              <p className="text-[var(--color-ad-text-muted)] mb-8">
                AgentDock Pro makes multi-agent work understandable. You can track exactly what each agent is doing, why they are doing it, and who they are waiting for.
              </p>
              
              {/* CSS Diagram of Workflow */}
              <div className="p-6 rounded-xl border border-[var(--color-ad-border)] bg-[var(--color-ad-bg)] flex flex-col gap-4">
                {/* Node 1 */}
                <div className="p-4 rounded-lg border border-[var(--color-accent-green-border)] bg-[var(--color-accent-green-soft)] flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[var(--color-accent-green)]">PLANNING AGENT</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-accent-green)]/20 text-[var(--color-accent-green)]">Completed</span>
                    </div>
                    <p className="text-sm text-white">Analyse requirements & create architecture</p>
                    <p className="text-xs text-[var(--color-ad-text-muted)] mt-1">Files: architecture.md</p>
                  </div>
                </div>
                
                {/* Connectors */}
                <div className="flex justify-around px-8 -my-2 relative z-0">
                  <div className="w-px h-8 bg-[var(--color-ad-border)]"></div>
                  <div className="w-px h-8 bg-[var(--color-ad-border)]"></div>
                </div>
                
                {/* Parallel Nodes */}
                <div className="flex gap-4 relative z-10">
                  {/* Node 2 */}
                  <div className="flex-1 p-4 rounded-lg border border-[var(--color-accent-purple-border)] bg-[var(--color-accent-purple-soft)]">
                    <div className="flex flex-col gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--color-accent-purple)]">FRONTEND AGENT</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-accent-purple)]/20 text-[var(--color-accent-purple)]">In Progress</span>
                      </div>
                      <p className="text-sm text-white">Build UI components</p>
                      <p className="text-xs text-[var(--color-ad-text-muted)] mt-1">Dependency: architecture.md</p>
                    </div>
                  </div>
                  {/* Node 3 */}
                  <div className="flex-1 p-4 rounded-lg border border-[var(--color-accent-amber-border)] bg-[var(--color-accent-amber-soft)]">
                    <div className="flex flex-col gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--color-accent-amber)]">BACKEND AGENT</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-accent-amber)]/20 text-[var(--color-accent-amber)]">Waiting</span>
                      </div>
                      <p className="text-sm text-white">Setup database schema</p>
                      <p className="text-xs text-[var(--color-accent-amber)] mt-1">Blocked by: User Approval</p>
                    </div>
                  </div>
                </div>
                
                {/* Connectors */}
                <div className="flex justify-center -my-2 relative z-0">
                  <div className="w-px h-8 bg-[var(--color-ad-border)]"></div>
                </div>
                
                {/* Node 4 */}
                <div className="p-4 rounded-lg border border-[var(--color-ad-border)] bg-[var(--color-ad-surface-hover)] flex justify-between items-center opacity-70">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[var(--color-ad-text-muted)]">REVIEW AGENT</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-ad-border)] text-[var(--color-ad-text-muted)]">Queued</span>
                    </div>
                    <p className="text-sm text-[var(--color-ad-text)]">Verify implementation & tests</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="py-24 px-6 border-b border-[var(--color-ad-border)]">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading 
            title="Technical Architecture" 
            subtitle="AgentDock Pro combines local control with powerful orchestration."
            className="text-center mb-16"
          />
          
          <div className="flex flex-col gap-6 p-8 rounded-2xl bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] max-w-4xl mx-auto">
            {/* Experience Layer */}
            <div className="p-6 rounded-xl border border-[var(--color-accent-purple-border)] bg-[var(--color-ad-bg)]">
              <div className="flex items-center justify-between mb-4 border-b border-[var(--color-ad-border)] pb-2">
                <h4 className="text-lg font-bold text-white flex items-center gap-2"><Layers className="w-5 h-5 text-[var(--color-accent-purple)]" /> Experience Layer</h4>
                <StatusBadge status="In development" />
              </div>
              <div className="flex flex-wrap gap-2">
                {["AgentDock Pro desktop app", "AIgency workspace", "Project dashboard", "Agent sessions", "Workflow graph", "Approval interface", "Lightweight browser companion"].map(i => (
                  <span key={i} className="px-3 py-1.5 text-xs font-medium bg-[var(--color-ad-surface-hover)] border border-[var(--color-ad-border)] rounded-md text-[var(--color-ad-text)]">{i}</span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center -my-3 relative z-10"><div className="w-8 h-8 rounded-full bg-[var(--color-ad-border)] flex items-center justify-center"><Network className="w-4 h-4 text-[var(--color-ad-text-muted)]" /></div></div>

            {/* Orchestration Layer */}
            <div className="p-6 rounded-xl border border-[var(--color-accent-blue-border)] bg-[var(--color-ad-bg)]">
              <div className="flex items-center justify-between mb-4 border-b border-[var(--color-ad-border)] pb-2">
                <h4 className="text-lg font-bold text-white flex items-center gap-2"><Workflow className="w-5 h-5 text-[var(--color-accent-blue)]" /> Orchestration Layer</h4>
                <StatusBadge status="Planned" />
              </div>
              <div className="flex flex-wrap gap-2">
                {["Coordinator", "Objective analysis", "Task decomposition", "Agent assignment", "Dependency management", "Scheduling", "Context routing", "Handoff management", "Retry and recovery", "Approval gates"].map(i => (
                  <span key={i} className="px-3 py-1.5 text-xs font-medium bg-[var(--color-ad-surface-hover)] border border-[var(--color-ad-border)] rounded-md text-[var(--color-ad-text)]">{i}</span>
                ))}
              </div>
            </div>

            <div className="flex justify-center -my-3 relative z-10"><div className="w-8 h-8 rounded-full bg-[var(--color-ad-border)] flex items-center justify-center"><RefreshCw className="w-4 h-4 text-[var(--color-ad-text-muted)]" /></div></div>

            {/* Middle Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Agent Runtime Layer */}
              <div className="p-6 rounded-xl border border-[var(--color-ad-border)] bg-[var(--color-ad-bg)]">
                <div className="flex items-center justify-between mb-4 border-b border-[var(--color-ad-border)] pb-2">
                  <h4 className="text-md font-bold text-white flex items-center gap-2"><Terminal className="w-4 h-4 text-[var(--color-ad-text-muted)]" /> Agent Runtime</h4>
                  <StatusBadge status="Available now" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Claude adapter", "Codex adapter", "Antigravity adapter", "CLI process management", "Session lifecycle", "Permission handling"].map(i => (
                    <span key={i} className="px-2 py-1 text-xs font-medium bg-[var(--color-ad-surface-hover)] border border-[var(--color-ad-border)] rounded-md text-[var(--color-ad-text)]">{i}</span>
                  ))}
                </div>
              </div>
              
              {/* Project Intelligence Layer */}
              <div className="p-6 rounded-xl border border-[var(--color-ad-border)] bg-[var(--color-ad-bg)]">
                <div className="flex items-center justify-between mb-4 border-b border-[var(--color-ad-border)] pb-2">
                  <h4 className="text-md font-bold text-white flex items-center gap-2"><GitBranch className="w-4 h-4 text-[var(--color-ad-text-muted)]" /> Project Intelligence</h4>
                  <StatusBadge status="In development" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Repository context", "Git state", "Worktrees", "File tracking", "Change tracking", "Shared decisions", "Logs", "Context boundaries"].map(i => (
                    <span key={i} className="px-2 py-1 text-xs font-medium bg-[var(--color-ad-surface-hover)] border border-[var(--color-ad-border)] rounded-md text-[var(--color-ad-text)]">{i}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-2 relative z-10 text-[var(--color-ad-text-muted)] text-sm font-medium">Services & Security boundary</div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* AgentDock Pro Services */}
              <div className="p-6 rounded-xl border border-[var(--color-accent-amber-border)] bg-gradient-to-b from-[var(--color-accent-amber-soft)] to-[var(--color-ad-bg)]">
                <div className="flex items-center justify-between mb-4 border-b border-[var(--color-accent-amber-border)] pb-2">
                  <h4 className="text-md font-bold text-white flex items-center gap-2"><Cloud className="w-4 h-4 text-[var(--color-accent-amber)]" /> Cloud Services</h4>
                  <StatusBadge status="Planned" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Encrypted sync", "Cloud workflows", "Remote environments", "Notifications", "Web companion", "Authentication"].map(i => (
                    <span key={i} className="px-2 py-1 text-xs font-medium bg-[var(--color-ad-surface-hover)] border border-[var(--color-accent-amber-border)] rounded-md text-[var(--color-ad-text)]">{i}</span>
                  ))}
                </div>
              </div>
              
              {/* Security and Control */}
              <div className="p-6 rounded-xl border border-[var(--color-accent-green-border)] bg-[var(--color-ad-bg)]">
                <div className="flex items-center justify-between mb-4 border-b border-[var(--color-accent-green-border)] pb-2">
                  <h4 className="text-md font-bold text-white flex items-center gap-2"><Shield className="w-4 h-4 text-[var(--color-accent-green)]" /> Security & Control</h4>
                  <StatusBadge status="In development" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Local execution default", "Explicit approvals", "Audit trails", "Secure secrets handling", "Isolated environments", "Local vs cloud boundaries"].map(i => (
                    <span key={i} className="px-2 py-1 text-xs font-medium bg-[var(--color-ad-surface-hover)] border border-[var(--color-accent-green-border)] rounded-md text-[var(--color-ad-text)]">{i}</span>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Local and Cloud Model */}
      <section className="py-24 px-6 border-b border-[var(--color-ad-border)] bg-[var(--color-ad-surface)]/30">
        <div className="container mx-auto max-w-4xl text-center">
          <SectionHeading title="A hybrid approach to agent workspaces." />
          <p className="text-lg text-[var(--color-ad-text-muted)] mb-8">
            AgentDock Pro is designed as a hybrid product. The desktop app remains the complete primary experience. Local repositories and local agent tools can remain on your computer securely.
          </p>
          <p className="text-lg text-[var(--color-ad-text-muted)]">
            Cloud-supported Pro services augment the local experience by providing encrypted sync, remote access, remote environments, notifications, and workflow continuations across devices. We make the boundary between local execution and cloud services clear, so you retain control.
          </p>
        </div>
      </section>

      {/* Pro Features */}
      <section className="py-24 px-6 border-b border-[var(--color-ad-border)]">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading title="AgentDock Pro Features" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={<Workflow />} title="AIgency orchestration" description="Coordinate multiple specialised agents." badge="In development" />
            <FeatureCard icon={<GitBranch />} title="Shared project context" description="Intelligent tracking of project decisions." badge="In development" />
            <FeatureCard icon={<RefreshCw />} title="Multi-agent handoffs" description="Pass context automatically between roles." badge="Planned" />
            <FeatureCard icon={<Network />} title="Workflow graphs" description="Visualise tasks, dependencies, and blockers." badge="Planned" />
            <FeatureCard icon={<Shield />} title="Approval gates" description="Set strict points where user review is needed." badge="In development" />
            <FeatureCard icon={<Server />} title="Remote environments" description="Connect to cloud-hosted workspaces." badge="Planned" />
            <FeatureCard icon={<Cloud />} title="Encrypted Sync" description="Sync configurations across devices securely." badge="Planned" />
            <FeatureCard icon={<Layers />} title="Browser companion" description="Monitor workflows via a lightweight web app." badge="Planned" />
          </div>
        </div>
      </section>

      {/* Pricing & Waitlist */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Pricing & Availability</h2>
          <div className="p-10 rounded-2xl border-2 border-[var(--color-accent-purple)] bg-[var(--color-ad-surface)] my-10 relative shadow-[0_0_30px_var(--color-accent-purple-glow)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-accent-purple)] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              Planned Pricing
            </div>
            <div className="text-6xl font-bold text-white mb-2">AU$59.99<span className="text-2xl text-[var(--color-ad-text-muted)] font-normal">/mo</span></div>
            <p className="text-[var(--color-ad-text-muted)] mb-8">AgentDock Pro is currently in active development.</p>
            <a href="/waitlist" className="inline-block w-full sm:w-auto px-10 py-4 text-base font-bold text-white bg-[var(--color-accent-purple)] rounded-lg hover:bg-[var(--color-accent-purple-hover)] hover:shadow-[0_0_20px_var(--color-accent-purple-glow)] transition-all">
              Join the waitlist
            </a>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-24 px-6 border-t border-[var(--color-ad-border)] bg-[var(--color-ad-surface)]/30">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading title="Development Roadmap" />
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {[
              { area: "AgentDock foundations", status: "Available now" },
              { area: "AIgency orchestration", status: "In development" },
              { area: "Agent roles and task routing", status: "In development" },
              { area: "Workflow visibility", status: "Planned" },
              { area: "Cloud services & Sync", status: "Planned" },
              { area: "Remote environments", status: "Planned" },
              { area: "Integrations", status: "Planned" },
              { area: "Browser companion", status: "Planned" },
              { area: "Collaboration and teams", status: "Planned" }
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-4 border-b border-[var(--color-ad-border)]">
                <span className="font-medium text-[var(--color-ad-text)]">{item.area}</span>
                <StatusBadge status={item.status as any} />
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

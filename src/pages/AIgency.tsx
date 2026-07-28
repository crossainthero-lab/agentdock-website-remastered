import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Terminal, Workflow, Network, Server, GitBranch, Layers, ShieldCheck, Database, Cpu, FolderTree } from 'lucide-react';
import { Mermaid } from '../components/Mermaid';
import { WAITLIST_SECTION_ID, WAITLIST_SECTION_URL } from '../config/waitlist';
import { WaitlistForm } from '../components/WaitlistForm';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function AIgency() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);
  return (
    <div className="flex flex-col gap-32 pb-32 overflow-hidden">
      {/* Hero Section */}
      <section id="overview" className="container mx-auto px-6 pt-16 md:pt-24 text-center max-w-4xl relative scroll-mt-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[var(--color-accent-purple)]/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-semibold text-[var(--color-accent-purple)] bg-[var(--color-accent-purple-soft)] border border-[var(--color-accent-purple-border)] rounded-full uppercase tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-purple)] animate-pulse shadow-[0_0_8px_var(--color-accent-purple)]"></div>
            In Development
          </div>
          
          <p className="text-sm font-medium text-[var(--color-ad-text-muted)] mb-8 max-w-lg mx-auto">
            AIgency is in development. Join the waitlist for development updates and early-access announcements.
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-[1.1]">
            Multi-agent coordination,<br/>
            <span className="text-[var(--color-accent-purple)] drop-shadow-[0_0_15px_var(--color-accent-purple-glow)]">orchestrated locally.</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-ad-text-muted)] max-w-2xl mx-auto leading-relaxed mb-10">
            AIgency is a planned multi-agent coordination platform built around the AgentDock workflow. 
            Instead of prompting Claude Code, OpenAI Codex, and Google Antigravity separately, AIgency is designed to orchestrate them inside one shared project environment.
          </p>
          <div className="flex justify-center">
            <Link to="/aigency/technical" className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-[var(--color-accent-blue)] bg-[var(--color-accent-blue-soft)] border border-[var(--color-accent-blue-border)] rounded-md hover:bg-[var(--color-ad-surface)] hover:text-white transition-all">
              Explore the technical architecture <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Waitlist Form Section */}
      <motion.section 
        id={WAITLIST_SECTION_ID}
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="container mx-auto px-6 max-w-5xl scroll-mt-32"
      >
        <WaitlistForm />
      </motion.section>

      {/* The Concept */}
      <motion.section 
        id="how-it-works"
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, ease: "easeOut" }}
        className="container mx-auto px-6 max-w-5xl scroll-mt-32"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">You remain in control</h2>
            <div className="space-y-4">
              <p className="text-[var(--color-ad-text-muted)] leading-relaxed">
                AIgency is not simply a group chat containing several AI models. It is an orchestration and control layer for agent work.
              </p>
              <p className="text-[var(--color-ad-text-muted)] leading-relaxed">
                AIgency receives your goal, breaks it down, routes tasks to the best agents, routes context between them, runs checks, and ensures safety through human approval checkpoints before destructive actions.
              </p>
            </div>
          </div>
          <div className="bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-xl p-6 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-accent-purple-soft)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-sm font-mono text-[var(--color-accent-purple)] font-bold mb-4">EXECUTION_FLOW</h3>
            <ol className="space-y-3 text-sm text-[var(--color-ad-text-muted)] font-mono">
              <li><span className="text-white">1.</span> Receive goal from user</li>
              <li><span className="text-white">2.</span> Break goal into smaller tasks</li>
              <li><span className="text-white">3.</span> Assign tasks to suitable agents</li>
              <li><span className="text-white">4.</span> Provide relevant context</li>
              <li><span className="text-white">5.</span> Agents work separately or in sequence</li>
              <li><span className="text-[var(--color-accent-blue)]">6. Pass completed work between agents</span></li>
              <li><span className="text-white">7.</span> Compare competing implementations</li>
              <li><span className="text-white">8.</span> Run checks and inspect changes</li>
              <li><span className="text-[var(--color-accent-amber)]">9. Request approval before risky actions</span></li>
              <li><span className="text-[var(--color-accent-green)]">10. Present finished result & history</span></li>
            </ol>
          </div>
        </div>
      </motion.section>

      {/* Diagrams */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}
        className="container mx-auto px-6 max-w-5xl"
      >
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">AIgency system overview</h2>
          <p className="text-[var(--color-ad-text-muted)] mb-6 text-sm">The high-level orchestration architecture.</p>
          <Mermaid chart={`flowchart LR
    U[User] --> UI[AIgency Control Interface]
    UI --> O[Orchestrator]
    O --> T[Task Planner]
    O --> C[Shared Context Manager]
    O --> P[Permission and Approval Layer]

    T --> A1[Claude Code Adapter]
    T --> A2[OpenAI Codex Adapter]
    T --> A3[Google Antigravity Adapter]

    A1 --> W[Shared Project Workspace]
    A2 --> W
    A3 --> W

    W --> G[Git and Worktree Manager]
    W --> H[Activity and Audit History]

    P --> U
    H --> UI`} />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Task lifecycle</h2>
            <p className="text-[var(--color-ad-text-muted)] mb-6 text-sm">How AIgency breaks down and executes user goals.</p>
            <Mermaid chart={`sequenceDiagram
    participant User
    participant AIgency
    participant Planner
    participant Agent
    participant Workspace
    participant Review

    User->>AIgency: Submit project goal
    AIgency->>Planner: Break goal into tasks
    Planner->>Agent: Assign task and context
    Agent->>Workspace: Inspect and modify project
    Agent->>AIgency: Return result
    AIgency->>Review: Run checks and prepare review
    Review->>User: Request approval or present result`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Agent handoff</h2>
            <p className="text-[var(--color-ad-text-muted)] mb-6 text-sm">One example of a structured multi-agent workflow.</p>
            <Mermaid chart={`flowchart TD
    S[User objective] --> C[Claude Code analyses architecture]
    C --> H[Create task graph]
    H --> X[OpenAI Codex implements changes]
    X --> V[Run local tests]
    V --> G[Google Antigravity reviews or tests]
    G --> R[Unified result for user]`} />
          </div>
        </div>
      </motion.section>

      {/* Architecture Layers Overview */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}
        className="container mx-auto px-6 max-w-5xl"
      >
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Platform architecture overview</h2>
        <p className="text-center text-[var(--color-ad-text-muted)] mb-12 max-w-2xl mx-auto">This is the planned technical direction. AIgency is structured into distinct layers to safely manage agents working inside your local workspace.</p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Terminal className="w-5 h-5" />, title: 'User control layer', desc: 'Where the user creates projects, assigns objectives, reviews progress, changes permissions, approves actions, and inspects results.' },
            { icon: <Workflow className="w-5 h-5" />, title: 'Orchestration layer', desc: 'Responsible for splitting work, selecting agents, managing task dependencies, routing context, and coordinating handoffs.' },
            { icon: <Network className="w-5 h-5" />, title: 'Agent adapters', desc: 'Connect AIgency to supported agents such as Claude Code, OpenAI Codex, and Google Antigravity, while preserving their native capabilities.' },
            { icon: <FolderTree className="w-5 h-5" />, title: 'Workspace layer', desc: 'Manages repositories, project files, workspaces, sessions, branches, and isolated worktrees.' },
            { icon: <ShieldCheck className="w-5 h-5" />, title: 'Safety and approval layer', desc: 'Controls permissions, risky commands, file changes, tool access, external actions, and human approval checkpoints.' },
            { icon: <Database className="w-5 h-5" />, title: 'History and observability layer', desc: 'Records tasks, agent messages, handoffs, decisions, commands, file changes, errors, approvals, and final results.' },
          ].map((item, i) => (
            <div key={i} className="p-6 border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] rounded-xl hover:border-[var(--color-accent-blue-border)] hover:shadow-[0_0_15px_var(--color-accent-blue-soft)] transition-all">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-ad-bg)] border border-[var(--color-ad-border)] flex items-center justify-center text-[var(--color-accent-blue)] mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--color-ad-text-muted)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* AgentDock vs AIgency */}
      <motion.section 
        id="comparison"
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}
        className="container mx-auto px-6 max-w-5xl scroll-mt-32"
      >
        <h2 className="text-3xl font-bold text-white mb-12 text-center">The Evolution</h2>
        <div className="grid md:grid-cols-2 gap-8 relative">
          
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-full items-center justify-center text-[var(--color-ad-text-muted)] shadow-xl">
            <ArrowRight className="w-5 h-5" />
          </div>

          <div className="p-10 border border-[var(--color-ad-border)] bg-[var(--color-ad-bg)] rounded-xl flex flex-col h-full hover:border-[var(--color-accent-purple-border)] transition-colors relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-ad-surface)] to-transparent opacity-50"></div>
            <div className="relative z-10">
              <span className="inline-block px-2.5 py-1 mb-6 text-xs font-semibold text-[var(--color-accent-green)] bg-[var(--color-accent-green-soft)] border border-[var(--color-accent-green-border)] rounded-full uppercase tracking-wider">Available Now</span>
              <h3 className="text-3xl font-bold text-white mb-4">AgentDock</h3>
              <p className="text-[var(--color-ad-text-muted)] mb-8">AgentDock is the desktop control layer for coding-agent command-line tools.</p>
              
              <ul className="space-y-4 text-sm text-[var(--color-ad-text-muted)] flex-1 font-medium">
                <li className="flex items-start gap-3"><span className="text-[var(--color-accent-purple)]">→</span> Claude Code, OpenAI Codex, and Google Antigravity inside one application</li>
                <li className="flex items-start gap-3"><span className="text-[var(--color-accent-purple)]">→</span> Workspace and repository selection</li>
                <li className="flex items-start gap-3"><span className="text-[var(--color-accent-purple)]">→</span> Separate agent sessions</li>
                <li className="flex items-start gap-3"><span className="text-[var(--color-accent-purple)]">→</span> Model and reasoning controls</li>
                <li className="flex items-start gap-3"><span className="text-[var(--color-accent-purple)]">→</span> Permission controls</li>
                <li className="flex items-start gap-3"><span className="text-[var(--color-accent-purple)]">→</span> Local CLI integration</li>
                <li className="flex items-start gap-3"><span className="text-[var(--color-accent-purple)]">→</span> Conversation management & terminal access</li>
                <li className="flex items-start gap-3"><span className="text-[var(--color-accent-purple)]">→</span> Windows, macOS, and experimental Linux support</li>
              </ul>
            </div>
          </div>

          <div className="p-10 border border-[var(--color-accent-blue-border)] bg-[var(--color-ad-surface)] rounded-xl flex flex-col h-full relative overflow-hidden group shadow-[0_0_20px_var(--color-accent-blue-soft)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent-blue)]/10 blur-[60px] pointer-events-none group-hover:bg-[var(--color-accent-blue)]/20 transition-colors duration-700"></div>
            <div className="relative z-10">
              <span className="inline-block px-2.5 py-1 mb-6 text-xs font-semibold text-[var(--color-accent-blue)] bg-[var(--color-accent-blue-soft)] border border-[var(--color-accent-blue-border)] rounded-full uppercase tracking-wider">The Next Stage</span>
              <h3 className="text-3xl font-bold text-[var(--color-accent-blue)] mb-4 drop-shadow-[0_0_10px_var(--color-accent-blue-soft)]">AIgency</h3>
              <p className="text-[var(--color-ad-text-muted)] mb-8">AIgency is the planned coordination layer built on top of the AgentDock idea.</p>
              
              <ul className="space-y-4 text-sm text-[var(--color-ad-text)] flex-1 font-medium">
                <li className="flex items-start gap-3"><span className="text-[var(--color-accent-blue)]">→</span> Multiple agents working on the same project</li>
                <li className="flex items-start gap-3"><span className="text-[var(--color-accent-blue)]">→</span> Task assignment and delegation</li>
                <li className="flex items-start gap-3"><span className="text-[var(--color-accent-blue)]">→</span> Structured agent-to-agent handoffs</li>
                <li className="flex items-start gap-3"><span className="text-[var(--color-accent-blue)]">→</span> Shared project context</li>
                <li className="flex items-start gap-3"><span className="text-[var(--color-accent-blue)]">→</span> Comparison of different agent solutions</li>
                <li className="flex items-start gap-3"><span className="text-[var(--color-accent-blue)]">→</span> Automatic routing of tasks to suitable agents</li>
                <li className="flex items-start gap-3"><span className="text-[var(--color-accent-blue)]">→</span> Human approval checkpoints & permission controls</li>
                <li className="flex items-start gap-3"><span className="text-[var(--color-accent-blue)]">→</span> Git-aware isolated work & audit trails</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Final Waitlist Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}
        className="container mx-auto px-6 max-w-5xl mt-16"
      >
        <div className="bg-[var(--color-ad-surface)] border border-[var(--color-accent-blue-border)] rounded-2xl p-10 md:p-16 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('/grid-texture.svg')] opacity-5 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent-blue-soft)]/20 to-transparent pointer-events-none"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">Be there when AIgency begins.</h2>
          <p className="text-[var(--color-ad-text-muted)] text-lg mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
            Join the waitlist for development updates, early-access announcements, and the first opportunity to try AIgency.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 w-full sm:w-auto">
            <a 
              href={WAITLIST_SECTION_URL} 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(WAITLIST_SECTION_ID)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-white bg-[var(--color-accent-purple)] rounded-md hover:bg-[var(--color-accent-purple-hover)] hover:shadow-[0_0_25px_var(--color-accent-purple-glow)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-purple)] focus:ring-offset-2 focus:ring-offset-[var(--color-ad-surface)]"
            >
              Join the AIgency Waitlist
            </a>
            <Link to="/aigency/technical" className="w-full sm:w-auto px-8 py-3.5 text-sm font-medium text-[var(--color-accent-blue)] bg-transparent border border-[var(--color-accent-blue-border)] rounded-md hover:bg-[var(--color-accent-blue-soft)] hover:border-[var(--color-accent-blue)] hover:text-white transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)] focus:ring-offset-2 focus:ring-offset-[var(--color-ad-surface)]">
              Explore Technical Architecture <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

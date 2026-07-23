import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mermaid } from '../components/Mermaid';

export function AIgencyTechnical() {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const navItems = [
    { id: 'overview', label: 'Technical Overview' },
    { id: 'architecture', label: 'Core Architecture' },
    { id: 'adapter-contract', label: 'Agent Adapter Contract' },
    { id: 'task-graph', label: 'Task Graph' },
    { id: 'shared-context', label: 'Shared Context' },
    { id: 'handoffs', label: 'Handoffs' },
    { id: 'workspace', label: 'Workspace Isolation' },
    { id: 'permissions', label: 'Permission Model' },
    { id: 'observability', label: 'Observability' },
    { id: 'recovery', label: 'Failure Recovery' },
    { id: 'future', label: 'Local-first & Future Services' },
  ];

  return (
    <div className="flex flex-col relative pb-32 pt-8">
      
      {/* Page Header */}
      <div className="container mx-auto px-6 max-w-7xl mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">AIgency Technical Architecture</h1>
        <p className="text-[var(--color-ad-text-muted)] text-lg max-w-3xl">Deep dive into the planned orchestration layer, component architecture, and multi-agent coordination system.</p>
      </div>

      <div className="container mx-auto px-6 max-w-7xl flex flex-col lg:flex-row gap-12 relative items-start">
        
        {/* Sticky Sidebar Nav (Desktop) / Scrollable Header (Mobile) */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky top-[80px] z-30 lg:z-0 bg-[var(--color-ad-bg)]/90 backdrop-blur-md lg:bg-transparent pb-4 lg:pb-0 border-b border-[var(--color-ad-border)] lg:border-none">
          <nav className="flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-visible scrollbar-hide py-2 lg:py-0">
            {navItems.map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`}
                className={`whitespace-nowrap px-3 lg:px-4 py-2 text-sm rounded-md transition-colors ${
                  activeSection === item.id 
                    ? 'bg-[var(--color-accent-blue-soft)] text-[var(--color-accent-blue)] font-medium border border-[var(--color-accent-blue-border)] lg:border-transparent' 
                    : 'text-[var(--color-ad-text-muted)] hover:text-white hover:bg-[var(--color-ad-surface)]'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 flex flex-col gap-24">
          
          <section id="overview" className="scroll-mt-[150px]">
            <h2 className="text-2xl font-bold text-white mb-6">Technical overview</h2>
            <div className="prose prose-invert prose-blue max-w-none">
              <p className="text-[var(--color-ad-text-muted)] leading-relaxed">
                AIgency is planned as a local-first coordination layer around supported coding agents, project workspaces, task state, permissions, and review workflows.
                It acts as a secure intermediary between native CLI processes (like Claude Code or Codex) and the local filesystem, ensuring every operation is deliberate, auditable, and isolated.
              </p>
            </div>
          </section>

          <section id="architecture" className="scroll-mt-[150px]">
            <h2 className="text-2xl font-bold text-white mb-6">Core architecture</h2>
            <div className="prose prose-invert prose-blue max-w-none mb-8">
              <p className="text-[var(--color-ad-text-muted)] leading-relaxed">
                AIgency consists of the following primary components:
              </p>
              <ul className="text-[var(--color-ad-text-muted)] list-disc pl-5 space-y-2 mt-4">
                <li><strong className="text-white font-medium">Desktop interface:</strong> The presentation layer for user interaction.</li>
                <li><strong className="text-white font-medium">Main process and secure preload bridge:</strong> Safely connects UI to local system capabilities.</li>
                <li><strong className="text-white font-medium">Agent adapter layer:</strong> Normalises interaction with different agent CLIs.</li>
                <li><strong className="text-white font-medium">Process and terminal management:</strong> Handles native execution of agent commands.</li>
                <li><strong className="text-white font-medium">Workspace service:</strong> Tracks active projects and sessions.</li>
                <li><strong className="text-white font-medium">Git and worktree service:</strong> Manages source control isolation.</li>
                <li><strong className="text-white font-medium">Task orchestration engine:</strong> The central router for task execution.</li>
                <li><strong className="text-white font-medium">Context and handoff service:</strong> Filters and packages state for agents.</li>
                <li><strong className="text-white font-medium">Approval and security service:</strong> Enforces permissions and human-in-the-loop validation.</li>
                <li><strong className="text-white font-medium">History and diagnostics storage:</strong> Immutable log of all actions.</li>
                <li><strong className="text-white font-medium">Optional future cloud services:</strong> Extends capabilities (Not currently implemented).</li>
              </ul>
            </div>
            
            <div className="w-full xl:-mx-8">
              <Mermaid chart={`flowchart TB
    Renderer[Desktop Renderer] --> Preload[Secure Preload Bridge]
    Preload --> Main[Electron Main Process]

    Main --> Orchestrator[Task Orchestrator]
    Main --> Sessions[Session Manager]
    Main --> Workspace[Workspace Service]
    Main --> Git[Git and Worktree Service]
    Main --> Security[Approval and Security Service]
    Main --> Storage[History and Diagnostics Storage]

    Orchestrator --> Claude[Claude Code Adapter]
    Orchestrator --> Codex[Codex Adapter]
    Orchestrator --> Agy[agy Adapter]

    Claude --> Processes[Native Agent Processes]
    Codex --> Processes
    Agy --> Processes

    Workspace --> Files[Project Files]
    Git --> Repository[Git Repository]`} />
            </div>
          </section>

          <section id="adapter-contract" className="scroll-mt-[150px]">
            <h2 className="text-2xl font-bold text-white mb-6">Agent adapter contract</h2>
            <div className="prose prose-invert prose-blue max-w-none">
              <p className="text-[var(--color-ad-text-muted)] leading-relaxed">
                Each supported agent adapter needs to handle a strict contract to integrate with AIgency:
              </p>
              <ul className="text-[var(--color-ad-text-muted)] list-disc pl-5 space-y-2 mt-4">
                <li>Executable discovery</li>
                <li>Starting and stopping the process</li>
                <li>Sending prompts</li>
                <li>Receiving streamed output</li>
                <li>Tracking session identifiers</li>
                <li>Model selection</li>
                <li>Reasoning or effort settings</li>
                <li>Permission settings</li>
                <li>Error reporting</li>
                <li>Handoff input</li>
                <li>Structured completion output</li>
              </ul>
            </div>
          </section>

          <section id="task-graph" className="scroll-mt-[150px]">
            <h2 className="text-2xl font-bold text-white mb-6">Task graph</h2>
            <div className="prose prose-invert prose-blue max-w-none mb-8">
              <p className="text-[var(--color-ad-text-muted)] leading-relaxed mb-4">
                Complex goals can be represented as tasks with specific properties: Task ID, Objective, Assigned agent, Dependencies, Workspace or worktree, Required context, Permission level, Current status, Output, Validation result, and Approval state.
              </p>
            </div>
            
            <div className="w-full xl:-mx-8">
              <Mermaid chart={`flowchart LR
    A[Analyse request] --> B[Inspect repository]
    B --> C[Plan implementation]
    C --> D1[Claude implementation]
    C --> D2[Codex implementation]
    D1 --> E[Compare changes]
    D2 --> E
    E --> F[Run tests]
    F --> G{Tests pass?}
    G -- Yes --> H[Request final approval]
    G -- No --> I[Create repair task]
    I --> F`} />
            </div>
          </section>

          <section id="shared-context" className="scroll-mt-[150px]">
            <h2 className="text-2xl font-bold text-white mb-6">Shared context</h2>
            <div className="prose prose-invert prose-blue max-w-none mb-8">
              <p className="text-[var(--color-ad-text-muted)] leading-relaxed mb-4">
                AIgency should not blindly send the entire conversation and repository to every agent. Context should be dynamically selected from: User objective, Relevant conversation history, Relevant files, Previous task outputs, Repository state, Git diff, Diagnostics, and Agent-generated handoff notes.
              </p>
            </div>
            
            <div className="w-full xl:-mx-8">
              <Mermaid chart={`flowchart LR
    Goal[User Goal] --> Selector[Context Selector]
    History[Relevant History] --> Selector
    Files[Relevant Files] --> Selector
    Diff[Current Git Diff] --> Selector
    Previous[Previous Task Output] --> Selector
    Diagnostics[Diagnostics] --> Selector

    Selector --> Package[Agent Context Package]
    Package --> Agent[Assigned Agent]
    Agent --> Result[Structured Result]
    Result --> HistoryStore[Project History]
    Result --> Handoff[Next-Agent Handoff]`} />
            </div>
          </section>

          <section id="handoffs" className="scroll-mt-[150px]">
            <h2 className="text-2xl font-bold text-white mb-6">Handoffs</h2>
            <div className="prose prose-invert prose-blue max-w-none">
              <p className="text-[var(--color-ad-text-muted)] leading-relaxed">
                Handoffs should be structured rather than simply copying random chat text. A handoff should include:
              </p>
              <ul className="text-[var(--color-ad-text-muted)] list-disc pl-5 space-y-2 mt-4">
                <li>Completed work</li>
                <li>Files changed</li>
                <li>Decisions made</li>
                <li>Known problems</li>
                <li>Commands run</li>
                <li>Tests run</li>
                <li>Remaining task</li>
                <li>Recommended next agent</li>
                <li>Relevant context</li>
              </ul>
            </div>
          </section>

          <section id="workspace" className="scroll-mt-[150px]">
            <h2 className="text-2xl font-bold text-white mb-6">Workspace isolation</h2>
            <div className="prose prose-invert prose-blue max-w-none mb-8">
              <p className="text-[var(--color-ad-text-muted)] leading-relaxed">
                Git branches or worktrees can isolate separate agent attempts. This allows AIgency to compare multiple approaches before the user chooses one, avoiding corrupted main branches.
              </p>
            </div>
            
            <div className="w-full xl:-mx-8">
              <Mermaid chart={`flowchart TD
    T[Single task] --> W1[Worktree A]
    T --> W2[Worktree B]

    W1 --> C[Claude attempt]
    W2 --> X[Codex attempt]

    C --> R[Comparison and validation]
    X --> R

    R --> U[User selects or combines result]`} />
            </div>
          </section>

          <section id="permissions" className="scroll-mt-[150px]">
            <h2 className="text-2xl font-bold text-white mb-6">Permission model</h2>
            <div className="prose prose-invert prose-blue max-w-none mb-8">
              <p className="text-[var(--color-ad-text-muted)] leading-relaxed">
                AIgency enforces permission levels such as:
              </p>
              <ul className="text-[var(--color-ad-text-muted)] list-disc pl-5 space-y-2 mt-4 mb-8">
                <li>Read-only inspection</li>
                <li>Workspace file changes</li>
                <li>Command execution</li>
                <li>Package installation</li>
                <li>Git operations</li>
                <li>External network access</li>
                <li>Destructive actions</li>
              </ul>
              <p className="text-[var(--color-ad-text-muted)] leading-relaxed font-medium">
                It is clear that risky operations should require explicit user approval.
              </p>
            </div>
            
            <div className="w-full xl:-mx-8">
              <Mermaid chart={`stateDiagram-v2
    [*] --> Proposed
    Proposed --> Running: Safe task
    Proposed --> AwaitingApproval: Risky task
    AwaitingApproval --> Running: User approves
    AwaitingApproval --> Rejected: User rejects
    Running --> Validation
    Validation --> Completed: Checks pass
    Validation --> RepairRequired: Checks fail
    RepairRequired --> Running
    Completed --> [*]
    Rejected --> [*]`} />
            </div>
          </section>

          <section id="observability" className="scroll-mt-[150px]">
            <h2 className="text-2xl font-bold text-white mb-6">Observability</h2>
            <div className="prose prose-invert prose-blue max-w-none">
              <p className="text-[var(--color-ad-text-muted)] leading-relaxed">
                Users need visibility into exactly what the orchestration layer is doing at all times:
                Active agent, Current task, Agent status, Commands, Files changed, Token or usage information where available, Errors, Handoffs, Approvals, Test results, and Final output.
              </p>
            </div>
          </section>

          <section id="recovery" className="scroll-mt-[150px]">
            <h2 className="text-2xl font-bold text-white mb-6">Failure recovery</h2>
            <div className="prose prose-invert prose-blue max-w-none">
              <p className="text-[var(--color-ad-text-muted)] leading-relaxed">
                Planned handling for execution faults includes graceful recovery from:
                Agent process crashes, Stalled sessions, Invalid handoffs, Conflicting file changes, Failed tests, Permission rejection, Missing CLI installations, and Interrupted tasks.
              </p>
            </div>
          </section>

          <section id="future" className="scroll-mt-[150px]">
            <h2 className="text-2xl font-bold text-white mb-6">Local-first and future services</h2>
            <div className="prose prose-invert prose-blue max-w-none">
              <p className="text-[var(--color-ad-text-muted)] leading-relaxed">
                AgentDock currently works around locally installed agent CLIs. AIgency should preserve local control while future optional services may support account features, team collaboration, remote orchestration, billing, synchronisation, or shared project state.
              </p>
              <div className="mt-4 p-4 border border-[var(--color-accent-amber-border)] bg-[var(--color-accent-amber-soft)] rounded-md">
                <p className="text-[var(--color-accent-amber)] text-sm font-medium m-0">
                  Note: Future cloud services are planned extensions and do not currently exist in the open-source release.
                </p>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

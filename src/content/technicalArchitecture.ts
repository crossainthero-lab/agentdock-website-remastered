import type { TechnicalSection } from "../types/cms";

type BundledTechnicalSection = Omit<TechnicalSection, "id" | "createdAt" | "updatedAt">;

export const technicalArchitectureIntro = {
  title: "AIgency Technical Architecture",
  description:
    "Deep dive into the planned orchestration layer, component architecture, and multi-agent coordination system.",
};

export const bundledTechnicalSections: BundledTechnicalSection[] = [
  {
    sectionKey: "overview",
    title: "Technical overview",
    contentMarkdown:
      "AIgency is planned as a local-first coordination layer around supported coding agents, project workspaces, task state, permissions, and review workflows.\n\nIt acts as a secure intermediary between native CLI processes (like Claude Code or OpenAI Codex) and the local filesystem, ensuring every operation is deliberate, auditable, and isolated.",
    mermaidSource: null,
    sortOrder: 10,
    isVisible: true,
  },
  {
    sectionKey: "architecture",
    title: "Core architecture",
    contentMarkdown:
      "AIgency consists of the following primary components:\n\n- **Desktop interface:** The presentation layer for user interaction.\n- **Main process and secure preload bridge:** Safely connects UI to local system capabilities.\n- **Agent adapter layer:** Normalises interaction with different agent CLIs.\n- **Process and terminal management:** Handles native execution of agent commands.\n- **Workspace service:** Tracks active projects and sessions.\n- **Git and worktree service:** Manages source control isolation.\n- **Task orchestration engine:** The central router for task execution.\n- **Context and handoff service:** Filters and packages state for agents.\n- **Approval and security service:** Enforces permissions and human-in-the-loop validation.\n- **History and diagnostics storage:** Immutable log of all actions.\n- **Optional future cloud services:** Extends capabilities, but is not currently implemented.",
    mermaidSource: `flowchart TB
    Renderer[Desktop Renderer] --> Preload[Secure Preload Bridge]
    Preload --> Main[Electron Main Process]

    Main --> Orchestrator[Task Orchestrator]
    Main --> Sessions[Session Manager]
    Main --> Workspace[Workspace Service]
    Main --> Git[Git and Worktree Service]
    Main --> Security[Approval and Security Service]
    Main --> Storage[History and Diagnostics Storage]

    Orchestrator --> Claude[Claude Code Adapter]
    Orchestrator --> Codex[OpenAI Codex Adapter]
    Orchestrator --> Agy[Google Antigravity Adapter]

    Claude --> Processes[Native Agent Processes]
    Codex --> Processes
    Agy --> Processes

    Workspace --> Files[Project Files]
    Git --> Repository[Git Repository]`,
    sortOrder: 20,
    isVisible: true,
  },
  {
    sectionKey: "adapter-contract",
    title: "Agent adapter contract",
    contentMarkdown:
      "Each supported agent adapter needs to handle a strict contract to integrate with AIgency:\n\n- Executable discovery\n- Starting and stopping the process\n- Sending prompts\n- Receiving streamed output\n- Tracking session identifiers\n- Model selection\n- Reasoning or effort settings\n- Permission settings\n- Error reporting\n- Handoff input\n- Structured completion output",
    mermaidSource: null,
    sortOrder: 30,
    isVisible: true,
  },
  {
    sectionKey: "task-graph",
    title: "Task graph",
    contentMarkdown:
      "Complex goals can be represented as tasks with specific properties: Task ID, Objective, Assigned agent, Dependencies, Workspace or worktree, Required context, Permission level, Current status, Output, Validation result, and Approval state.",
    mermaidSource: `flowchart LR
    A[Analyse request] --> B[Inspect repository]
    B --> C[Plan implementation]
    C --> D1[Claude Code implementation]
    C --> D2[OpenAI Codex implementation]
    D1 --> E[Compare changes]
    D2 --> E
    E --> F[Run tests]
    F --> G{Tests pass?}
    G -- Yes --> H[Request final approval]
    G -- No --> I[Create repair task]
    I --> F`,
    sortOrder: 40,
    isVisible: true,
  },
  {
    sectionKey: "shared-context",
    title: "Shared context",
    contentMarkdown:
      "AIgency should not blindly send the entire conversation and repository to every agent. Context should be dynamically selected from: User objective, Relevant conversation history, Relevant files, Previous task outputs, Repository state, Git diff, Diagnostics, and Agent-generated handoff notes.",
    mermaidSource: `flowchart LR
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
    Result --> Handoff[Next-Agent Handoff]`,
    sortOrder: 50,
    isVisible: true,
  },
  {
    sectionKey: "handoffs",
    title: "Handoffs",
    contentMarkdown:
      "Handoffs should be structured rather than simply copying random chat text. A handoff should include:\n\n- Completed work\n- Files changed\n- Decisions made\n- Known problems\n- Commands run\n- Tests run\n- Remaining task\n- Recommended next agent\n- Relevant context",
    mermaidSource: null,
    sortOrder: 60,
    isVisible: true,
  },
  {
    sectionKey: "workspace",
    title: "Workspace isolation",
    contentMarkdown:
      "Git branches or worktrees can isolate separate agent attempts. This allows AIgency to compare multiple approaches before the user chooses one, avoiding corrupted main branches.",
    mermaidSource: `flowchart TD
    T[Single task] --> W1[Worktree A]
    T --> W2[Worktree B]

    W1 --> C[Claude Code attempt]
    W2 --> X[OpenAI Codex attempt]

    C --> R[Comparison and validation]
    X --> R

    R --> U[User selects or combines result]`,
    sortOrder: 70,
    isVisible: true,
  },
  {
    sectionKey: "permissions",
    title: "Permission model",
    contentMarkdown:
      "AIgency enforces permission levels such as:\n\n- Read-only inspection\n- Workspace file changes\n- Command execution\n- Package installation\n- Git operations\n- External network access\n- Destructive actions\n\nIt is clear that risky operations should require explicit user approval.",
    mermaidSource: `stateDiagram-v2
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
    Rejected --> [*]`,
    sortOrder: 80,
    isVisible: true,
  },
  {
    sectionKey: "observability",
    title: "Observability",
    contentMarkdown:
      "Users need visibility into exactly what the orchestration layer is doing at all times: Active agent, Current task, Agent status, Commands, Files changed, Token or usage information where available, Errors, Handoffs, Approvals, Test results, and Final output.",
    mermaidSource: null,
    sortOrder: 90,
    isVisible: true,
  },
  {
    sectionKey: "recovery",
    title: "Failure recovery",
    contentMarkdown:
      "Planned handling for execution faults includes graceful recovery from: Agent process crashes, Stalled sessions, Invalid handoffs, Conflicting file changes, Failed tests, Permission rejection, Missing CLI installations, and Interrupted tasks.",
    mermaidSource: null,
    sortOrder: 100,
    isVisible: true,
  },
  {
    sectionKey: "future",
    title: "Local-first and future services",
    contentMarkdown:
      "AgentDock currently works around locally installed agent CLIs. AIgency should preserve local control while future optional services may support account features, team collaboration, remote orchestration, billing, synchronisation, or shared project state.\n\n> **Note:** Future cloud services are planned extensions and do not currently exist in the open-source release.",
    mermaidSource: null,
    sortOrder: 110,
    isVisible: true,
  },
];

export function bundledTechnicalSectionsWithIds(): TechnicalSection[] {
  const now = new Date(0).toISOString();
  return bundledTechnicalSections.map((section, index) => ({
    ...section,
    id: index + 1,
    createdAt: now,
    updatedAt: now,
  }));
}

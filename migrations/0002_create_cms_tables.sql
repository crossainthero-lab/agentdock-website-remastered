CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  cover_image TEXT,
  content_markdown TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_slug
  ON blog_posts (slug);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status
  ON blog_posts (status);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at
  ON blog_posts (published_at DESC);

CREATE TABLE IF NOT EXISTS technical_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  mermaid_source TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_technical_content_section_key
  ON technical_content (section_key);

CREATE INDEX IF NOT EXISTS idx_technical_content_visible_order
  ON technical_content (is_visible, sort_order);

CREATE TABLE IF NOT EXISTS admin_login_attempts (
  attempt_key TEXT PRIMARY KEY,
  failed_count INTEGER NOT NULL DEFAULT 0,
  locked_until TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS seed_technical_content;

CREATE TABLE seed_technical_content (
  section_key TEXT NOT NULL,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  mermaid_source TEXT,
  sort_order INTEGER NOT NULL,
  is_visible INTEGER NOT NULL
);

INSERT INTO seed_technical_content (
  section_key,
  title,
  content_markdown,
  mermaid_source,
  sort_order,
  is_visible
)
VALUES
  (
    'overview',
    'Technical overview',
    'AIgency is planned as a local-first coordination layer around supported coding agents, project workspaces, task state, permissions, and review workflows.

It acts as a secure intermediary between native CLI processes (like Claude Code or OpenAI Codex) and the local filesystem, ensuring every operation is deliberate, auditable, and isolated.',
    NULL,
    10,
    1
  ),
  (
    'architecture',
    'Core architecture',
    'AIgency consists of the following primary components:

- **Desktop interface:** The presentation layer for user interaction.
- **Main process and secure preload bridge:** Safely connects UI to local system capabilities.
- **Agent adapter layer:** Normalises interaction with different agent CLIs.
- **Process and terminal management:** Handles native execution of agent commands.
- **Workspace service:** Tracks active projects and sessions.
- **Git and worktree service:** Manages source control isolation.
- **Task orchestration engine:** The central router for task execution.
- **Context and handoff service:** Filters and packages state for agents.
- **Approval and security service:** Enforces permissions and human-in-the-loop validation.
- **History and diagnostics storage:** Immutable log of all actions.
- **Optional future cloud services:** Extends capabilities, but is not currently implemented.',
    'flowchart TB
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
    Git --> Repository[Git Repository]',
    20,
    1
  ),
  (
    'adapter-contract',
    'Agent adapter contract',
    'Each supported agent adapter needs to handle a strict contract to integrate with AIgency:

- Executable discovery
- Starting and stopping the process
- Sending prompts
- Receiving streamed output
- Tracking session identifiers
- Model selection
- Reasoning or effort settings
- Permission settings
- Error reporting
- Handoff input
- Structured completion output',
    NULL,
    30,
    1
  ),
  (
    'task-graph',
    'Task graph',
    'Complex goals can be represented as tasks with specific properties: Task ID, Objective, Assigned agent, Dependencies, Workspace or worktree, Required context, Permission level, Current status, Output, Validation result, and Approval state.',
    'flowchart LR
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
    I --> F',
    40,
    1
  ),
  (
    'shared-context',
    'Shared context',
    'AIgency should not blindly send the entire conversation and repository to every agent. Context should be dynamically selected from: User objective, Relevant conversation history, Relevant files, Previous task outputs, Repository state, Git diff, Diagnostics, and Agent-generated handoff notes.',
    'flowchart LR
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
    Result --> Handoff[Next-Agent Handoff]',
    50,
    1
  ),
  (
    'handoffs',
    'Handoffs',
    'Handoffs should be structured rather than simply copying random chat text. A handoff should include:

- Completed work
- Files changed
- Decisions made
- Known problems
- Commands run
- Tests run
- Remaining task
- Recommended next agent
- Relevant context',
    NULL,
    60,
    1
  ),
  (
    'workspace',
    'Workspace isolation',
    'Git branches or worktrees can isolate separate agent attempts. This allows AIgency to compare multiple approaches before the user chooses one, avoiding corrupted main branches.',
    'flowchart TD
    T[Single task] --> W1[Worktree A]
    T --> W2[Worktree B]

    W1 --> C[Claude Code attempt]
    W2 --> X[OpenAI Codex attempt]

    C --> R[Comparison and validation]
    X --> R

    R --> U[User selects or combines result]',
    70,
    1
  ),
  (
    'permissions',
    'Permission model',
    'AIgency enforces permission levels such as:

- Read-only inspection
- Workspace file changes
- Command execution
- Package installation
- Git operations
- External network access
- Destructive actions

It is clear that risky operations should require explicit user approval.',
    'stateDiagram-v2
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
    Rejected --> [*]',
    80,
    1
  ),
  (
    'observability',
    'Observability',
    'Users need visibility into exactly what the orchestration layer is doing at all times: Active agent, Current task, Agent status, Commands, Files changed, Token or usage information where available, Errors, Handoffs, Approvals, Test results, and Final output.',
    NULL,
    90,
    1
  ),
  (
    'recovery',
    'Failure recovery',
    'Planned handling for execution faults includes graceful recovery from: Agent process crashes, Stalled sessions, Invalid handoffs, Conflicting file changes, Failed tests, Permission rejection, Missing CLI installations, and Interrupted tasks.',
    NULL,
    100,
    1
  ),
  (
    'future',
    'Local-first and future services',
    'AgentDock currently works around locally installed agent CLIs. AIgency should preserve local control while future optional services may support account features, team collaboration, remote orchestration, billing, synchronisation, or shared project state.

> **Note:** Future cloud services are planned extensions and do not currently exist in the open-source release.',
    NULL,
    110,
    1
  );

INSERT INTO technical_content (
  section_key,
  title,
  content_markdown,
  mermaid_source,
  sort_order,
  is_visible
)
SELECT
  section_key,
  title,
  content_markdown,
  mermaid_source,
  sort_order,
  is_visible
FROM seed_technical_content
WHERE NOT EXISTS (SELECT 1 FROM technical_content);

DROP TABLE seed_technical_content;

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  category?: string;
  content: string;
}

export const blogPosts: BlogPostMeta[] = [
  {
    slug: 'antigravity-next-major-update',
    title: 'Antigravity and the Next Major Update',
    date: '2026-08-05',
    description: 'A look at how we are integrating Antigravity into AgentDock and what to expect in the next major update.',
    category: 'Product Updates',
    content: `
We are thrilled to announce that early support for Antigravity is now available in AgentDock! Antigravity brings incredibly powerful capabilities, but because it operates differently from traditional CLI-based agents like Claude Code and Codex, we are designing a completely new integration layer.

### How Antigravity Fits In

Here is a look at how Antigravity fits into the AIgency workflow:

\`\`\`mermaid
flowchart TD
  User([User]) -->|Assigns Task| AD[AgentDock Pro]
  AD -->|Routes| AIgency{AIgency}
  AIgency -->|Standard task| C[Claude / Codex]
  AIgency -->|Complex task| AG[Antigravity]
  AG -->|Workspace API| FS[(Local Files)]
  AG -->|Messaging| AD
\`\`\`

Because Antigravity runs as a deeply integrated agent rather than a simple CLI tool, the next major AgentDock update will focus heavily on refining this experience:

* **Faster workspace setup**
* **Workspace trust and permission detection**
* **Clearer progress reporting**
* **Better pause, resume and recovery**
* **Stronger task and file tracking**
* **Better AIgency handoffs**

### See It In Action

Check out this early preview of Antigravity running inside the AgentDock workspace:

\`\`\`video
{
  "src": "https://example.com/demo.mp4",
  "title": "Antigravity Workspace Preview",
  "autoplay": false,
  "controls": true
}
\`\`\`

We believe this deeper integration will redefine how developers work with AI. Stay tuned for more!
    `
  },
  {
    slug: 'introducing-agentdock',
    title: 'Introducing AgentDock',
    date: '2026-07-01',
    description: 'Bringing coding agents into one unified desktop workspace. Why we built AgentDock and what it means for the future of development.',
    category: 'Announcements',
    content: `
Welcome to AgentDock.

Coding agents have changed how we write software, but managing them across different terminals, browser tabs, and custom scripts has become a bottleneck. AgentDock is designed to solve this by providing a single, cohesive desktop application to manage your AI coding assistants.

### The Problem

Developers today use Claude for deep reasoning, Codex for quick commands, and Antigravity for Google-specific workflows. Switching between them means losing context and manually moving code around.

### The Solution

AgentDock gives you:
- A unified interface for your preferred agents.
- Clear visibility into file changes and terminal output.
- The ability to switch agents mid-task without losing the thread.

We're just getting started. Stay tuned for more updates.
    `
  },
  {
    slug: 'why-ai-agents-need-one-workspace',
    title: 'Why AI Agents Need One Workspace',
    date: '2026-07-10',
    description: 'Context switching is the enemy of productivity. Here is why consolidating your AI tools into a single platform makes you a faster developer.',
    category: 'Insights',
    content: `
When you use multiple AI coding agents, the biggest challenge isn't the intelligence of the models—it's the friction of the workflow.

### Fragmented Workflows

If you ask one agent to scaffold a project and another to debug it, you often have to manually explain what the first agent did. This defeats the purpose of automation.

### Shared Context

A unified workspace means that when you switch from Claude to Codex, the new agent already knows what files were changed and what the current error is. It's like having a team of developers sitting in the same room, looking at the same screen.

AgentDock provides this shared context, allowing you to focus on the architecture while the agents handle the implementation details.
    `
  },
  {
    slug: 'the-road-to-aigency',
    title: 'The Road to AIgency',
    date: '2026-07-20',
    description: 'AgentDock is just the beginning. Our vision for AIgency and the future of coordinated multi-agent development.',
    category: 'Future',
    content: `
AgentDock solves the immediate problem of bringing coding agents together. But the true potential of AI in development isn't just having multiple tools—it's having a coordinated team.

### Enter AIgency

AIgency is our vision for the next stage of development. Instead of you manually prompting an agent to write code and then prompting another to review it, AIgency will allow agents to coordinate amongst themselves.

- **Agent 1** writes the feature.
- **Agent 2** reviews the code and suggests improvements.
- **Agent 3** writes and runs the tests.

You act as the director, assigning tasks and reviewing the final output. We are actively building the foundation for AIgency within AgentDock. We can't wait to show you more.
    `
  }
];

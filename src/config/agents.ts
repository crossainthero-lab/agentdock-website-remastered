export interface AgentConfig {
  id: string;
  name: string;
  provider?: string;
  command?: string;
  description: string;
  logoPath: string;
  supported: boolean;
  accent: string;
  opticalSize: string; // Tailwind class for sizing
  opticalSizeStrip: string;
}

export const AGENTS: AgentConfig[] = [
  {
    id: 'claude',
    name: 'Claude Code',
    provider: 'Anthropic',
    description: 'Use Claude Code through its local CLI while AgentDock manages the workspace, conversation, model controls, and permissions.',
    logoPath: '/claude-code-logo-transparent.png',
    supported: true,
    accent: 'var(--color-accent-amber)',
    opticalSize: 'w-10 h-10',
    opticalSizeStrip: 'w-5 h-5',
  },
  {
    id: 'codex',
    name: 'OpenAI Codex',
    provider: 'OpenAI',
    description: 'Run Codex inside AgentDock with project sessions, model selection, reasoning controls, and local workspace access.',
    logoPath: '/openai-codex-logo-transparent.png',
    supported: true,
    accent: 'var(--color-accent-green)',
    opticalSize: 'w-10 h-10',
    opticalSizeStrip: 'w-5 h-5',
  },
  {
    id: 'agy',
    name: 'Google Antigravity',
    command: 'agy',
    description: 'Connect Google Antigravity through the agy command and manage its coding workflow alongside Claude Code and Codex.',
    logoPath: '/agy-logo-transparent.png',
    supported: true,
    accent: 'var(--color-accent-blue)',
    opticalSize: 'w-9 h-9',
    opticalSizeStrip: 'w-4 h-4',
  }
];

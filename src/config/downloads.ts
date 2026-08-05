export interface DownloadLink {
  platform: 'windows' | 'macos' | 'linux';
  architecture: string;
  type: string;
  version: string;
  url: string;
  available: boolean;
}

// These point to real GitHub releases for AgentDock.
// If a build is not yet available, set available to false and it will display 'Coming soon'.

export const downloadsConfig: DownloadLink[] = [
  {
    platform: 'windows',
    architecture: 'x64',
    type: 'Windows Installer (.exe)',
    version: 'latest',
    url: 'https://github.com/crossainthero-lab/AgentDock/releases/latest/download/AgentDock-Setup.exe',
    available: true,
  },
  {
    platform: 'windows',
    architecture: 'x64',
    type: 'Windows Portable (.exe)',
    version: 'latest',
    url: 'https://github.com/crossainthero-lab/AgentDock/releases/latest/download/AgentDock-Portable.exe',
    available: false, // Set to true if a portable build is added
  },
  {
    platform: 'macos',
    architecture: 'Apple Silicon (M1/M2/M3)',
    type: 'macOS App (.dmg)',
    version: 'latest',
    url: 'https://github.com/crossainthero-lab/AgentDock/releases/latest/download/AgentDock-macOS-arm64.dmg',
    available: false,
  },
  {
    platform: 'macos',
    architecture: 'Intel',
    type: 'macOS App (.dmg)',
    version: 'latest',
    url: 'https://github.com/crossainthero-lab/AgentDock/releases/latest/download/AgentDock-macOS-x64.dmg',
    available: false,
  },
  {
    platform: 'linux',
    architecture: 'x64',
    type: 'AppImage',
    version: 'latest',
    url: 'https://github.com/crossainthero-lab/AgentDock/releases/latest/download/AgentDock-x86_64.AppImage',
    available: false,
  },
  {
    platform: 'linux',
    architecture: 'x64',
    type: 'Debian/Ubuntu (.deb)',
    version: 'latest',
    url: 'https://github.com/crossainthero-lab/AgentDock/releases/latest/download/AgentDock-amd64.deb',
    available: false,
  }
];

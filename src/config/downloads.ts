export type DownloadOption = {
  id: string;
  platform: 'Windows' | 'macOS' | 'Linux';
  title: string;
  version: string;
  type: string;
  arch?: string;
  size?: string;
  url: string;
  available: boolean;
  recommended?: boolean;
  experimental?: boolean;
  releaseNotesUrl?: string;
};

export type LegacyDownloadGroup = {
  version: string;
  assets: DownloadOption[];
};

export const currentDownloads = {
  windows: [
    {
      id: 'win-installer',
      platform: 'Windows',
      title: 'Windows Installer',
      version: '0.1.1',
      type: '.exe',
      arch: 'x64',
      url: 'https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.1/AgentDock.Setup.0.1.1.exe',
      available: true,
      recommended: true,
      releaseNotesUrl: 'https://github.com/crossainthero-lab/AgentDock/releases/tag/v0.1.1',
    },
    {
      id: 'win-portable',
      platform: 'Windows',
      title: 'Windows Portable',
      version: '0.1.1',
      type: '.exe',
      arch: 'x64',
      url: 'https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.1/AgentDock.0.1.1.exe',
      available: true,
      releaseNotesUrl: 'https://github.com/crossainthero-lab/AgentDock/releases/tag/v0.1.1',
    }
  ] as DownloadOption[],
  macos: [
    {
      id: 'mac-silicon-dmg',
      platform: 'macOS',
      title: 'Apple Silicon',
      version: '0.1.0',
      type: 'DMG',
      arch: 'arm64',
      url: 'https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.0_macOS/AgentDock-0.1.0-arm64.dmg',
      available: true,
      releaseNotesUrl: 'https://github.com/crossainthero-lab/AgentDock/releases/tag/v0.1.0_macOS',
    },
    {
      id: 'mac-silicon-zip',
      platform: 'macOS',
      title: 'Apple Silicon',
      version: '0.1.0',
      type: 'ZIP',
      arch: 'arm64',
      url: 'https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.0_macOS/AgentDock-0.1.0-arm64-mac.zip',
      available: true,
      releaseNotesUrl: 'https://github.com/crossainthero-lab/AgentDock/releases/tag/v0.1.0_macOS',
    },
    {
      id: 'mac-intel-dmg',
      platform: 'macOS',
      title: 'Intel Mac',
      version: '0.1.0',
      type: 'DMG',
      arch: 'x64',
      url: 'https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.0_macOS/AgentDock-0.1.0.dmg',
      available: true,
      releaseNotesUrl: 'https://github.com/crossainthero-lab/AgentDock/releases/tag/v0.1.0_macOS',
    },
    {
      id: 'mac-intel-zip',
      platform: 'macOS',
      title: 'Intel Mac',
      version: '0.1.0',
      type: 'ZIP',
      arch: 'x64',
      url: 'https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.0_macOS/AgentDock-0.1.0-mac.zip',
      available: true,
      releaseNotesUrl: 'https://github.com/crossainthero-lab/AgentDock/releases/tag/v0.1.0_macOS',
    }
  ] as DownloadOption[],
  linux: [] as DownloadOption[],
};

export const legacyDownloads: LegacyDownloadGroup[] = [
  {
    version: 'v0.1.0',
    assets: [
      {
        id: 'win-installer-legacy',
        platform: 'Windows',
        title: 'Windows Installer',
        version: '0.1.0',
        type: '.exe',
        arch: 'x64',
        url: 'https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.0_windows/AgentDock.Setup.0.1.0.exe',
        available: true,
        releaseNotesUrl: 'https://github.com/crossainthero-lab/AgentDock/releases/tag/v0.1.0_windows',
      },
      {
        id: 'win-portable-legacy',
        platform: 'Windows',
        title: 'Windows Portable',
        version: '0.1.0',
        type: '.exe',
        arch: 'x64',
        url: 'https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.0_windows/AgentDock.0.1.0.exe',
        available: true,
        releaseNotesUrl: 'https://github.com/crossainthero-lab/AgentDock/releases/tag/v0.1.0_windows',
      }
    ]
  }
];

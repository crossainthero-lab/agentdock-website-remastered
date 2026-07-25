import { DownloadOption, LegacyDownloadGroup } from '../config/downloads';

export type ReleasesData = {
  windows: DownloadOption[];
  macos: DownloadOption[];
  linux: DownloadOption[]; // we can keep it as empty for now, or as in current config
  legacy: LegacyDownloadGroup[];
  error?: boolean;
};

const CACHE_KEY = 'agentdock_releases_cache';
const CACHE_TIME = 1000 * 60 * 60; // 1 hour

function compareSemver(v1: string, v2: string) {
  const p1 = v1.split('.').map(Number);
  const p2 = v2.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const num1 = p1[i] || 0;
    const num2 = p2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}

export async function fetchReleases(): Promise<ReleasesData> {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TIME) {
        return parsed.data;
      }
    }

    const response = await fetch('https://api.github.com/repos/crossainthero-lab/AgentDock/releases');
    if (!response.ok) {
      throw new Error('Failed to fetch releases');
    }

    const releases = (await response.json()) as any[];
    
    if (!Array.isArray(releases)) {
      throw new Error('Expected array of releases');
    }

    const parsedReleases = parseReleases(releases);
    
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: parsedReleases
    }));

    return parsedReleases;
  } catch (error) {
    console.error('Error fetching GitHub releases:', error);
    return {
      windows: [],
      macos: [],
      linux: [],
      legacy: [],
      error: true
    };
  }
}

function parseReleases(releases: any[]): ReleasesData {
  const regex = /^v(\d+)\.(\d+)\.(\d+) - (macOS|Windows)( Preview)?$/;

  const validReleases = releases
    .filter(r => !r.draft && regex.test(r.name))
    .map(r => {
      const match = r.name.match(regex);
      const version = `${match[1]}.${match[2]}.${match[3]}`;
      const platform = match[4];
      const isPreview = !!match[5];
      return { ...r, parsedVersion: version, platform, isPreview };
    });

  const getAssetsForRelease = (r: any, platform: string, isPreview: boolean): DownloadOption[] => {
    const validAssets = r.assets.filter((a: any) => {
      const n = a.name.toLowerCase();
      if (n.endsWith('.blockmap') || n.endsWith('.sha256') || n.endsWith('.sig') || n.endsWith('.yml') || n.endsWith('.json')) return false;
      return true;
    });

    if (validAssets.length === 0) return [];

    let selectedAsset = null;
    let type = '';

    if (platform === 'Windows') {
      const installer = validAssets.find((a: any) => a.name.toLowerCase().includes('setup') && a.name.toLowerCase().endsWith('.exe'));
      const portable = validAssets.find((a: any) => !a.name.toLowerCase().includes('setup') && a.name.toLowerCase().endsWith('.exe'));
      
      selectedAsset = installer || portable || validAssets[0];
      type = '.exe';
    } else if (platform === 'macOS') {
      const dmg = validAssets.find((a: any) => a.name.toLowerCase().endsWith('.dmg'));
      const pkg = validAssets.find((a: any) => a.name.toLowerCase().endsWith('.pkg'));
      const zip = validAssets.find((a: any) => a.name.toLowerCase().endsWith('.zip'));
      
      selectedAsset = dmg || pkg || zip || validAssets[0];
      if (selectedAsset.name.toLowerCase().endsWith('.dmg')) type = 'DMG';
      else if (selectedAsset.name.toLowerCase().endsWith('.pkg')) type = 'PKG';
      else if (selectedAsset.name.toLowerCase().endsWith('.zip')) type = 'ZIP';
      else type = 'Archive';
    }

    if (!selectedAsset) return [];

    // Attempt to guess arch
    let arch = '';
    const n = selectedAsset.name.toLowerCase();
    if (n.includes('arm64') || n.includes('aarch64') || n.includes('silicon')) arch = 'arm64';
    else if (n.includes('x64') || n.includes('amd64') || n.includes('intel')) arch = 'x64';

    const versionDisplay = isPreview ? `${r.parsedVersion} Preview` : r.parsedVersion;

    return [{
      id: String(selectedAsset.id),
      platform: platform as 'Windows' | 'macOS',
      title: `${platform} ${isPreview ? 'Preview ' : ''}Download`,
      version: versionDisplay,
      type,
      arch,
      url: selectedAsset.browser_download_url,
      available: true,
      recommended: !isPreview,
      releaseNotesUrl: r.html_url
    }];
  };

  const platforms = ['Windows', 'macOS'];
  const result: ReleasesData = {
    windows: [],
    macos: [],
    linux: [],
    legacy: []
  };

  const legacyMap = new Map<string, DownloadOption[]>();

  for (const plat of platforms) {
    const platReleases = validReleases.filter(r => r.platform === plat);
    
    const stables = platReleases.filter(r => !r.isPreview).sort((a, b) => compareSemver(b.parsedVersion, a.parsedVersion));
    const previews = platReleases.filter(r => r.isPreview).sort((a, b) => compareSemver(b.parsedVersion, a.parsedVersion));

    const latestStable = stables[0];
    const latestPreview = previews[0];

    let mainRelease = null;
    let mainIsPreview = false;

    if (latestStable) {
      mainRelease = latestStable;
      mainIsPreview = false;
    } else if (latestPreview) {
      mainRelease = latestPreview;
      mainIsPreview = true;
    }

    if (mainRelease) {
      const opts = getAssetsForRelease(mainRelease, plat, mainIsPreview);
      if (plat === 'Windows') result.windows = opts;
      if (plat === 'macOS') result.macos = opts;
      
      // All others (stables and previews) are legacy except the main one
      for (const r of platReleases) {
        if (r.id !== mainRelease.id) {
          const legOpts = getAssetsForRelease(r, plat, r.isPreview);
          if (legOpts.length > 0) {
            const vKey = `v${r.parsedVersion}${r.isPreview ? ' Preview' : ''}`;
            const existing = legacyMap.get(vKey) || [];
            legacyMap.set(vKey, [...existing, ...legOpts]);
          }
        }
      }
    }
  }

  // Sort legacy versions by semver descending
  const sortedLegacyKeys = Array.from(legacyMap.keys()).sort((a, b) => {
    // a and b look like "v0.1.1" or "v0.1.2 Preview"
    const parseKey = (k: string) => {
      const match = k.match(/^v(\d+\.\d+\.\d+)( Preview)?$/);
      return { ver: match ? match[1] : '0.0.0', isPreview: match ? !!match[2] : false };
    };
    const ak = parseKey(a);
    const bk = parseKey(b);
    const sem = compareSemver(bk.ver, ak.ver);
    if (sem !== 0) return sem;
    if (ak.isPreview && !bk.isPreview) return 1;
    if (!ak.isPreview && bk.isPreview) return -1;
    return 0;
  });

  result.legacy = sortedLegacyKeys.map(k => ({
    version: k,
    assets: legacyMap.get(k) || []
  }));

  return result;
}

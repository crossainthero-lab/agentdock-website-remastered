import { useEffect, useMemo, useState } from 'react';
import { fallbackReleaseData } from '../config/downloads';
import type { ApiResponse, LegacyReleaseAsset, PlatformRelease, ReleaseManagement } from '../types/cms';
import { Download, Terminal, Copy, Check, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export function Downloads() {
  const [releaseData, setReleaseData] = useState<ReleaseManagement>(fallbackReleaseData);
  const [copied, setCopied] = useState(false);
  const [showLegacy, setShowLegacy] = useState(false);
  const platforms = useMemo(
    () => [...releaseData.platforms].filter((platform) => platform.isVisible).sort((a, b) => a.displayOrder - b.displayOrder),
    [releaseData.platforms],
  );

  const commands = `git clone https://github.com/crossainthero-lab/AgentDock.git
cd AgentDock
npm install
npm run dev
npm run build`;

  useEffect(() => {
    let cancelled = false;

    fetch('/api/releases')
      .then((response) => response.json() as Promise<ApiResponse<ReleaseManagement>>)
      .then((body) => {
        if (!cancelled && body.ok) {
          setReleaseData(body.data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReleaseData(fallbackReleaseData);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(commands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderPlatform = (platform: PlatformRelease, i: number) => (
    <section key={platform.platformKey}>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-white">{platform.displayName}</h2>
        <StatusPill status={platform.statusLabel} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        className={`p-6 border rounded-xl bg-[var(--color-ad-surface)] ${platform.isAvailable ? 'border-[var(--color-ad-border)] hover:border-[var(--color-accent-purple-border)] hover:shadow-[0_0_20px_var(--color-accent-purple-glow)]' : 'border-[var(--color-accent-purple-border)]'} transition-all`}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h3 className="text-white font-bold">{platform.displayName}</h3>
            <p className="mt-1 text-xs text-[var(--color-ad-text-muted)] font-medium">
              {platform.currentVersion ? formatVersion(platform.currentVersion) : platform.statusLabel}
              {platform.releaseDate ? ` • ${formatDate(platform.releaseDate)}` : ''}
            </p>
            {platform.releaseNote && (
              <p className="mt-3 text-sm text-[var(--color-ad-text-muted)] leading-relaxed">{platform.releaseNote}</p>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {platform.isAvailable && platform.primaryDownloadUrl && (
            <DownloadButton url={platform.primaryDownloadUrl} label={platform.primaryButtonLabel || 'Download'} primary />
          )}
          {platform.isAvailable && platform.secondaryDownloadUrl && (
            <DownloadButton url={platform.secondaryDownloadUrl} label={platform.secondaryButtonLabel || 'Download'} />
          )}
          {!platform.isAvailable && (
            <span className="inline-flex items-center rounded-md border border-[var(--color-ad-border)] px-4 py-2.5 text-sm font-bold text-[var(--color-ad-text-muted)]">
              {platform.statusLabel}
            </span>
          )}
        </div>
      </motion.div>
    </section>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto px-6 pt-24 pb-32 max-w-4xl"
    >
      <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">{releaseData.settings.mainHeading}</h1>
      <p className="text-[var(--color-ad-text-muted)] mb-6 text-lg">{releaseData.settings.mainDescription}</p>
      {releaseData.settings.announcement && (
        <div className="mb-8 rounded-md border border-[var(--color-accent-amber-border)] bg-[var(--color-accent-amber-soft)] px-4 py-3 text-sm text-[var(--color-accent-amber)]">
          {releaseData.settings.announcement}
        </div>
      )}

      <div className="space-y-16">
        {platforms.map(renderPlatform)}

        {releaseData.settings.showLegacyReleases && releaseData.legacyReleases.length > 0 && (
          <LegacyReleases
            assets={releaseData.legacyReleases.filter((asset) => asset.isVisible)}
            showLegacy={showLegacy}
            setShowLegacy={setShowLegacy}
          />
        )}

        <section className="pt-8 border-t border-[var(--color-ad-border)]">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Terminal className="w-6 h-6 text-[var(--color-accent-purple)]" /> Install from source
          </h2>
          <p className="text-[var(--color-ad-text-muted)] mb-6 leading-relaxed">
            You can clone the repository and build AgentDock yourself. This is ideal if you want to contribute or if binary releases are not yet available for your system.
          </p>
          <div className="space-y-4">
            <div className="bg-[#050508] border border-[var(--color-ad-border)] rounded-xl p-5 relative group hover:border-[var(--color-accent-purple-border)] transition-colors">
              <button
                onClick={copyToClipboard}
                className="absolute top-4 right-4 p-2 rounded-md bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] text-[var(--color-ad-text-muted)] hover:text-white hover:bg-[var(--color-ad-surface-hover)] hover:border-[var(--color-accent-purple-border)] transition-all"
                aria-label="Copy code"
              >
                {copied ? <Check className="w-4 h-4 text-[var(--color-accent-purple)]" /> : <Copy className="w-4 h-4" />}
              </button>
              <pre className="text-sm text-[var(--color-ad-text-muted)] font-mono leading-loose overflow-x-auto whitespace-pre">{commands}</pre>
            </div>
            <p className="text-sm text-[var(--color-ad-text-muted)]">
              Check the <a href="https://github.com/crossainthero-lab/AgentDock" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent-purple)] font-medium underline hover:no-underline hover:text-[var(--color-accent-purple-hover)]">repository</a> for detailed build instructions.
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

function DownloadButton({ url, label, primary = false }: { url: string; label: string; primary?: boolean }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-md transition-all ${primary ? 'bg-[var(--color-accent-purple)] hover:bg-[var(--color-accent-purple-hover)] hover:shadow-[0_0_15px_var(--color-accent-purple-glow)] hover:scale-[1.02] active:scale-95' : 'bg-[var(--color-ad-surface-hover)] border border-[var(--color-accent-purple-border)] hover:bg-[var(--color-accent-purple-soft)] hover:border-[var(--color-accent-purple)] hover:scale-[1.02] active:scale-95'}`}
    >
      <Download className="w-4 h-4" /> {label}
    </a>
  );
}

function StatusPill({ status }: { status: PlatformRelease['statusLabel'] }) {
  const isAvailable = status === 'Available';
  return (
    <span className={`px-2.5 py-1 text-xs font-bold rounded-full tracking-wide uppercase ${isAvailable ? 'text-[var(--color-accent-green)] bg-[var(--color-accent-green-soft)] border border-[var(--color-accent-green-border)]' : 'text-[var(--color-accent-purple)] bg-[var(--color-accent-purple-soft)] border border-[var(--color-accent-purple-border)]'}`}>
      {status}
    </span>
  );
}

function LegacyReleases({
  assets,
  showLegacy,
  setShowLegacy,
}: {
  assets: LegacyReleaseAsset[];
  showLegacy: boolean;
  setShowLegacy: (showLegacy: boolean) => void;
}) {
  const groups = assets.reduce<Record<string, LegacyReleaseAsset[]>>((acc, asset) => {
    acc[asset.version] = [...(acc[asset.version] ?? []), asset];
    return acc;
  }, {});

  return (
    <section className="pt-8 border-t border-[var(--color-ad-border)]">
      <button
        onClick={() => setShowLegacy(!showLegacy)}
        className="w-full flex items-center justify-between p-5 bg-[var(--color-ad-surface)] hover:bg-[var(--color-ad-surface-hover)] border border-[var(--color-ad-border)] hover:border-[var(--color-accent-purple-border)] rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-purple)]"
        aria-expanded={showLegacy}
      >
        <span className="font-bold text-white">{showLegacy ? 'Hide legacy releases' : 'Show legacy releases'}</span>
        <motion.div animate={{ rotate: showLegacy ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <svg className="w-5 h-5 text-[var(--color-ad-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: showLegacy ? 'auto' : 0, opacity: showLegacy ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="pt-6 space-y-8">
          {Object.entries(groups).map(([version, groupAssets]) => (
            <div key={version} className="space-y-4">
              <h3 className="text-lg font-bold text-white pl-1">{version}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {groupAssets.map((asset) => (
                  <div key={asset.id} className="p-4 border border-[var(--color-ad-border)] bg-[#050508] rounded-lg hover:border-gray-600 transition-colors">
                    <div className="mb-3">
                      <div className="font-medium text-sm text-gray-200">{asset.title} <span className="text-gray-500 ml-1">({asset.platform})</span></div>
                      <div className="text-xs text-gray-500 mt-1">{asset.arch ? `${asset.arch} • ` : ''}{asset.fileType}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <a href={asset.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[var(--color-accent-purple)] hover:text-[var(--color-accent-purple-hover)] underline hover:no-underline flex items-center gap-1.5 transition-colors">
                        <Download className="w-3.5 h-3.5" /> {asset.buttonLabel || 'Download'}
                      </a>
                      {asset.releaseNotesUrl && (
                        <a href={asset.releaseNotesUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-gray-400 hover:text-white underline hover:no-underline flex items-center gap-1 transition-colors">
                          <ExternalLink className="w-3 h-3" /> View release notes
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function formatVersion(version: string): string {
  return version.startsWith('v') ? version : `v${version}`;
}

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

import { useState } from 'react';
import { currentDownloads, legacyDownloads } from '../config/downloads';
import { Download, Terminal, Copy, Check, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export function Downloads() {
  const windows = currentDownloads.windows;
  const macos = currentDownloads.macos;
  const linux = currentDownloads.linux;
  
  const [copied, setCopied] = useState(false);
  const [showLegacy, setShowLegacy] = useState(false);

  const commands = `git clone https://github.com/crossainthero-lab/AgentDock.git
cd AgentDock
npm install
npm run dev
npm run build`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(commands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderCurrentAsset = (d: any, i: number, delayOffset: number = 0) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delayOffset + i * 0.1 }}
      key={d.id} className="p-6 border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] rounded-xl flex flex-col hover:border-[var(--color-accent-purple-border)] hover:shadow-[0_0_20px_var(--color-accent-purple-glow)] transition-all relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-bold">{d.title}</h3>
            {d.recommended && (
              <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-[var(--color-accent-purple)] rounded-full tracking-wide uppercase">Recommended</span>
            )}
          </div>
          <p className="text-xs text-[var(--color-ad-text-muted)] font-medium">v{d.version} &bull; {d.arch ? `${d.arch} \u2022 ` : ''}{d.type}</p>
        </div>
      </div>
      
      <div className="mt-auto pt-5 relative z-10 space-y-3">
        {d.available && (
          <a href={d.url} className={`w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-md transition-all ${d.recommended ? 'bg-[var(--color-accent-purple)] hover:bg-[var(--color-accent-purple-hover)] hover:shadow-[0_0_15px_var(--color-accent-purple-glow)] hover:scale-[1.02] active:scale-95' : 'bg-[var(--color-ad-surface-hover)] border border-[var(--color-accent-purple-border)] hover:bg-[var(--color-accent-purple-soft)] hover:border-[var(--color-accent-purple)] hover:scale-[1.02] active:scale-95'}`}>
            <Download className="w-4 h-4" /> Download {d.type}
          </a>
        )}
        {d.releaseNotesUrl && (
          <div className="text-center">
            <a href={d.releaseNotesUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-ad-text-muted)] hover:text-white transition-colors">
              <ExternalLink className="w-3 h-3" /> View release notes
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto px-6 pt-24 pb-32 max-w-4xl"
    >
      <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Download AgentDock</h1>
      <p className="text-[var(--color-ad-text-muted)] mb-12 text-lg">Available for Windows, macOS, and Linux (Experimental).</p>

      <div className="space-y-16">
        {/* Windows */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            Windows
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {windows.map((d, i) => renderCurrentAsset(d, i))}
          </div>
        </section>

        {/* macOS */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            macOS
          </h2>
          {macos.some(d => d.available) ? (
            <div className="grid sm:grid-cols-2 gap-5">
              {macos.map((d, i) => renderCurrentAsset(d, i, 0.2))}
            </div>
          ) : (
            <div className="p-6 border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] rounded-xl">
              <p className="text-[var(--color-ad-text-muted)] text-sm font-medium">macOS builds are currently being tested. Please build from source.</p>
            </div>
          )}
        </section>

        {/* Linux */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-white">Linux</h2>
            <span className="px-2.5 py-1 text-xs font-bold text-[var(--color-accent-purple)] bg-[var(--color-accent-purple-soft)] border border-[var(--color-accent-purple-border)] rounded-full tracking-wide uppercase">Experimental</span>
          </div>
          {linux.some(d => d.available) ? (
            <div className="grid sm:grid-cols-2 gap-5">
              {linux.map((d, i) => renderCurrentAsset(d, i, 0.4))}
            </div>
          ) : (
            <div className="p-6 border border-[var(--color-accent-purple-border)] bg-[var(--color-accent-purple-soft)] rounded-xl">
              <p className="text-white text-sm font-medium">Linux builds are currently experimental. Please install from source below.</p>
            </div>
          )}
        </section>

        {/* Legacy Releases */}
        {legacyDownloads.length > 0 && (
          <section className="pt-8 border-t border-[var(--color-ad-border)]">
            <button 
              onClick={() => setShowLegacy(!showLegacy)}
              className="w-full flex items-center justify-between p-5 bg-[var(--color-ad-surface)] hover:bg-[var(--color-ad-surface-hover)] border border-[var(--color-ad-border)] hover:border-[var(--color-accent-purple-border)] rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-purple)]"
              aria-expanded={showLegacy}
            >
              <span className="font-bold text-white">{showLegacy ? 'Hide legacy releases' : 'Show legacy releases'}</span>
              <motion.div
                animate={{ rotate: showLegacy ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
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
                {legacyDownloads.map((group) => (
                  <div key={group.version} className="space-y-4">
                    <h3 className="text-lg font-bold text-white pl-1">{group.version}</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {group.assets.map((asset) => (
                        <div key={asset.id} className="p-4 border border-[var(--color-ad-border)] bg-[#050508] rounded-lg hover:border-gray-600 transition-colors group/legacy">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="font-medium text-sm text-gray-200">{asset.title} <span className="text-gray-500 ml-1">({asset.platform})</span></div>
                              <div className="text-xs text-gray-500 mt-1">{asset.arch ? `${asset.arch} \u2022 ` : ''}{asset.type}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <a href={asset.url} className="text-xs font-bold text-[var(--color-accent-purple)] hover:text-[var(--color-accent-purple-hover)] underline hover:no-underline flex items-center gap-1.5 transition-colors">
                              <Download className="w-3.5 h-3.5" /> Download
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
        )}

        {/* Source */}
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
              <pre className="text-sm text-[var(--color-ad-text-muted)] font-mono leading-loose overflow-x-auto whitespace-pre">
{`git clone https://github.com/crossainthero-lab/AgentDock.git
cd AgentDock
npm install
npm run dev
npm run build`}
              </pre>
            </div>
            <p className="text-sm text-[var(--color-ad-text-muted)]">Check the <a href="https://github.com/crossainthero-lab/AgentDock" className="text-[var(--color-accent-purple)] font-medium underline hover:no-underline hover:text-[var(--color-accent-purple-hover)]">repository</a> for detailed build instructions.</p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

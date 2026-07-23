import { useState } from 'react';
import { downloads } from '../config/downloads';
import { Download, Terminal, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';

export function Downloads() {
  const windows = downloads.filter(d => d.platform === 'Windows');
  const macos = downloads.filter(d => d.platform === 'macOS');
  const linux = downloads.filter(d => d.platform === 'Linux');
  const [copied, setCopied] = useState(false);

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto px-6 pt-24 pb-32 max-w-4xl"
    >
      <h1 className="text-4xl font-bold text-white mb-4">Download AgentDock</h1>
      <p className="text-[var(--color-ad-text-muted)] mb-16 text-lg">Available for Windows, macOS, and Linux (Experimental).</p>

      <div className="space-y-16">
        {/* Windows */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            Windows
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {windows.map((d, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                key={d.id} className="p-6 border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] rounded-lg flex flex-col hover:border-[var(--color-accent-purple-border)] hover:shadow-[0_0_20px_var(--color-accent-purple-glow)] transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-medium">{d.title}</h3>
                    <p className="text-xs text-[var(--color-ad-text-muted)] mt-1">v{d.version} &bull; {d.arch} &bull; {d.type}</p>
                  </div>
                </div>
                <div className="mt-auto pt-4">
                  {d.available && (
                    <a href={d.url} className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--color-accent-purple)] rounded-md hover:bg-[var(--color-accent-purple-hover)] hover:shadow-[0_0_15px_var(--color-accent-purple-glow)] hover:scale-[1.02] active:scale-95 transition-all">
                      <Download className="w-4 h-4" /> Download
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* macOS */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            macOS
          </h2>
          {macos.some(d => d.available) ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {macos.map((d, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                  key={d.id} className="p-6 border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] rounded-lg flex flex-col hover:border-[var(--color-accent-purple-border)] hover:shadow-[0_0_20px_var(--color-accent-purple-glow)] transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-medium">{d.title}</h3>
                      <p className="text-xs text-[var(--color-ad-text-muted)] mt-1">v{d.version} &bull; {d.arch} &bull; {d.type}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4">
                    {d.available && (
                      <a href={d.url} className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--color-ad-surface-hover)] border border-[var(--color-accent-purple-border)] rounded-md hover:bg-[var(--color-accent-purple-soft)] hover:border-[var(--color-accent-purple)] hover:scale-[1.02] active:scale-95 transition-all">
                        <Download className="w-4 h-4" /> Download
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-6 border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] rounded-lg">
              <p className="text-[var(--color-ad-text-muted)] text-sm">macOS builds are currently being tested. Please build from source.</p>
            </div>
          )}
        </section>

        {/* Linux */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-white">Linux</h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold text-[var(--color-accent-purple)] bg-[var(--color-accent-purple-soft)] border border-[var(--color-accent-purple-border)] rounded-full tracking-wide">Experimental</span>
          </div>
          {linux.some(d => d.available) ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {linux.map((d, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                  key={d.id} className="p-6 border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] rounded-lg flex flex-col hover:border-[var(--color-accent-purple-border)] hover:shadow-[0_0_20px_var(--color-accent-purple-glow)] transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-medium">{d.title}</h3>
                      <p className="text-xs text-[var(--color-ad-text-muted)] mt-1">v{d.version} &bull; {d.arch} &bull; {d.type}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4">
                    {d.available && (
                      <a href={d.url} className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--color-ad-surface-hover)] border border-[var(--color-accent-purple-border)] rounded-md hover:bg-[var(--color-accent-purple-soft)] hover:border-[var(--color-accent-purple)] hover:scale-[1.02] active:scale-95 transition-all">
                        <Download className="w-4 h-4" /> Download
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-6 border border-[var(--color-accent-purple-border)] bg-[var(--color-accent-purple-soft)] rounded-lg">
              <p className="text-[var(--color-ad-text-muted)] text-sm">Linux builds are currently experimental. Please install from source below.</p>
            </div>
          )}
        </section>

        {/* Source */}
        <section className="pt-8 border-t border-[var(--color-ad-border)]">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[var(--color-accent-purple)]" /> Install from source
          </h2>
          <p className="text-sm text-[var(--color-ad-text-muted)] mb-6 leading-relaxed">
            You can clone the repository and build AgentDock yourself. This is ideal if you want to contribute or if binary releases are not yet available for your system.
          </p>
          <div className="space-y-4">
            <div className="bg-[#050508] border border-[var(--color-ad-border)] rounded-md p-4 relative group hover:border-[var(--color-accent-purple-border)] transition-colors">
              <button 
                onClick={copyToClipboard}
                className="absolute top-3 right-3 p-2 rounded-md bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] text-[var(--color-ad-text-muted)] hover:text-white hover:bg-[var(--color-ad-surface-hover)] hover:border-[var(--color-accent-purple-border)] transition-all"
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
            <p className="text-xs text-[var(--color-ad-text-muted)]">Check the <a href="https://github.com/crossainthero-lab/AgentDock" className="text-[var(--color-accent-purple)] underline hover:no-underline hover:text-[var(--color-accent-purple-hover)]">repository</a> for detailed build instructions.</p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

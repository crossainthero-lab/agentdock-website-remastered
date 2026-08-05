import { motion } from 'motion/react';
import { Download, Monitor, Apple, Terminal, Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { downloadsConfig, DownloadLink } from '../config/downloads';

export function Downloads() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderDownloadSection = (
    title: string, 
    icon: React.ReactNode, 
    platform: 'windows' | 'macos' | 'linux',
    comingSoonMessage: string
  ) => {
    const links = downloadsConfig.filter(link => link.platform === platform);
    const hasAvailable = links.some(link => link.available);

    return (
      <div className="glass-panel p-8 rounded-2xl border mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white">
            {icon}
          </div>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
        </div>

        {hasAvailable ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {links.map((link, i) => (
              <div key={i} className="flex flex-col gap-2">
                {link.available ? (
                  <a
                    href={link.url}
                    className="flex flex-col gap-1 p-4 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.06] hover:border-white/10 transition-colors"
                  >
                    <span className="font-medium text-white flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      {link.type}
                    </span>
                    <span className="text-sm text-gray-400">{link.architecture}</span>
                  </a>
                ) : (
                  <div className="flex flex-col gap-1 p-4 bg-white/[0.01] border border-white/5 rounded-xl opacity-60">
                    <span className="font-medium text-gray-300 flex items-center gap-2">
                      {link.type}
                    </span>
                    <span className="text-sm text-gray-500">{link.architecture} - Coming soon</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl text-center">
            <p className="text-gray-400">{comingSoonMessage}</p>
          </div>
        )}
      </div>
    );
  };

  const gitCommands = [
    { id: 'clone', text: 'git clone https://github.com/crossainthero-lab/AgentDock.git' },
    { id: 'cd', text: 'cd AgentDock' },
    { id: 'install', text: 'npm install' },
    { id: 'start', text: 'npm run dev' },
    { id: 'build', text: 'npm run build' }
  ];

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4"
          >
            Download AgentDock
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Bring coding agents into one unified desktop workspace.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {renderDownloadSection("Windows", <Monitor className="w-6 h-6" />, "windows", "Windows version coming soon.")}
          {renderDownloadSection("macOS", <Apple className="w-6 h-6" />, "macos", "macOS version coming soon.")}
          {renderDownloadSection("Linux", <Terminal className="w-6 h-6" />, "linux", "Linux version coming soon.")}

          {/* Install from Source */}
          <div className="glass-panel p-8 rounded-2xl border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white">
                <Terminal className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Install from source</h2>
            </div>
            <p className="text-gray-400 mb-6">
              For developers who want to run AgentDock directly from the source code.
            </p>
            <div className="space-y-3">
              {gitCommands.map((cmd, i) => (
                <div key={i} className="flex items-center justify-between bg-[#000000] border border-white/10 rounded-lg p-4 group">
                  <code className="text-sm text-gray-300 font-mono">{cmd.text}</code>
                  <button
                    onClick={() => copyToClipboard(cmd.text, cmd.id)}
                    className="text-gray-500 hover:text-white transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied === cmd.id ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

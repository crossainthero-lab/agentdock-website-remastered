import { motion } from 'motion/react';
import { Terminal, Folder, GitMerge, FileCode2, Play, Circle, ArrowRight, Github, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero({ onOpenJoinPro, onOpenContact }: { onOpenJoinPro: () => void; onOpenContact: () => void }) {
  return (
    <section className="pt-24 pb-12 px-6 relative overflow-hidden" id="product">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10 opacity-50" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] -z-10 opacity-50" />

      <div className="max-w-5xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Link
            to="/aigency"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-gray-300 font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            AIgency is coming - learn more
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-semibold tracking-tight text-white leading-tight"
        >
          Your coding agents. <br className="hidden md:block" />
          <span className="text-gradient">One workspace.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
        >
          AgentDock is a local-first desktop interface for running Claude Code, OpenAI Codex, and Google Antigravity across your projects. Users install and authenticate their own coding-agent CLIs.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <a
            href="https://github.com/crossainthero-lab/AgentDock"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-black hover:bg-gray-100 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Github className="w-5 h-5" />
            View on GitHub
          </a>
          <button
            onClick={onOpenJoinPro}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white hover:bg-blue-500 rounded-lg font-medium transition-colors"
          >
            Join AgentDock Pro
          </button>
          <button
            onClick={onOpenContact}
            className="w-full sm:w-auto px-8 py-3.5 bg-white/5 text-white border border-white/10 hover:bg-white/10 rounded-lg font-medium transition-colors"
          >
            Contact
          </button>
          <Link
            to="/downloads"
            className="w-full sm:w-auto px-8 py-3.5 bg-white/5 text-white border border-white/10 hover:bg-white/10 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download AgentDock
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 relative mx-auto w-full max-w-5xl glass-panel rounded-xl border border-white/10 overflow-hidden shadow-[0_0_80px_-20px_rgba(59,130,246,0.3)] text-left"
        >
          <div className="bg-white/5 border-b border-white/10 h-12 flex items-center px-4 justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
              <Folder className="w-4 h-4" />
              storefront
            </div>
            <div className="w-16" />
          </div>

          <div className="flex flex-col md:flex-row h-[600px] md:h-[500px]">
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-black/40 flex flex-col shrink-0">
              <div className="p-4 border-b border-white/10 text-xs font-semibold text-gray-500 tracking-wider uppercase">
                Active Agents
              </div>
              <div className="p-2 space-y-1">
                <div className="flex items-center gap-3 px-3 py-2 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-sm font-medium">Claude</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:bg-white/5 rounded-md cursor-pointer transition-colors">
                  <div className="w-2 h-2 rounded-full bg-gray-600" />
                  <span className="text-sm font-medium">Codex</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:bg-white/5 rounded-md cursor-pointer transition-colors">
                  <div className="w-2 h-2 rounded-full bg-gray-600" />
                  <span className="text-sm font-medium">Antigravity</span>
                </div>
              </div>

              <div className="mt-auto p-4 border-t border-white/10">
                <div className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-3">
                  Changed Files
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-yellow-400/90">
                    <FileCode2 className="w-4 h-4" />
                    <span className="truncate">src/components/Nav.tsx</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-400/90">
                    <FileCode2 className="w-4 h-4" />
                    <span className="truncate">src/index.css</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-[#05050A]">
              <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3 min-w-0">
                  <Circle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="font-medium text-gray-200 truncate">Task: Fix the navbar on mobile</span>
                </div>
                <button className="hidden sm:flex text-xs font-medium bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors items-center gap-2">
                  <GitMerge className="w-3 h-3" />
                  Continue with another agent
                </button>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col p-6 gap-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium">You</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 text-sm text-gray-300">
                    The mobile menu is overflowing when opened. Please fix the layout and add a blur backdrop.
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                    <span className="text-xs font-medium">CC</span>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl rounded-tl-none p-4 text-sm text-gray-300 space-y-3 w-full max-w-2xl">
                    <p>I'll fix the mobile navbar overflow and add the backdrop blur. I'm modifying <code className="bg-black/30 px-1 py-0.5 rounded text-blue-300">Nav.tsx</code> and the CSS.</p>

                    <div className="bg-black/40 rounded border border-white/10 p-3 font-mono text-xs text-gray-400">
                      <div className="flex items-center gap-2 mb-2 text-gray-500">
                        <Terminal className="w-3 h-3" />
                        <span>Applying changes...</span>
                      </div>
                      <div className="text-green-400">+ Added fixed positioning</div>
                      <div className="text-green-400">+ Added backdrop blur</div>
                      <div className="text-yellow-400">~ Updated z-index hierarchy</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask Claude to do something..."
                    className="w-full bg-black/50 border border-white/10 rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50"
                    readOnly
                  />
                  <button className="absolute right-2 top-2 p-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-md transition-colors">
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <p className="text-sm font-medium text-gray-500 mt-6 tracking-wide uppercase">
          Multiple agents. One project.
        </p>
      </div>
    </section>
  );
}

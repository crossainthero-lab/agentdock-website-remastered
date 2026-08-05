import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LayoutTemplate, Github } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Navbar({ onOpenJoinPro, onOpenContact }: { onOpenJoinPro: () => void; onOpenContact: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'AgentDock Pro', path: '/pro' },
    { name: 'AIgency', path: '/aigency' },
    { name: 'Blog', path: '/blog' },
    { name: 'Downloads', path: '/downloads' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-[#05050A]/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 cursor-pointer" onClick={closeMobileMenu}>
            <LayoutTemplate className="w-6 h-6 text-blue-500" />
            <span className="font-semibold text-lg tracking-tight">AgentDock</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm transition-colors flex items-center gap-1.5 ${
                  location.pathname === link.path ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onOpenContact}
              className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
            >
              Contact
            </button>
            <button
              onClick={onOpenJoinPro}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors border border-blue-400/20"
            >
              Join AgentDock Pro
            </button>
            <a
              href="https://github.com/crossainthero-lab/AgentDock"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors border border-white/5 flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>

          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 bg-[#05050A]/95 backdrop-blur-lg border-b border-white/10 z-30 md:hidden p-6 shadow-2xl"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`text-left text-lg transition-colors flex items-center gap-2 ${
                    location.pathname === link.path ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  onOpenContact();
                  closeMobileMenu();
                }}
                className="text-left text-lg text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              >
                Contact
              </button>
              <button
                onClick={() => {
                  onOpenJoinPro();
                  closeMobileMenu();
                }}
                className="bg-blue-600 text-white text-center font-medium px-4 py-3 rounded-lg transition-colors mt-2"
              >
                Join AgentDock Pro
              </button>
              <a
                href="https://github.com/crossainthero-lab/AgentDock"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black text-center font-medium px-4 py-3 rounded-lg transition-colors mt-2 flex items-center justify-center gap-2"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

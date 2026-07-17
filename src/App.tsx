import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { HowItWorks } from './components/HowItWorks';
import { AIgency } from './components/AIgency';
import { AIgencyExample } from './components/AIgencyExample';
import { Features } from './components/Features';
import { Agents } from './components/Agents';
import { Roadmap } from './components/Roadmap';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { WaitlistModal } from './components/WaitlistModal';

export default function App() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const openWaitlist = () => setIsWaitlistOpen(true);
  const closeWaitlist = () => setIsWaitlistOpen(false);

  return (
    <div className="min-h-screen bg-[#05050A] font-sans selection:bg-blue-500/30">
      <Navbar onOpenWaitlist={openWaitlist} />
      
      <main>
        <Hero onOpenWaitlist={openWaitlist} />
        <Problem />
        <Solution />
        <HowItWorks />
        <Agents />
        <AIgency />
        <AIgencyExample />
        <Features />
        <Roadmap />
        <CTA onOpenWaitlist={openWaitlist} />
      </main>

      <Footer onOpenWaitlist={openWaitlist} />
      
      <WaitlistModal isOpen={isWaitlistOpen} onClose={closeWaitlist} />
    </div>
  );
}

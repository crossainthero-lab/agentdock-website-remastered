import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { Features } from '../components/Features';
import { Agents } from '../components/Agents';
import { CTA } from '../components/CTA';

export function Home({ onOpenJoinPro, onOpenContact }: { onOpenJoinPro: () => void; onOpenContact: () => void }) {
  return (
    <>
      <Hero onOpenJoinPro={onOpenJoinPro} onOpenContact={onOpenContact} />
      <HowItWorks />
      <Features />
      <Agents />
      <CTA onOpenJoinPro={onOpenJoinPro} onOpenContact={onOpenContact} />
    </>
  );
}

import React from 'react';
import { WaitlistForm } from '../components/WaitlistForm';
import { SectionHeading } from '../components/ui';

export function Waitlist() {
  return (
    <div className="pt-32 pb-24 px-6 flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <SectionHeading 
          title="Join the Waitlist" 
          subtitle="Sign up for early access to AgentDock Pro and AIgency."
          className="text-center"
        />
        <div className="p-8 rounded-xl border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)]">
          <WaitlistForm />
        </div>
      </div>
    </div>
  );
}

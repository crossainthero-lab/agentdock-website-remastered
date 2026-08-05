import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { analytics } from '../lib/analytics';
import { Modal } from './Modal';

interface JoinProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const agents = ['Claude', 'Codex', 'Gemini or Antigravity'];

export function JoinProModal({ isOpen, onClose }: JoinProModalProps) {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [intendedUse, setIntendedUse] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');

  useEffect(() => {
    if (isOpen) analytics.track('join_pro_form_opened');
  }, [isOpen]);

  const toggleAgent = (agent: string) => {
    setSelectedAgents((current) => (current.includes(agent) ? current.filter((item) => item !== agent) : [...current, agent]));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (state === 'submitting') return;
    if (!name.trim() || !email.trim() || !intendedUse.trim() || selectedAgents.length === 0) {
      setError('Please complete all required fields.');
      setState('error');
      return;
    }

    setState('submitting');
    setError('');
    const response = await fetch('/api/join-pro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        intendedUse,
        selectedAgents,
        message: message || undefined,
        sourcePage: window.location.href,
        anonymousSessionId: analytics.sessionId,
        website,
      }),
    });
    const body = (await response.json().catch(() => null)) as { success?: boolean; message?: string } | null;
    if (response.ok && body?.success) {
      analytics.track('join_pro_form_submitted');
      setState('success');
      return;
    }
    setError(body?.message || 'Could not submit request. Please try again.');
    setState('error');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join AgentDock Pro" maxWidth="max-w-xl">
      {state === 'success' ? (
        <div className="py-8 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
          <h3 className="mb-2 text-xl font-semibold">Your AgentDock Pro request has been received.</h3>
          <p className="text-sm text-gray-400">We will contact you with access details.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {state === 'error' && (
            <div className="flex gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-gray-300">Name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} required className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-blue-500" />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-gray-300">Email</span>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-blue-500" />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1 block text-gray-300">What would you use AgentDock for?</span>
            <textarea value={intendedUse} onChange={(event) => setIntendedUse(event.target.value)} required rows={3} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-blue-500" />
          </label>
          <fieldset>
            <legend className="mb-2 text-sm text-gray-300">Agents used</legend>
            <div className="flex flex-wrap gap-2">
              {agents.map((agent) => (
                <label key={agent} className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 hover:bg-white/10">
                  <input type="checkbox" checked={selectedAgents.includes(agent)} onChange={() => toggleAgent(agent)} className="accent-blue-500" />
                  {agent}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="block text-sm">
            <span className="mb-1 block text-gray-300">Optional message</span>
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={2} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-blue-500" />
          </label>
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} className="hidden" aria-hidden="true" />
          <button disabled={state === 'submitting'} className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 font-medium text-black hover:bg-gray-100 disabled:opacity-60">
            {state === 'submitting' && <Loader2 className="h-4 w-4 animate-spin" />}
            Join AgentDock Pro
          </button>
        </form>
      )}
    </Modal>
  );
}

import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { analytics } from '../lib/analytics';
import { Modal } from './Modal';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const reasons = ['AgentDock Pro access', 'Product question', 'Business or partnership', 'Technical question', 'Something else'];

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [website, setWebsite] = useState('');
  const reachedFinal = useRef(false);
  const submitted = useRef(false);

  useEffect(() => {
    if (isOpen) {
      analytics.track('contact_flow_opened');
      setStep(1);
      setState('idle');
      setReason('');
      setMessage('');
      setName('');
      setEmail('');
      setError('');
      reachedFinal.current = false;
      submitted.current = false;
    } else if (reachedFinal.current && !submitted.current) {
      analytics.track('contact_flow_abandoned', { step: String(step) }, `${analytics.sessionId}:contact_abandoned`);
    }
  }, [isOpen, step]);

  const nextFromReason = () => {
    if (!reason) return;
    analytics.track('contact_reason_selected', { reason, contactReason: reason }, `${analytics.sessionId}:contact_reason:${reason}`);
    analytics.track('contact_details_step_reached', { step: 'details' }, `${analytics.sessionId}:contact_details`);
    setStep(2);
  };

  const nextFromMessage = () => {
    if (!message.trim()) return;
    if (!reachedFinal.current) {
      analytics.track('contact_final_step_reached', { step: 'final' }, `${analytics.sessionId}:contact_final`);
      reachedFinal.current = true;
    }
    setStep(3);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (state === 'submitting') return;
    if (!name.trim() || !email.trim()) return;
    setState('submitting');
    setError('');
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        contactReason: reason,
        message,
        sourcePage: window.location.href,
        anonymousSessionId: analytics.sessionId,
        website,
      }),
    });
    const body = (await response.json().catch(() => null)) as { success?: boolean; message?: string } | null;
    if (response.ok && body?.success) {
      submitted.current = true;
      analytics.track('contact_form_submitted', undefined, `${analytics.sessionId}:contact_submit`);
      setState('success');
      return;
    }
    setError(body?.message || 'Could not send contact request. Please try again.');
    setState('error');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact AgentDock" maxWidth="max-w-md">
      {state === 'success' ? (
        <div className="py-8 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
          <h3 className="mb-2 text-xl font-semibold">Message sent successfully.</h3>
          <p className="text-sm text-gray-400">We will get back to you shortly.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {state === 'error' && (
            <div className="flex gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {step === 1 && (
            <>
              <p className="text-sm text-gray-400">Why are you contacting AgentDock?</p>
              <div className="space-y-2">
                {reasons.map((item) => (
                  <button key={item} onClick={() => setReason(item)} className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition ${reason === item ? 'border-blue-400 bg-blue-500/15 text-white' : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'}`}>
                    {item}
                  </button>
                ))}
              </div>
              <button onClick={nextFromReason} disabled={!reason} className="ml-auto flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50">
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <label className="block text-sm">
                <span className="mb-2 block text-gray-300">What do you want help with?</span>
                <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={6} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-blue-500" />
              </label>
              <button onClick={nextFromMessage} disabled={!message.trim()} className="ml-auto flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50">
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}
          {step === 3 && (
            <form onSubmit={submit} className="space-y-4">
              <button type="button" onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <label className="block text-sm">
                <span className="mb-1 block text-gray-300">Name</span>
                <input value={name} onChange={(event) => setName(event.target.value)} required className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-blue-500" />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-gray-300">Email</span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-blue-500" />
              </label>
              <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} className="hidden" aria-hidden="true" />
              <button disabled={state === 'submitting' || !name.trim() || !email.trim()} className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 font-medium text-black hover:bg-gray-100 disabled:opacity-60">
                {state === 'submitting' && <Loader2 className="h-4 w-4 animate-spin" />}
                Send Contact Request
              </button>
            </form>
          )}
        </div>
      )}
    </Modal>
  );
}

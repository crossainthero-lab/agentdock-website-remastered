import React, { useState, useRef, useEffect } from 'react';
import { WAITLIST_API_URL } from '../config/waitlist';
import { WaitlistRequest, WaitlistResponse } from '../types/waitlist';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type FormState = 'idle' | 'submitting' | 'success' | 'already-joined' | 'error';

export function WaitlistForm() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [useCase, setUseCase] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [useCaseError, setUseCaseError] = useState('');

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const useCaseRef = useRef<HTMLTextAreaElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const validate = () => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setUseCaseError('');

    if (!name.trim() || name.trim().length < 2) {
      setNameError('Name must be at least 2 characters.');
      isValid = false;
      if (isValid) nameRef.current?.focus();
    } else if (name.trim().length > 80) {
      setNameError('Name must be less than 80 characters.');
      isValid = false;
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      if (isValid) emailRef.current?.focus();
      isValid = false;
    }

    if (useCase.trim().length > 1000) {
      setUseCaseError('Use case must be less than 1,000 characters.');
      if (isValid) useCaseRef.current?.focus();
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formState === 'submitting') return;
    
    if (!validate()) {
      return;
    }

    setFormState('submitting');
    setErrorMessage('');
    setSuccessMessage('');

    const payload: WaitlistRequest = {
      name: name.trim(),
      email: email.trim(),
      useCase: useCase.trim() || undefined,
      website
    };

    try {
      const response = await fetch(WAITLIST_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 500 || response.status === 502 || response.status === 503) {
        throw new Error('Server error');
      }

      const data = await response.json().catch(() => null) as WaitlistResponse | null;

      if (!data) {
        throw new Error('Network error');
      }

      if (data.ok) {
        setFormState(data.alreadyJoined ? 'already-joined' : 'success');
        setSuccessMessage(data.message);
      } else {
        setFormState('error');
        setErrorMessage((data as any).error || 'An error occurred.');
      }
    } catch (error) {
      setFormState('error');
      setErrorMessage('The waitlist could not be updated. Please try again.');
    }
  };

  useEffect(() => {
    if ((formState === 'success' || formState === 'already-joined') && successRef.current) {
      successRef.current.focus();
    }
  }, [formState]);

  if (formState === 'success' || formState === 'already-joined') {
    return (
      <div 
        ref={successRef}
        tabIndex={-1}
        className="bg-[var(--color-ad-surface)] border border-[var(--color-accent-purple-border)] rounded-xl p-8 text-center max-w-xl mx-auto shadow-[0_0_20px_var(--color-accent-purple-glow)] focus:outline-none" 
        aria-live="polite"
      >
        <div className="w-12 h-12 bg-[var(--color-accent-purple-soft)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--color-accent-purple-border)]">
          <CheckCircle className="w-6 h-6 text-[var(--color-accent-purple)]" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{successMessage}</h3>
        <p className="text-[var(--color-ad-text-muted)] text-sm mb-6">
          We've recorded <span className="font-semibold text-white">{email}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-ad-surface)] border border-[var(--color-ad-border)] rounded-xl p-6 sm:p-8 max-w-xl mx-auto shadow-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid-texture.svg')] opacity-[0.03] pointer-events-none"></div>
      
      <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
        {formState === 'error' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 flex items-start gap-3" aria-live="assertive">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300 font-medium leading-relaxed">{errorMessage}</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="waitlist-name" className="text-sm font-bold text-white">Name</label>
          <input
            id="waitlist-name"
            ref={nameRef}
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError('');
            }}
            placeholder="Your name"
            autoComplete="name"
            aria-invalid={!!nameError}
            className={`px-4 py-2.5 bg-[var(--color-ad-bg)] border ${nameError ? 'border-red-500 focus:ring-red-500/20' : 'border-[var(--color-ad-border)] focus:border-[var(--color-accent-purple)] focus:ring-[var(--color-accent-purple-glow)]'} rounded-md text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all`}
          />
          {nameError && <span className="text-xs text-red-400" role="alert">{nameError}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="waitlist-email" className="text-sm font-bold text-white">Email address</label>
          <input
            id="waitlist-email"
            ref={emailRef}
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError('');
            }}
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!emailError}
            className={`px-4 py-2.5 bg-[var(--color-ad-bg)] border ${emailError ? 'border-red-500 focus:ring-red-500/20' : 'border-[var(--color-ad-border)] focus:border-[var(--color-accent-purple)] focus:ring-[var(--color-accent-purple-glow)]'} rounded-md text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all`}
          />
          {emailError && <span className="text-xs text-red-400" role="alert">{emailError}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="waitlist-usecase" className="text-sm font-bold text-white">What would you use AIgency for?</label>
            <span className="text-xs text-[var(--color-ad-text-muted)]">Optional</span>
          </div>
          <textarea
            id="waitlist-usecase"
            ref={useCaseRef}
            value={useCase}
            onChange={(e) => {
              setUseCase(e.target.value);
              if (useCaseError) setUseCaseError('');
            }}
            placeholder="Tell us how you would use multiple AI agents together."
            maxLength={1000}
            rows={3}
            aria-invalid={!!useCaseError}
            className={`px-4 py-2.5 bg-[var(--color-ad-bg)] border ${useCaseError ? 'border-red-500 focus:ring-red-500/20' : 'border-[var(--color-ad-border)] focus:border-[var(--color-accent-purple)] focus:ring-[var(--color-accent-purple-glow)]'} rounded-md text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all resize-none`}
          />
          <div className="flex items-center justify-between">
            {useCaseError ? (
              <span className="text-xs text-red-400" role="alert">{useCaseError}</span>
            ) : (
              <span></span>
            )}
            <span className="text-xs text-[var(--color-ad-text-muted)]">{useCase.length}/1000</span>
          </div>
        </div>

        {/* Honeypot */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="waitlist-website">Website</label>
          <input
            id="waitlist-website"
            type="text"
            tabIndex={-1}
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          disabled={formState === 'submitting'}
          className="mt-2 w-full px-8 py-3.5 text-sm font-bold text-white bg-[var(--color-accent-purple)] rounded-md hover:bg-[var(--color-accent-purple-hover)] hover:shadow-[0_0_20px_var(--color-accent-purple-glow)] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:active:scale-100 disabled:hover:shadow-none transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-purple)] focus:ring-offset-2 focus:ring-offset-[var(--color-ad-surface)]"
        >
          {formState === 'submitting' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="w-40 text-center">Joining waitlist…</span>
            </>
          ) : (
            <span className="w-40 text-center">Join the AIgency Waitlist</span>
          )}
        </button>
      </form>
    </div>
  );
}

import mermaid from 'mermaid';
import { useEffect, useId, useState } from 'react';

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'dark',
});

export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replaceAll(':', '');
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setSvg('');
    setError('');
    mermaid
      .render(`agentdock-${id}`, chart)
      .then((result) => {
        if (!cancelled) setSvg(result.svg);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Mermaid diagram could not be rendered.');
      });
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">{error}</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-4">
      {svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : <div className="h-32 animate-pulse rounded-lg bg-white/5" />}
    </div>
  );
}

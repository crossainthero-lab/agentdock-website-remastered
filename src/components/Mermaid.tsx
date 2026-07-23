import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { motion } from 'motion/react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    darkMode: true,
    background: '#0a0a0c',
    primaryColor: 'rgba(139, 92, 246, 0.1)',
    primaryBorderColor: '#8b5cf6',
    primaryTextColor: '#fff',
    lineColor: '#3b82f6',
    secondaryColor: 'rgba(59, 130, 246, 0.1)',
    secondaryBorderColor: '#3b82f6',
    tertiaryColor: 'rgba(16, 185, 129, 0.1)',
    tertiaryBorderColor: '#10b981',
    fontFamily: '"Inter", sans-serif',
  }
});

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const id = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let isMounted = true;

    const renderChart = async () => {
      try {
        const { svg } = await mermaid.render(id.current, chart);
        if (isMounted) {
          setSvg(svg);
          setError('');
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to render diagram');
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, isVisible]);

  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)' }} 
      whileInView={{ opacity: 1, filter: 'blur(0px)' }} 
      viewport={{ once: true }} 
      transition={{ duration: 0.8 }}
      ref={containerRef} 
      className="w-full overflow-x-auto overflow-y-hidden border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] rounded-xl p-4 sm:p-8 flex justify-center hover:border-[var(--color-accent-purple-border)] hover:shadow-[0_0_15px_var(--color-accent-purple-glow)] transition-all relative group"
    >
      {error ? (
        <div className="text-[var(--color-accent-amber)] text-sm font-mono p-4 bg-[var(--color-accent-amber-soft)] border border-[var(--color-accent-amber-border)] rounded-md">
          {error}
        </div>
      ) : svg ? (
        <div 
          className="w-full flex justify-center"
          dangerouslySetInnerHTML={{ __html: svg }} 
        />
      ) : (
        <div className="h-40 flex items-center justify-center text-[var(--color-ad-text-muted)] animate-pulse">
          Loading diagram...
        </div>
      )}
    </motion.div>
  );
}

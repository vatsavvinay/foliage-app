'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.12 }
    );

    const childrenEls = el.querySelectorAll('[data-reveal]');
    childrenEls.forEach((child) => obs.observe(child));

    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn('reveal-root', className)}>
      {children}
    </div>
  );
}

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/** Cinematic intro preloader — counts to 100 and reveals the WaxX mark. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);
  const markRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root_ = root.current;
    const count = countRef.current;
    if (!root_ || !count) return;

    if (prefersReduced) {
      gsap.set(root_, { display: 'none' });
      onDone();
      return;
    }

    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        onDone();
      },
    });

    tl.from(markRef.current, { y: 40, opacity: 0, duration: 0.7, ease: 'expo.out' })
      .to(
        counter,
        {
          v: 100,
          duration: 2,
          ease: 'power2.inOut',
          onUpdate: () => {
            count.textContent = String(Math.round(counter.v)).padStart(3, '0');
          },
        },
        '-=0.3',
      )
      .to(count, { opacity: 0, duration: 0.4 }, '+=0.2')
      .to(markRef.current, { y: -20, opacity: 0, duration: 0.6, ease: 'expo.in' }, '-=0.2')
      .to(
        root_,
        { yPercent: -100, duration: 0.9, ease: 'expo.inOut' },
        '-=0.3',
      )
      .set(root_, { display: 'none' });

    return () => {
      tl.kill();
    };
  }, [onDone]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-ink"
    >
      <div ref={markRef} className="flex flex-col items-center gap-6">
        <span className="xx-mark text-lime text-6xl md:text-8xl">XX</span>
        <span className="font-display text-2xl font-medium tracking-[0.3em] text-bone md:text-3xl">
          WAXX
        </span>
      </div>
      <span
        ref={countRef}
        className="absolute bottom-10 right-6 font-body text-sm tabular-nums text-ash-600 md:right-10"
      >
        000
      </span>
    </div>
  );
}

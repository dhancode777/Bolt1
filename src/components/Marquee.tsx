import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  'Digital Experiences',
  'Creative Development',
  'Motion Design',
  'Brand Identity',
  'Interactive Websites',
  '3D & WebGL',
  'Art Direction',
];

/** Infinite marquee that speeds up with scroll velocity — a kinetic divider band. */
export function Marquee() {
  const track = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const totalWidth = el.scrollWidth / 2;
    const tween = gsap.to(el, {
      x: -totalWidth,
      duration: 26,
      ease: 'none',
      repeat: -1,
    });

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const v = self.getVelocity();
        gsap.to(tween, { timeScale: 1 + Math.min(Math.abs(v) / 1600, 3) });
      },
    });

    return () => {
      tween.kill();
      st.kill();
    };
  }, []);

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-ink py-6 md:py-8">
      <div ref={track} className="flex w-max items-center gap-10 whitespace-nowrap will-change-transform">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <div key={i} className="flex items-center gap-10">
            <span className="font-display text-3xl font-medium tracking-tight text-bone md:text-5xl">
              {item}
            </span>
            <span className="xx-mark text-lime text-3xl md:text-5xl">XX</span>
          </div>
        ))}
      </div>
    </section>
  );
}

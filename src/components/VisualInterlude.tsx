import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VisualCanvas } from './VisualCanvas';
import { splitText } from '@/lib/splitText';

gsap.registerPlugin(ScrollTrigger);

/** Interactive 3D visual interlude with scroll-responsive camera and X-form geometry. */
export function VisualInterlude() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const heading = el.querySelector('[data-visual-heading]') as HTMLElement;
      if (heading) {
        const split = splitText(heading);
        gsap.from(split.chars, {
          yPercent: 120,
          rotate: 6,
          opacity: 0,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.02,
          scrollTrigger: { trigger: heading, start: 'top 80%' },
        });
      }

      const caption = el.querySelectorAll('[data-visual-caption]');
      gsap.from(caption, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 70%' },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative h-[120svh] w-full overflow-hidden bg-ink">
      <VisualCanvas className="absolute inset-0 z-10 h-full w-full" />
      <div className="edge-glow pointer-events-none absolute inset-0 z-[5]" />

      <div className="relative z-20 mx-auto flex h-full max-w-[1600px] flex-col justify-center px-6 md:px-10">
        <p data-visual-caption className="mb-6 font-body text-xs uppercase tracking-[0.3em] text-ash-600">
          (Crafted in real-time — drag your cursor, scroll to transform)
        </p>
        <h2
          data-visual-heading
          className="max-w-[14ch] font-display text-display font-medium text-bone"
          aria-label="Where form meets feeling."
        >
          WHERE FORM MEETS FEELING.
        </h2>
        <p data-visual-caption className="mt-8 max-w-md font-body text-base leading-relaxed text-ash-600">
          Every WaxX build is rendered in the browser — no pre-rendered video. Geometry,
          light, and motion respond to you in real time.
        </p>
      </div>

      {/* Fade to next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-40 bg-gradient-to-t from-ink to-transparent" />
    </section>
  );
}

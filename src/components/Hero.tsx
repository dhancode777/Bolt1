import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { HeroCanvas } from './HeroCanvas';
import { useMagnetic } from '@/lib/useMagnetic';
import { splitText } from '@/lib/splitText';
import { scrollToSection } from '@/lib/useSmoothScroll';

gsap.registerPlugin(ScrollTrigger);

/** Full-screen immersive hero with 3D chrome sculpture and animated headline. */
export function Hero() {
  const root = useRef<HTMLElement | null>(null);
  const exploreRef = useMagnetic<HTMLButtonElement>(0.4);
  const talkRef = useMagnetic<HTMLAnchorElement>(0.4);
  const indicatorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tl = gsap.timeline({ delay: 0.2 });

    const headline = el.querySelector('[data-headline]') as HTMLElement;
    const split = splitText(headline);
    const intro = el.querySelectorAll('[data-hero-intro]');
    const status = el.querySelectorAll('[data-hero-status]');
    const buttons = el.querySelectorAll('[data-hero-btn]');

    if (prefersReduced) {
      gsap.set([split.chars, intro, status, buttons, indicatorRef.current], { opacity: 1 });
      split.cleanup();
      return;
    }

    tl.from(split.chars, {
      yPercent: 120,
      rotate: 6,
      opacity: 0,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.012,
    })
      .from(intro, { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out' }, '-=0.6')
      .from(status, { y: 20, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'expo.out' }, '-=0.7')
      .from(buttons, { y: 24, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'expo.out' }, '-=0.6')
      .from(indicatorRef.current, { y: 20, opacity: 0, duration: 0.8, ease: 'expo.out' }, '-=0.5');

    // Parallax: headline drifts up as you scroll; canvas fades
    const parallax = gsap.to(headline, {
      yPercent: -28,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    });
    const fade = gsap.to(el.querySelector('[data-hero-fade]'), {
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    });

    return () => {
      tl.kill();
      parallax.scrollTrigger?.kill();
      parallax.kill();
      fade.scrollTrigger?.kill();
      fade.kill();
      split.cleanup();
    };
  }, []);

  return (
    <section id="hero" ref={root} className="relative h-[100svh] w-full overflow-hidden">
      {/* 3D chrome sculpture */}
      <HeroCanvas className="absolute inset-0 z-10 h-full w-full" />

      {/* Edge glow */}
      <div className="edge-glow pointer-events-none absolute inset-0 z-[5]" />

      {/* Content */}
      <div data-hero-fade className="relative z-20 flex h-full flex-col">
        {/* Top intro row */}
        <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-6 pt-28 md:px-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-7" data-hero-intro>
              <p className="mb-6 font-body text-sm uppercase tracking-[0.3em] text-ash-600">
                Creative Digital Studio — Est. 2014
              </p>
              <h1
                data-headline
                className="font-display text-mega font-medium text-bone"
                aria-label="We create digital experiences."
              >
                WE CREATE DIGITAL EXPERIENCES.
              </h1>
            </div>

            <div className="flex flex-col justify-end gap-8 md:col-span-5 md:items-end md:text-right">
              <p data-hero-intro className="max-w-xs font-body text-base leading-relaxed text-ash-600 md:max-w-sm">
                We build immersive digital experiences where design, motion, and code
                collide. Independent. Bold. Unconventional.
              </p>
              <div data-hero-status className="flex items-center gap-3 md:flex-col md:items-end md:gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
                </span>
                <span className="font-body text-xs uppercase tracking-[0.25em] text-ash-600">
                  Available for 2026
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row: buttons + scroll indicator */}
        <div className="mx-auto w-full max-w-[1600px] px-6 pb-10 md:px-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="flex flex-wrap items-center gap-4">
              <button
                ref={exploreRef}
                data-hero-btn
                data-cursor="hover"
                onClick={() => scrollToSection('#work')}
                className="magnetic group inline-flex items-center gap-3 rounded-full bg-lime px-6 py-3.5 text-sm font-medium text-ink transition-colors duration-300 hover:bg-bone"
              >
                Explore Our Work
                <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <a
                ref={talkRef}
                data-hero-btn
                data-cursor="hover"
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('#contact');
                }}
                className="magnetic inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3.5 text-sm transition-colors duration-300 hover:border-lime hover:text-lime"
              >
                Let&apos;s Talk
                <ArrowUpRight size={18} />
              </a>
            </div>

            <div
              ref={indicatorRef}
              className="flex items-center gap-3 text-ash-600"
            >
              <span className="font-body text-xs uppercase tracking-[0.25em]">Scroll</span>
              <ArrowDown size={16} className="animate-bounce text-lime" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

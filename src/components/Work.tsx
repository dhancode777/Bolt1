import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '@/data/projects';
import { splitText } from '@/lib/splitText';
import { scrollToSection } from '@/lib/useSmoothScroll';

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_BP = 1024;

/** Selected Work portfolio — pinned horizontal scroll on desktop, vertical on mobile. */
export function Work() {
  const root = useRef<HTMLElement | null>(null);
  const pinWrap = useRef<HTMLDivElement | null>(null);
  const track = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = root.current;
    const pinEl = pinWrap.current;
    const trackEl = track.current;
    if (!el || !pinEl || !trackEl) return;

    const ctx = gsap.context(() => {
      // Heading reveal
      const heading = el.querySelector('[data-work-heading]') as HTMLElement;
      if (heading) {
        const split = splitText(heading);
        gsap.from(split.chars, {
          yPercent: 120,
          rotate: 6,
          opacity: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.02,
          scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
        });
      }

      // Per-card image parallax (works in both layouts)
      const cards = gsap.utils.toArray<HTMLElement>('[data-project-card]');
      cards.forEach((card) => {
        const img = card.querySelector('[data-project-img]') as HTMLElement | null;
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.25 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          );
        }
      });
    }, el);

    // Horizontal pin scroll — set up separately so we can rebuild on resize.
    let horizontalTween: gsap.core.Tween | null = null;
    let horizontalST: ScrollTrigger | null = null;
    let maskTriggers: ScrollTrigger[] = [];

    const setupHorizontal = () => {
      if (window.innerWidth < DESKTOP_BP) return;

      // total distance = how far the track must slide so its right edge meets viewport right
      const totalScroll = trackEl.scrollWidth - window.innerWidth;
      if (totalScroll <= 0) return;

      const tween = gsap.to(trackEl, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: pinEl,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => {
            // keep the translate in sync if the width changed
            const dist = trackEl.scrollWidth - window.innerWidth;
            gsap.set(trackEl, { x: -Math.min(Math.max(window.scrollY, 0), dist) });
          },
        },
      });
      horizontalTween = tween;
      horizontalST = tween.scrollTrigger ?? null;

      // Clip-path image reveals driven by the horizontal animation
      const panels = gsap.utils.toArray<HTMLElement>('[data-project-card]');
      panels.forEach((panel) => {
        const mask = panel.querySelector('[data-project-mask]') as HTMLElement | null;
        if (!mask) return;
        const t = gsap.fromTo(
          mask,
          { scaleY: 1, transformOrigin: 'bottom' },
          {
            scaleY: 0,
            transformOrigin: 'bottom',
            ease: 'expo.inOut',
            duration: 1,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: 'left 75%',
              end: 'left 25%',
              scrub: true,
            },
          },
        );
        if (t.scrollTrigger) maskTriggers.push(t.scrollTrigger);
      });
    };

    const teardownHorizontal = () => {
      maskTriggers.forEach((t) => t.kill());
      maskTriggers = [];
      if (horizontalST) {
        horizontalST.kill();
        horizontalST = null;
      }
      if (horizontalTween) {
        horizontalTween.kill();
        horizontalTween = null;
      }
      gsap.set(trackEl, { x: 0, clearProps: 'x' });
    };

    const build = () => {
      teardownHorizontal();
      setupHorizontal();
      ScrollTrigger.refresh();
    };

    // Initial build after layout settles
    const initTimer = window.setTimeout(build, 60);

    // Rebuild across the desktop/mobile breakpoint
    let lastIsDesktop = window.innerWidth >= DESKTOP_BP;
    const onResize = () => {
      const isDesktop = window.innerWidth >= DESKTOP_BP;
      if (isDesktop !== lastIsDesktop) {
        lastIsDesktop = isDesktop;
        build();
      } else if (isDesktop) {
        // width changed but still desktop — refresh pin distance
        ScrollTrigger.refresh();
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(initTimer);
      window.removeEventListener('resize', onResize);
      teardownHorizontal();
      ctx.revert();
    };
  }, []);

  return (
    <section id="work" ref={root} className="relative bg-ink">
      {/* Section intro — normal flow, never pinned */}
      <div className="mx-auto max-w-[1600px] px-6 pt-24 md:px-10 md:pt-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 font-body text-xs uppercase tracking-[0.3em] text-ash-600">
              (Portfolio)
            </p>
            <h2
              data-work-heading
              className="font-display text-display font-medium text-bone"
              aria-label="Selected Work — 2026"
            >
              SELECTED WORK — 2026
            </h2>
          </div>
          <p className="max-w-sm font-body text-sm leading-relaxed text-ash-600">
            A curated selection of recent collaborations. Each project is a world of its own —
            built from concept to launch with obsessive craft.
          </p>
        </div>
      </div>

      {/* Pinned horizontal track — isolated so pinning never affects the heading */}
      <div ref={pinWrap} className="relative mt-16 md:mt-24 md:h-screen md:overflow-hidden">
        {/* progress hint (desktop only) */}
        <div className="pointer-events-none absolute left-6 top-6 z-30 hidden font-body text-xs uppercase tracking-[0.25em] text-ash-600 md:left-10 md:block">
          Scroll to explore →
        </div>

        <div
          ref={track}
          className="flex flex-col gap-16 px-6 pb-24 md:h-screen md:flex-row md:flex-nowrap md:items-center md:gap-8 md:px-10 md:pb-0"
        >
          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              data-project-card
              data-cursor="view"
              className="group relative flex w-full flex-col gap-5 md:w-[80vw] md:max-w-[1100px] md:flex-shrink-0"
            >
              <div className="img-reveal relative aspect-[16/10] w-full overflow-hidden md:aspect-[16/10]">
                <div
                  data-project-mask
                  className="absolute inset-0 z-10 origin-bottom scale-y-0 bg-lime"
                />
                <img
                  data-project-img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale-[20%] transition-all duration-700 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 z-20 flex items-end justify-between p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="font-body text-xs uppercase tracking-[0.25em] text-bone mix-blend-difference">
                    View Case Study
                  </span>
                  <ArrowUpRight size={28} className="text-bone mix-blend-difference" />
                </div>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-4xl font-medium tracking-tight text-bone transition-colors duration-300 group-hover:text-lime md:text-6xl">
                    {p.title}
                  </h3>
                  <p className="mt-1 font-body text-sm text-ash-600">{p.category}</p>
                </div>
                <div className="flex flex-col items-end gap-2 pt-2">
                  <span className="font-body text-xs uppercase tracking-[0.25em] text-ash-600">
                    0{i + 1} / 0{PROJECTS.length}
                  </span>
                  <span className="font-body text-xs text-ash-600">{p.year}</span>
                </div>
              </div>
              <p className="max-w-xl font-body text-sm leading-relaxed text-ash-600">
                {p.description}
              </p>
            </article>
          ))}

          {/* CTA panel at end of horizontal track */}
          <div className="flex w-full flex-col items-start justify-center gap-6 md:w-[60vw] md:flex-shrink-0 md:pl-10">
            <p className="font-body text-sm uppercase tracking-[0.25em] text-ash-600">
              More in the vault
            </p>
            <h3 className="font-display text-5xl font-medium leading-[0.9] text-bone md:text-7xl">
              Want to see
              <br />
              <span className="text-lime">everything?</span>
            </h3>
            <button
              onClick={() => scrollToSection('#contact')}
              data-cursor="hover"
              className="group mt-4 inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3.5 text-sm transition-colors duration-300 hover:border-lime hover:text-lime"
            >
              Start a project
              <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

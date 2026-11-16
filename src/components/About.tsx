import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText } from '@/lib/splitText';

gsap.registerPlugin(ScrollTrigger);

const CAPABILITIES = [
  'Digital Experiences',
  'Creative Development',
  'Interactive Websites',
  'Motion Design',
  'Brand Identities',
];

/** About section — oversized typography, staggered reveals, animated XX mark. */
export function About() {
  const root = useRef<HTMLElement | null>(null);
  const xxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const heading = el.querySelector('[data-about-heading]') as HTMLElement;
      if (heading) {
        const split = splitText(heading);
        gsap.from(split.chars, {
          yPercent: 120,
          rotate: 7,
          opacity: 0,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.015,
          scrollTrigger: { trigger: heading, start: 'top 80%' },
        });
      }

      const body = el.querySelectorAll('[data-about-body]');
      gsap.from(body, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 60%' },
      });

      const caps = el.querySelectorAll('[data-cap]');
      gsap.from(caps, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el.querySelector('[data-cap-list]'), start: 'top 75%' },
      });

      // Animated XX mark: continuous slow rotation + scroll-driven scale
      if (xxRef.current) {
        const xx = xxRef.current;
        gsap.to(xx, {
          rotate: 360,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={root} className="relative overflow-hidden bg-ink py-28 md:py-44">
      {/* Background giant XX */}
      <div
        ref={xxRef}
        className="pointer-events-none absolute -right-[20vw] top-1/2 -translate-y-1/2 select-none text-[50vw] font-display font-semibold leading-none text-white/[0.03] md:text-[40vw]"
        aria-hidden="true"
      >
        XX
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-10">
        <p className="mb-10 font-body text-xs uppercase tracking-[0.3em] text-ash-600">
          (About WaxX)
        </p>

        <h2
          data-about-heading
          className="max-w-[18ch] font-display text-display font-medium leading-[0.9] text-bone"
          aria-label="We don't follow. We create the shift."
        >
          WE DON'T FOLLOW. WE CREATE THE SHIFT.
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-10 md:mt-24 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5" data-about-body>
            <p className="font-body text-lg leading-relaxed text-bone">
              WaxX is an independent creative digital studio working at the intersection of
              design, technology, and story. We partner with ambitious brands to build the
              things other studios say can&apos;t be done.
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7" data-about-body>
            <p className="font-body text-base leading-relaxed text-ash-600">
              Since 2014 we&apos;ve shipped award-winning websites, interactive campaigns,
              and brand systems for names in fashion, automotive, architecture, and culture.
              Our work is recognized for its craft, its motion, and its refusal to look like
              anyone else.
            </p>
          </div>
        </div>

        {/* Capabilities list */}
        <div className="mt-20 md:mt-28" data-cap-list>
          <p className="mb-8 font-body text-xs uppercase tracking-[0.3em] text-ash-600">
            What we do
          </p>
          <ul className="flex flex-col border-t border-white/10">
            {CAPABILITIES.map((cap, i) => (
              <li
                key={cap}
                data-cap
                className="group flex items-center justify-between border-b border-white/10 py-6 transition-colors duration-300 hover:bg-white/[0.02] md:py-8"
                data-cursor="link"
              >
                <span className="font-display text-3xl font-medium tracking-tight text-bone transition-all duration-300 group-hover:translate-x-3 group-hover:text-lime md:text-5xl">
                  {cap}
                </span>
                <span className="font-body text-sm text-ash-600">
                  0{i + 1}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

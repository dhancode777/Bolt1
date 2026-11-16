import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { useMagnetic } from '@/lib/useMagnetic';
import { splitText } from '@/lib/splitText';

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Dribbble', href: 'https://dribbble.com' },
  { label: 'Behance', href: 'https://behance.net' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
];

/** Contact section — powerful headline, magnetic button, animated XX backdrop. */
export function Contact() {
  const root = useRef<HTMLElement | null>(null);
  const xxRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useMagnetic<HTMLAnchorElement>(0.5);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const heading = el.querySelector('[data-contact-heading]') as HTMLElement;
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

      const meta = el.querySelectorAll('[data-contact-meta]');
      gsap.from(meta, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 65%' },
      });

      // Animated XX backdrop
      if (xxRef.current) {
        gsap.to(xxRef.current, {
          rotate: 360,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
        gsap.fromTo(
          xxRef.current,
          { scale: 0.8 },
          {
            scale: 1.2,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={root} className="relative overflow-hidden bg-ink py-28 md:py-44">
      {/* Animated XX backdrop */}
      <div
        ref={xxRef}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[60vw] font-display font-semibold leading-none text-white/[0.025] md:text-[42vw]"
        aria-hidden="true"
      >
        XX
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 text-center md:px-10">
        <p data-contact-meta className="mb-10 font-body text-xs uppercase tracking-[0.3em] text-ash-600">
          (Contact)
        </p>

        <h2
          data-contact-heading
          className="mx-auto max-w-[16ch] font-display text-display font-medium leading-[0.9] text-bone md:text-[clamp(3rem,10vw,11rem)]"
          aria-label="Let's make something unexpected."
        >
          LET'S MAKE SOMETHING UNEXPECTED.
        </h2>

        {/* Magnetic contact button */}
        <div data-contact-meta className="mt-14 flex justify-center">
          <a
            ref={buttonRef}
            href="mailto:hello@waxx.studio"
            data-cursor="hover"
            className="magnetic group relative inline-flex h-44 w-44 items-center justify-center rounded-full bg-lime text-ink transition-colors duration-500 hover:bg-bone md:h-56 md:w-56"
          >
            <span className="font-display text-xl font-medium md:text-2xl">Let&apos;s Talk</span>
            <ArrowUpRight
              size={24}
              className="absolute right-8 top-8 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>
        </div>

        {/* Email */}
        <a
          href="mailto:hello@waxx.studio"
          data-cursor="link"
          data-contact-meta
          className="mt-14 inline-block font-display text-3xl font-medium text-bone transition-colors duration-300 hover:text-lime md:text-5xl"
        >
          hello@waxx.studio
        </a>

        {/* Socials */}
        <div data-contact-meta className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              className="group inline-flex items-center gap-1.5 font-body text-sm text-ash-600 transition-colors duration-300 hover:text-bone"
            >
              {s.label}
              <ArrowUpRight size={14} className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

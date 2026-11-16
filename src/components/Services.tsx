import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText } from '@/lib/splitText';

gsap.registerPlugin(ScrollTrigger);

interface Service {
  no: string;
  title: string;
  description: string;
  tags: string[];
  preview: string;
}

const SERVICES: Service[] = [
  {
    no: '01',
    title: 'Creative Direction',
    description:
      'Concept, art direction, and narrative systems that give every project a singular point of view.',
    tags: ['Concept', 'Art Direction', 'Narrative'],
    preview: 'Direction',
  },
  {
    no: '02',
    title: 'Digital Experiences',
    description:
      'Immersive, story-driven web experiences built with WebGL, real-time 3D, and cinematic motion.',
    tags: ['WebGL', '3D', 'Storytelling'],
    preview: 'Experience',
  },
  {
    no: '03',
    title: 'Web Development',
    description:
      'Production-grade engineering — performant, accessible, and built to scale with your ambition.',
    tags: ['React', 'Performance', 'CMS'],
    preview: 'Development',
  },
  {
    no: '04',
    title: 'Motion & Interaction',
    description:
      'Micro-interactions, scroll choreography, and kinetic systems that make interfaces feel alive.',
    tags: ['GSAP', 'Micro-interactions', 'Choreography'],
    preview: 'Motion',
  },
  {
    no: '05',
    title: 'Brand Identity',
    description:
      'Visual systems, typography, and motion identities that make a brand unmistakable in motion.',
    tags: ['Identity', 'Typography', 'Systems'],
    preview: 'Identity',
  },
];

/** Services — unconventional editorial layout with animated hover previews. */
export function Services() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const heading = el.querySelector('[data-services-heading]') as HTMLElement;
      if (heading) {
        const split = splitText(heading);
        gsap.from(split.chars, {
          yPercent: 120,
          rotate: 6,
          opacity: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.02,
          scrollTrigger: { trigger: heading, start: 'top 85%' },
        });
      }

      const rows = el.querySelectorAll('[data-service-row]');
      rows.forEach((row) => {
        gsap.from(row, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: row, start: 'top 90%' },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={root} className="relative bg-ink py-28 md:py-44">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 font-body text-xs uppercase tracking-[0.3em] text-ash-600">
              (Capabilities)
            </p>
            <h2
              data-services-heading
              className="font-display text-display font-medium text-bone"
              aria-label="Services"
            >
              SERVICES
            </h2>
          </div>
          <p className="max-w-sm font-body text-sm leading-relaxed text-ash-600">
            Five disciplines, one studio. We blend them differently for every engagement —
            no two WaxX projects look or move the same.
          </p>
        </div>

        <div className="border-t border-white/10">
          {SERVICES.map((s) => (
            <ServiceRow key={s.no} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceRow({ service }: { service: Service }) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const row = rowRef.current;
    const preview = previewRef.current;
    if (!row || !preview) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const onEnter = () => {
      gsap.to(preview, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
      gsap.to(row.querySelector('[data-service-title]'), { x: 24, color: '#D7FF3F', duration: 0.5, ease: 'expo.out' });
    };
    const onLeave = () => {
      gsap.to(preview, { opacity: 0, scale: 0.9, duration: 0.5, ease: 'expo.out' });
      gsap.to(row.querySelector('[data-service-title]'), { x: 0, color: '#F4F4F0', duration: 0.5, ease: 'expo.out' });
    };

    row.addEventListener('mouseenter', onEnter);
    row.addEventListener('mouseleave', onLeave);
    return () => {
      row.removeEventListener('mouseenter', onEnter);
      row.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={rowRef}
      data-service-row
      data-cursor="link"
      className="group relative grid grid-cols-12 items-center gap-4 border-b border-white/10 py-8 md:py-12"
    >
      <span className="col-span-2 font-body text-sm text-ash-600 md:col-span-1">
        {service.no}
      </span>
      <h3
        data-service-title
        className="col-span-10 font-display text-3xl font-medium tracking-tight text-bone md:col-span-4 md:text-5xl"
      >
        {service.title}
      </h3>
      <p className="col-span-12 mt-2 max-w-md font-body text-sm leading-relaxed text-ash-600 md:col-span-5 md:col-start-7 md:mt-0">
        {service.description}
      </p>
      <div className="col-span-12 mt-2 flex flex-wrap gap-2 md:col-span-2 md:col-start-11 md:mt-0 md:justify-end">
        {service.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-white/10 px-3 py-1 font-body text-[0.7rem] uppercase tracking-wider text-ash-600"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Hover preview — large ghost word */}
      <div
        ref={previewRef}
        className="pointer-events-none absolute right-0 top-1/2 z-0 -translate-y-1/2 scale-90 opacity-0"
      >
        <span className="xx-mark text-[12vw] leading-none text-lime/10">
          {service.preview}
        </span>
      </div>
    </div>
  );
}

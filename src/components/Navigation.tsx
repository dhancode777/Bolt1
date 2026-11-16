import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { useMagnetic } from '@/lib/useMagnetic';
import { scrollToSection } from '@/lib/useSmoothScroll';

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { label: 'Work', target: '#work' },
  { label: 'About', target: '#about' },
  { label: 'Services', target: '#services' },
  { label: 'Contact', target: '#contact' },
];

/** Minimal fixed navigation with transparent→solid transition, active indicator, mobile menu. */
export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('');
  const navRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const talkRef = useMagnetic<HTMLAnchorElement>(0.35);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const triggers = LINKS.map((l) =>
      ScrollTrigger.create({
        trigger: l.target,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive) setActive(l.target);
        },
      }),
    );

    return () => {
      window.removeEventListener('scroll', onScroll);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  // Mobile menu open/close animation
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    if (open) {
      gsap.to(menu, { yPercent: 0, duration: 0.7, ease: 'expo.out' });
      gsap.fromTo(
        menu.querySelectorAll('[data-menu-link]'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.06, delay: 0.15 },
      );
    } else {
      gsap.to(menu, { yPercent: -100, duration: 0.5, ease: 'expo.in' });
    }
  }, [open]);

  const go = (target: string) => {
    setOpen(false);
    // allow menu to start closing before scroll
    requestAnimationFrame(() => scrollToSection(target));
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ${
          scrolled ? 'bg-ink/70 backdrop-blur-xl border-b border-white/5 py-4' : 'py-6'
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-10">
          <Logo onClick={() => go('#hero')} className="text-2xl md:text-3xl" />

          <div className="hidden items-center gap-10 md:flex">
            {LINKS.map((l) => (
              <button
                key={l.target}
                onClick={() => go(l.target)}
                data-cursor="link"
                className="group relative font-body text-sm tracking-wide"
              >
                <span className="transition-opacity duration-300 group-hover:opacity-0">{l.label}</span>
                <span className="absolute inset-0 -translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {l.label}
                </span>
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-lime transition-all duration-500 ${
                    active === l.target ? 'w-full' : 'w-0'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="hidden md:block">
            <a
              ref={talkRef}
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                go('#contact');
              }}
              data-cursor="hover"
              className="magnetic inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm transition-colors duration-300 hover:border-lime hover:text-lime"
            >
              Let&apos;s Talk
            </a>
          </div>

          <button
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[90] flex translate-y-[-100%] flex-col bg-ink px-6 pb-10 pt-28 md:hidden"
      >
        <div className="flex flex-col gap-6">
          {LINKS.map((l, i) => (
            <button
              key={l.target}
              data-menu-link
              onClick={() => go(l.target)}
              className="font-display text-5xl font-medium tracking-tight"
            >
              <span className="text-lime mr-3 text-base align-middle">0{i + 1}</span>
              {l.label}
            </button>
          ))}
        </div>
        <div className="mt-auto pt-10">
          <a
            href="mailto:hello@waxx.studio"
            className="font-display text-3xl text-lime"
          >
            hello@waxx.studio
          </a>
        </div>
      </div>
    </>
  );
}

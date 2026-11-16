import { Logo } from './Logo';
import { scrollToSection } from '@/lib/useSmoothScroll';

const NAV = [
  { label: 'Work', target: '#work' },
  { label: 'About', target: '#about' },
  { label: 'Services', target: '#services' },
  { label: 'Contact', target: '#contact' },
];

/** Interactive footer with WaxX branding and big XX mark. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink pt-20">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <Logo className="text-4xl md:text-5xl" />
            <p className="mt-6 max-w-xs font-body text-sm leading-relaxed text-ash-600">
              Independent creative digital studio. Building the unexpected since 2014.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <p className="mb-4 font-body text-xs uppercase tracking-[0.25em] text-ash-600">
              Navigate
            </p>
            <ul className="flex flex-col gap-2">
              {NAV.map((n) => (
                <li key={n.target}>
                  <button
                    onClick={() => scrollToSection(n.target)}
                    data-cursor="link"
                    className="font-body text-base text-bone transition-colors duration-300 hover:text-lime"
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 md:col-start-10">
            <p className="mb-4 font-body text-xs uppercase tracking-[0.25em] text-ash-600">
              Studio
            </p>
            <a
              href="mailto:hello@waxx.studio"
              data-cursor="link"
              className="font-body text-base text-bone transition-colors duration-300 hover:text-lime"
            >
              hello@waxx.studio
            </a>
            <p className="mt-2 font-body text-sm text-ash-600">Remote · Worldwide</p>
          </div>
        </div>

        {/* Giant XX wordmark */}
        <div className="pointer-events-none mt-16 select-none overflow-hidden">
          <h2 className="xx-mark text-center text-[28vw] font-semibold leading-[0.8] text-white/[0.04]">
            WaxX
          </h2>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 md:flex-row">
          <p className="font-body text-xs text-ash-600">© {year} WaxX Studio. All rights reserved.</p>
          <p className="font-body text-xs text-ash-600">
            Crafted with obsessive attention to detail.
          </p>
        </div>
      </div>
    </footer>
  );
}

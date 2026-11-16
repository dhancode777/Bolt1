import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface CursorState {
  x: number;
  y: number;
}

/**
 * Global custom cursor: a small dot with a trailing ring.
 * Reacts to hoverable elements via [data-cursor] attributes.
 * Disabled on touch devices.
 */
export function useCustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const pos: CursorState = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos: CursorState = { ...pos };

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const xTo = gsap.quickTo(ring, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(ring, 'y', { duration: 0.6, ease: 'power3' });
    const dotXTo = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
    const dotYTo = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      dotXTo(pos.x);
      dotYTo(pos.y);
      xTo(pos.x);
      yTo(pos.y);
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
    };

    const onDown = () => gsap.to(ring, { scale: 0.7, duration: 0.3, ease: 'power3' });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.3, ease: 'power3' });

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-cursor]') as HTMLElement | null;
      if (!target) return;
      const variant = target.getAttribute('data-cursor');
      if (variant === 'hover') {
        gsap.to(ring, { scale: 2.2, borderColor: '#D7FF3F', duration: 0.4, ease: 'power3' });
        gsap.to(dot, { scale: 0, duration: 0.3 });
      } else if (variant === 'view') {
        gsap.to(ring, { scale: 3, borderColor: '#D7FF3F', duration: 0.4, ease: 'power3' });
        gsap.to(dot, { scale: 0, duration: 0.3 });
      } else if (variant === 'link') {
        gsap.to(ring, { scale: 1.8, duration: 0.4, ease: 'power3' });
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-cursor]') as HTMLElement | null;
      if (!target) return;
      gsap.to(ring, { scale: 1, borderColor: 'rgba(244,244,240,0.5)', duration: 0.4, ease: 'power3' });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.3 });

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.body.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.body.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return { dotRef, ringRef };
}

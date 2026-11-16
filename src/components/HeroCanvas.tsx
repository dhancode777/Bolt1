import { useEffect, useRef } from 'react';
import { HeroScene } from '@/three/HeroScene';

interface Props {
  className?: string;
}

/** React wrapper that mounts the HeroScene chrome sculpture and disposes it on unmount. */
export function HeroCanvas({ className }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // Guard against unavailable WebGL
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) return;
    } catch {
      return;
    }

    const scene = new HeroScene(container);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => scene.setInView(e.isIntersecting));
      },
      { threshold: 0.01 },
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      scene.dispose();
    };
  }, []);

  return <div ref={ref} className={className} aria-hidden="true" />;
}

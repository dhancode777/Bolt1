import { useEffect, useRef } from 'react';
import { VisualScene } from '@/three/VisualScene';

interface Props {
  className?: string;
}

/** React wrapper for the interactive visual section 3D scene. */
export function VisualCanvas({ className }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) return;
    } catch {
      return;
    }

    const scene = new VisualScene(container);

    return () => {
      scene.dispose();
    };
  }, []);

  return <div ref={ref} className={className} aria-hidden="true" />;
}

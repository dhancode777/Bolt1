import { useRef } from 'react';
import { gsap } from 'gsap';

interface Props {
  className?: string;
  onClick?: () => void;
  animated?: boolean;
}

/**
 * WaxX wordmark. The two Xs animate on hover (rotate/scale) to reinforce the brand.
 */
export function Logo({ className = '', onClick, animated = true }: Props) {
  const x1 = useRef<HTMLSpanElement>(null);
  const x2 = useRef<HTMLSpanElement>(null);

  const onEnter = () => {
    if (!animated) return;
    gsap.to([x1.current, x2.current], {
      rotate: 90,
      scale: 0.85,
      duration: 0.6,
      ease: 'expo.out',
      stagger: 0.05,
    });
  };

  const onLeave = () => {
    if (!animated) return;
    gsap.to([x1.current, x2.current], {
      rotate: 0,
      scale: 1,
      duration: 0.7,
      ease: 'expo.out',
      stagger: 0.05,
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      data-cursor="link"
      className={`font-display font-semibold tracking-tight ${className}`}
      aria-label="WaxX — home"
    >
      <span className="inline-flex items-baseline">
        <span>W</span>
        <span ref={x1} className="xx-mark text-lime inline-block">a</span>
        <span ref={x2} className="xx-mark text-lime inline-block">X</span>
        <span>X</span>
      </span>
    </button>
  );
}

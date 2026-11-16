import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface SplitResult {
  chars: HTMLSpanElement[];
  words: HTMLSpanElement[];
  cleanup: () => void;
}

/**
 * Splits an element's text content into word and char spans for animation.
 * Preserves whitespace. Returns refs and a cleanup that restores original text.
 */
export function splitText(el: HTMLElement): SplitResult {
  const original = el.innerHTML;
  const text = el.textContent ?? '';
  const words = text.split(/(\s+)/);

  el.textContent = '';
  el.setAttribute('aria-label', text);

  const wordEls: HTMLSpanElement[] = [];
  const charEls: HTMLSpanElement[] = [];

  words.forEach((word) => {
    if (/^\s+$/.test(word)) {
      el.appendChild(document.createTextNode(word));
      return;
    }
    if (word === '') return;

    const wordSpan = document.createElement('span');
    wordSpan.style.display = 'inline-block';
    wordSpan.style.whiteSpace = 'nowrap';

    for (const ch of word) {
      const charSpan = document.createElement('span');
      charSpan.className = 'reveal-char';
      charSpan.setAttribute('aria-hidden', 'true');
      charSpan.textContent = ch === ' ' ? '\u00A0' : ch;
      wordSpan.appendChild(charSpan);
      charEls.push(charSpan);
    }

    el.appendChild(wordSpan);
    wordEls.push(wordSpan);
  });

  return {
    chars: charEls,
    words: wordEls,
    cleanup: () => {
      el.innerHTML = original;
      el.removeAttribute('aria-label');
    },
  };
}

/**
 * Reveal characters/words with a staggered rise as the element enters view.
 */
export function animateSplitReveal(
  el: HTMLElement,
  options: {
    chars?: boolean;
    y?: number;
    rotate?: number;
    duration?: number;
    stagger?: number;
    delay?: number;
    start?: string;
    once?: boolean;
  } = {},
) {
  const {
    chars = true,
    y = 120,
    rotate = 8,
    duration = 1.1,
    stagger = 0.018,
    delay = 0,
    start = 'top 85%',
    once = true,
  } = options;

  const split = splitText(el);
  const targets = chars ? split.chars : split.words;

  gsap.set(targets, { yPercent: y, rotate, opacity: 0 });

  const tween = gsap.to(targets, {
    yPercent: 0,
    rotate: 0,
    opacity: 1,
    duration,
    delay,
    stagger,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: el,
      start,
      once,
    },
  });

  return {
    tween,
    cleanup: () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.cleanup();
    },
  };
}

import { useCustomCursor } from '@/lib/useCustomCursor';

/** Renders the custom cursor dot + trailing ring. Hidden on touch devices. */
export function Cursor() {
  const { dotRef, ringRef } = useCustomCursor();

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-9 w-9 rounded-full border md:block"
        style={{ borderColor: 'rgba(244,244,240,0.5)' }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-1.5 w-1.5 rounded-full bg-bone md:block"
      />
    </>
  );
}

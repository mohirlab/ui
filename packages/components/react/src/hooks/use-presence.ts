import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';

export type PresenceState = 'open' | 'closed';

/**
 * Keeps an element mounted until its exit animation has finished.
 *
 * Set `data-state={state}` on the element and give it a `motion()` style: when `open`
 * turns false, `state` becomes `closed`, the exit animation runs, and only then does
 * `mounted` turn false. If no animation runs (no CSS, reduced motion, tests), a timeout
 * finishes the exit anyway.
 */
export function usePresence(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
  { onExitComplete, maxExitMs = 600 }: { onExitComplete?: () => void; maxExitMs?: number } = {},
) {
  const [mounted, setMounted] = useState(open);
  // Mount during render when `open` turns on, so the element exists in the same commit.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setMounted(true);
  }
  const state: PresenceState = open ? 'open' : 'closed';

  const exitRef = useRef(onExitComplete);
  useLayoutEffect(() => {
    exitRef.current = onExitComplete;
  });

  useEffect(() => {
    if (open || !mounted) return;
    const el = ref.current;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      exitRef.current?.();
      setMounted(false);
    };
    // Ignore animations of children and of pseudo-elements such as ::backdrop.
    const onEnd = (event: AnimationEvent) => {
      if (event.target === el && !event.pseudoElement) finish();
    };
    el?.addEventListener('animationend', onEnd);
    const timer = setTimeout(finish, maxExitMs);
    return () => {
      el?.removeEventListener('animationend', onEnd);
      clearTimeout(timer);
    };
  }, [open, mounted, ref, maxExitMs]);

  return { mounted, state };
}

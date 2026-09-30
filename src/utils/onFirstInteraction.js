// Runs `callback` once, on the visitor's first real interaction (mouse move, touch,
// scroll, wheel or key press). Used to keep heavy extras (3D scene, scroll animations)
// out of the initial page load, which is what PageSpeed/Lighthouse measures.
const EVENTS = ['pointermove', 'pointerdown', 'touchstart', 'scroll', 'wheel', 'keydown'];

export function onFirstInteraction(callback) {
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    cleanup();
    callback();
  };
  const cleanup = () => EVENTS.forEach((ev) => window.removeEventListener(ev, run));
  EVENTS.forEach((ev) => window.addEventListener(ev, run, { passive: true, once: true }));
  return cleanup;
}

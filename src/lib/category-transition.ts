// Runs the selection sequence without changing the card layout or image assets.
export function createCategoryTransition() {
  let animations: Animation[] = [];
  let generation = 0;
  let busy = false;
  let previous: { overflow: string; paddingRight: string } | null = null;

  function freeze(event: Event) { event.preventDefault(); event.stopPropagation(); }

  function unlock() {
    if (!previous) return;
    document.body.style.overflow = previous.overflow;
    document.body.style.paddingRight = previous.paddingRight;
    window.removeEventListener("wheel", freeze, true);
    window.removeEventListener("touchmove", freeze, true);
    previous = null;
  }
  function stop() {
    generation++;
    busy = false;
    animations.forEach(animation => animation.cancel());
    animations = [];
    unlock();
  }
  function track(animation: Animation) {
    animations.push(animation);
    // Cancellation is expected when leaving the page or pressing Escape.
    void animation.finished.catch(() => undefined);
    return animation;
  }
  async function play(selected: HTMLElement, cards: HTMLElement[], reduced: boolean) {
    if (busy) return false;
    busy = true;
    const run = ++generation;
    previous = { overflow: document.body.style.overflow, paddingRight: document.body.style.paddingRight };
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) {
      document.body.style.paddingRight = (parseFloat(getComputedStyle(document.body).paddingRight) || 0) + scrollbar + "px";
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("wheel", freeze, { passive: false, capture: true });
    window.addEventListener("touchmove", freeze, { passive: false, capture: true });
    try {
      if (typeof selected.animate !== "function") return true;
      const peers = cards.filter(card => card !== selected);
      const heading = selected.closest(".things-category-page")?.querySelector<HTMLElement>(".things-category-page-title");
      if (heading) track(heading.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduced ? 100 : 200, fill: "forwards" }));
      const exits = peers.map((card, index) => {
        const distance = window.innerHeight - card.getBoundingClientRect().top + 80;
        return track(card.animate(reduced ? [{ opacity: 1 }, { opacity: 0 }] : [
          { transform: "translate3d(0,0,0) rotate(0deg)", opacity: 1 },
          { transform: "translate3d(0," + Math.max(80, distance) + "px,0) rotate(" + (index % 2 ? -2 : 2) + "deg)", opacity: 0 }
        ], { duration: reduced ? 100 : 420, delay: reduced ? 0 : index * 35,
          easing: "cubic-bezier(.55,0,.85,.35)", fill: "forwards" }));
      });
      await Promise.all(exits.map(animation => animation.finished));
      if (run !== generation) return false;
      if (reduced) return true;
      const bounds = selected.getBoundingClientRect();
      const header = document.querySelector<HTMLElement>(".things-header-shell");
      const headerBottom = Math.max(0, Math.min(window.innerHeight, header?.getBoundingClientRect().bottom || 0));
      const x = window.innerWidth / 2 - bounds.left - bounds.width / 2;
      const y = (window.innerHeight + headerBottom) / 2 - bounds.top - bounds.height / 2;
      const scale = Math.max(.2, Math.min(1, (window.innerWidth - 32) / bounds.width,
        Math.max(1, window.innerHeight - headerBottom - 32) / bounds.height));
      await track(selected.animate([
        { transform: "translate3d(0,0,0) scale(1)" },
        { transform: "translate3d(" + x + "px," + y + "px,0) scale(" + scale + ")" }
      ], { duration: 600, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" })).finished;
      if (run !== generation) return false;
      // A brief pause lets the centred card settle before opening its content.
      await track(selected.animate([{ opacity: 1 }, { opacity: 1 }], { duration: 140 })).finished;
      return run === generation;
    } catch {
      if (run === generation) stop();
      return false;
    }
  }
  return { play, stop, unlock, get busy() { return busy; } };
}

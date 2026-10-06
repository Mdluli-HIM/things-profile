"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { GalleryImage } from "@/lib/infinite-gallery";

type Bounds = Pick<DOMRect, "left" | "top" | "width" | "height">;
export type GallerySelection = { photo: GalleryImage; origin: Bounds; trigger: HTMLElement; preview?: string };

export function imageTransform(from: Bounds, to: Bounds) {
  const x = from.left + from.width / 2 - to.left - to.width / 2;
  const y = from.top + from.height / 2 - to.top - to.height / 2;
  return "translate3d(" + x + "px," + y + "px,0) scale(" + from.width / Math.max(1, to.width) + "," + from.height / Math.max(1, to.height) + ")";
}

export function GalleryLightbox({ selection, onClose }: { selection: GallerySelection; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const frameRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeAction = useRef<() => void>(() => {});
  const callback = useRef(onClose);
  const [ready, setReady] = useState(false);
  useEffect(() => { callback.current = onClose; }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const frame = frameRef.current;
    if (!dialog || !frame) return;
    let disposed = false, closing = false;
    let entrance: Animation | undefined, exit: Animation | undefined;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    const target = frame.getBoundingClientRect();
    if (!preference.matches && typeof frame.animate === "function") {
      entrance = frame.animate([
        { transform: imageTransform(selection.origin, target) },
        { transform: "none" }
      ], { duration: 480, easing: "cubic-bezier(.22,1,.36,1)" });
      void entrance.finished.catch(() => undefined);
    }
    function finish() {
      if (disposed) return;
      if (dialog!.open) dialog!.close();
      callback.current();
    }
    closeAction.current = () => {
      if (closing || disposed) return;
      closing = true;
      dialog.dataset.closing = "true";
      const current = frame.getBoundingClientRect();
      entrance?.cancel();
      if (preference.matches || typeof frame.animate !== "function") { finish(); return; }
      const base = frame.getBoundingClientRect();
      const origin = selection.trigger.isConnected ? selection.trigger.getBoundingClientRect() : selection.origin;
      exit = frame.animate([
        { transform: imageTransform(current, base), opacity: 1 },
        { transform: imageTransform(origin, base), opacity: 0 }
      ], { duration: 300, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" });
      void exit.finished.then(finish, () => { if (!disposed) finish(); });
    };
    return () => {
      disposed = true;
      closeAction.current = () => {};
      entrance?.cancel(); exit?.cancel();
      if (dialog.open) dialog.close();
    };
  }, [selection]);

  return <dialog ref={dialogRef} className="things-gallery-lightbox" aria-labelledby="things-lightbox-title" data-lenis-prevent
    onCancel={event => { event.preventDefault(); closeAction.current(); }}
    onClick={event => { if (event.target === event.currentTarget) closeAction.current(); }}>
    <h2 id="things-lightbox-title" className="things-gallery-sr">{selection.photo.title}</h2>
    <button ref={closeRef} type="button" className="things-lightbox-close" aria-label="Close image" onClick={() => closeAction.current()}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M5 5L19 19M19 5L5 19" />
      </svg>
    </button>
    <figure ref={frameRef} className="things-lightbox-frame" data-ready={ready}
      style={{ "--gallery-image-aspect": selection.photo.width / selection.photo.height } as CSSProperties}>
      <Image src={selection.preview || selection.photo.src} alt="" aria-hidden="true" fill unoptimized draggable={false}
        className="things-lightbox-preview" sizes="100vw" loading="eager" />
      <Image src={selection.photo.src} alt={selection.photo.title} fill draggable={false}
        className="things-lightbox-photo" sizes="(max-width: 767px) 95vw, 90vw" loading="eager" onLoad={() => setReady(true)} />
    </figure>
  </dialog>;
}

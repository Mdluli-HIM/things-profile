"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import archiveDetails from "@/data/archive-details.json";
import graphicsDetails from "@/data/graphics-details.json";
const galleryDetails = { ...archiveDetails, ...graphicsDetails };
import { useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/lib/infinite-gallery";

type Bounds = Pick<DOMRect, "left" | "top" | "width" | "height">;
export type GallerySelection = {
  photo: GalleryImage;
  origin: Bounds;
  trigger: HTMLElement;
  preview?: string;
};

export function imageTransform(from: Bounds, to: Bounds) {
  const x = from.left + from.width / 2 - to.left - to.width / 2;
  const y = from.top + from.height / 2 - to.top - to.height / 2;
  return `translate3d(${x}px,${y}px,0) scale(${from.width / Math.max(1, to.width)},${from.height / Math.max(1, to.height)})`;
}

export function GalleryLightbox({
  selection, images, onClose
}: {
  selection: GallerySelection;
  images: GalleryImage[];
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const callback = useRef(onClose);
  const closing = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [photo, setPhoto] = useState(selection.photo);
  const initialIndex = Math.max(0,
    images.findIndex(image => image.src === selection.photo.src));
  const [cursor, setCursor] = useState(initialIndex);
  const cursorRef = useRef(initialIndex);
  const navigate = useRef<(position: number) => void>(() => {});
  const [horizontal, setHorizontal] = useState(false);
  const reduced = useReducedMotion();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => { callback.current = onClose; }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (dialog.open) dialog.close();
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setHorizontal(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  navigate.current = position => {
    if (closing.current || !images.length) return;
    cursorRef.current = position;
    setCursor(position);
    const index = ((position % images.length) + images.length) % images.length;
    setPhoto(images[index]);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    let accumulated = 0;
    let lastWheel = 0;
    let lockedUntil = 0;
    let touchX = 0;
    let touchY = 0;

    const step = (direction: number) => {
      navigate.current(cursorRef.current + direction);
    };

    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      event.preventDefault();
      const now = performance.now();
      if (now < lockedUntil) return;
      if (now - lastWheel > 180) accumulated = 0;
      lastWheel = now;
      const unit = event.deltaMode === 1 ? 16
        : event.deltaMode === 2 ? dialog.clientHeight : 1;
      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX)
        ? event.deltaY : event.deltaX;
      accumulated += delta * unit;
      if (Math.abs(accumulated) < 40) return;
      step(accumulated > 0 ? 1 : -1);
      accumulated = 0;
      lockedUntil = now + 380;
    };

    const key = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) {
        event.preventDefault();
        step(event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1);
      }
    };

    const touchStart = (event: TouchEvent) => {
      touchX = event.touches[0].clientX;
      touchY = event.touches[0].clientY;
    };

    const touchEnd = (event: TouchEvent) => {
      const dx = touchX - event.changedTouches[0].clientX;
      const dy = touchY - event.changedTouches[0].clientY;
      const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      if (Math.abs(delta) > 35) step(delta > 0 ? 1 : -1);
    };

    dialog.addEventListener("wheel", wheel, { passive: false });
    dialog.addEventListener("keydown", key);
    dialog.addEventListener("touchstart", touchStart, { passive: true });
    dialog.addEventListener("touchend", touchEnd, { passive: true });
    return () => {
      dialog.removeEventListener("wheel", wheel);
      dialog.removeEventListener("keydown", key);
      dialog.removeEventListener("touchstart", touchStart);
      dialog.removeEventListener("touchend", touchEnd);
    };
  }, []);

  function close() {
    if (closing.current) return;
    closing.current = true;
    setLeaving(true);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    timer.current = setTimeout(() => {
      dialogRef.current?.close();
      callback.current();
    }, reduced ? 0 : 220);
  }

  const selectedIndex = images.findIndex(image => image.src === photo.src);
  const details = (galleryDetails as Record<string, {
    title?: string;
    year?: number | string | null;
    category?: string | null;
  }>)[photo.src];
  const projectMeta = [details?.year, details?.category]
    .filter(value => value !== null && value !== undefined && value !== "")
    .join(" · ");
  const rawTitle = (details?.title || photo.title).trim();
  const title = /^[a-f0-9\s-]{32,}$/i.test(rawTitle)
    ? `Artwork ${selectedIndex + 1}`
    : rawTitle;

  return (
    <dialog
      ref={dialogRef}
      className="things-gallery-lightbox things-archive-viewer"
      data-closing={leaving}
      data-lenis-prevent
      aria-labelledby="things-lightbox-title"
      onCancel={event => { event.preventDefault(); close(); }}
    >
      <button
        ref={closeRef}
        type="button"
        className="things-lightbox-close"
        aria-label="Close image viewer"
        onClick={close}
      >
        <svg width="24" height="24" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="1.5"
          aria-hidden="true">
          <path d="M5 5L19 19M19 5L5 19" />
        </svg>
      </button>

      <div className="things-archive-viewer-layout">
        <nav className="things-archive-thumbnails"
          aria-label="Choose an image">
          {Array.from({ length: 15 }, (_, slot) => {
            const offset = slot - 7;
            const position = cursor + offset;
            const index = ((position % images.length) + images.length) % images.length;
            const image = images[index];
            if (!image) return null;
            const active = offset === 0;
            return (
              <motion.button
                key={position}
                initial={false}
                animate={{
                  x: horizontal ? offset * 96 : 0,
                  y: horizontal ? 0 : offset * 112,
                  opacity: active ? 1 : 0.22
                }}
                transition={{
                  duration: reduced ? 0 : 0.38,
                  ease: [0.22, 1, 0.36, 1]
                }}
                type="button"
                className="things-archive-thumbnail"
                aria-label={`View image ${index + 1}: ${image.title}`}
                aria-current={active ? "true" : undefined}
                tabIndex={active ? 0 : -1}
                onClick={() => navigate.current(position)}
              >
                <Image src={image.src} alt="" fill
                  sizes="80px" draggable={false} />
              </motion.button>
            );
          })}
        </nav>

        <div className="things-archive-image-info">
          <h2 id="things-lightbox-title">{title}</h2>
          {projectMeta && <p>{projectMeta}</p>}
        </div>

        <div className="things-archive-preview-area">
          <figure key={photo.src} className="things-archive-preview">
            <Image src={photo.src} alt={title} fill
              sizes="(max-width: 767px) 90vw, 55vw"
              loading="eager" draggable={false} />
          </figure>
        </div>
      </div>
    </dialog>
  );
}

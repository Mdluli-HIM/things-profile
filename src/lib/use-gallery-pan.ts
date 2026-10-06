"use client";
import { useEffect, useRef, type RefObject, type Dispatch, type SetStateAction, type MouseEvent } from "react";
import { galleryLayout, type GalleryCell, type GalleryImage } from "@/lib/infinite-gallery";

type Props = {
  images: GalleryImage[];
  paused: boolean;
  stageRef: RefObject<HTMLDivElement | null>;
  planeRef: RefObject<HTMLDivElement | null>;
  cameraRef: RefObject<{ x: number; y: number }>;
  setCells: Dispatch<SetStateAction<GalleryCell[]>>;
};
export function useGalleryPan({ images, paused, stageRef, planeRef, cameraRef, setCells }: Props) {
  const blockClickRef = useRef(false);
  useEffect(() => {
    const stage = stageRef.current;
    const plane = planeRef.current;
    if (!stage || !plane) return;
    if (!images.length) { setCells([]); return; }
    if (paused) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let x = cameraRef.current.x, y = cameraRef.current.y, targetX = x, targetY = y;
    let vx = 0, vy = 0, frame = 0, lastTime = 0, previousCell = "";
    let width = stage.clientWidth, height = stage.clientHeight;
    let pointer: number | null = null, lastX = 0, lastY = 0, lastMove = 0;
    let dragVX = 0, dragVY = 0, dragged = false, downX = 0, downY = 0;

    function paint() {
      const layout = galleryLayout(width, height, x, y, images);
      const identity = layout.column + ":" + layout.row + ":" + width + ":" + height;
      if (identity !== previousCell) { previousCell = identity; setCells(layout.cells); }
      plane!.style.transform = "translate3d(" + -x + "px," + -y + "px,0)";
      cameraRef.current = { x, y };
    }
    function tick(now: number) {
      frame = 0;
      const dt = Math.min(now - (lastTime || now - 16), 40);
      lastTime = now;
      if (pointer === null && !preference.matches) {
        targetX += vx * dt; targetY += vy * dt;
        const friction = Math.exp(-dt / 180);
        vx *= friction; vy *= friction;
      }
      const ease = preference.matches || pointer !== null ? 1 : 1 - Math.exp(-dt / 95);
      x += (targetX - x) * ease; y += (targetY - y) * ease;
      if (Math.abs(targetX - x) < .08) x = targetX;
      if (Math.abs(targetY - y) < .08) y = targetY;
      paint();
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > .1 || Math.abs(vx) + Math.abs(vy) > .005) {
        frame = requestAnimationFrame(tick);
      } else { vx = 0; vy = 0; x = targetX; y = targetY; paint(); }
    }
    function start() { if (!frame) { lastTime = 0; frame = requestAnimationFrame(tick); } }
    function wheel(event: WheelEvent) {
      if (event.ctrlKey) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1;
      if (event.shiftKey && !event.deltaX) targetX += event.deltaY * unit;
      else { targetX += event.deltaX * unit; targetY += event.deltaY * unit; }
      vx = 0; vy = 0; start();
    }
    function down(event: PointerEvent) {
      if (pointer !== null || (event.pointerType === "mouse" && event.button !== 0)) return;
      pointer = event.pointerId;
      dragged = false; blockClickRef.current = false;
      downX = event.clientX; downY = event.clientY;
      if (!(event.target as Element | null)?.closest?.("button.things-gallery-tile")) stage!.focus({ preventScroll: true });
      stage!.dataset.dragging = "false";
      targetX = x; targetY = y; vx = 0; vy = 0; dragVX = 0; dragVY = 0;
      lastX = event.clientX; lastY = event.clientY; lastMove = event.timeStamp;
    }
    function move(event: PointerEvent) {
      if (event.pointerId !== pointer) return;
      if (!dragged) {
        if (Math.hypot(event.clientX - downX, event.clientY - downY) < 7) return;
        dragged = true; blockClickRef.current = true;
        stage!.setPointerCapture(event.pointerId);
        stage!.focus({ preventScroll: true });
        stage!.dataset.dragging = "true";
      }
      const dx = event.clientX - lastX, dy = event.clientY - lastY;
      const elapsed = Math.max(8, event.timeStamp - lastMove);
      targetX -= dx; targetY -= dy;
      dragVX = dragVX * .3 - dx / elapsed * .7;
      dragVY = dragVY * .3 - dy / elapsed * .7;
      lastX = event.clientX; lastY = event.clientY; lastMove = event.timeStamp;
      start();
    }
    function release(event?: PointerEvent) {
      if (event && event.pointerId !== pointer) return;
      const id = pointer;
      pointer = null; stage!.dataset.dragging = "false";
      if (id !== null && stage!.hasPointerCapture(id)) stage!.releasePointerCapture(id);
      const fling = dragged && event?.type === "pointerup" && event.timeStamp - lastMove < 80 && !preference.matches;
      vx = fling ? Math.max(-3, Math.min(3, dragVX)) : 0;
      vy = fling ? Math.max(-3, Math.min(3, dragVY)) : 0;
      start();
    }
    function blur() { release(); }
    function key(event: KeyboardEvent) {
      const distance = event.shiftKey ? 320 : 120;
      const movement: Record<string, [number, number]> = {
        ArrowLeft: [-distance, 0], ArrowRight: [distance, 0],
        ArrowUp: [0, -distance], ArrowDown: [0, distance]
      };
      const delta = movement[event.key];
      if (!delta) return;
      event.preventDefault(); targetX += delta[0]; targetY += delta[1]; vx = 0; vy = 0; start();
    }
    function resize() {
      width = stage!.clientWidth; height = stage!.clientHeight;
      previousCell = ""; paint();
    }
    function preferenceChanged() { vx = 0; vy = 0; start(); }
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    paint();
    stage.addEventListener("wheel", wheel, { passive: false });
    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", release);
    stage.addEventListener("pointercancel", release);
    stage.addEventListener("lostpointercapture", release);
    stage.addEventListener("keydown", key);
    window.addEventListener("blur", blur);
    preference.addEventListener("change", preferenceChanged);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      stage.removeEventListener("wheel", wheel);
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", release);
      stage.removeEventListener("pointercancel", release);
      stage.removeEventListener("lostpointercapture", release);
      stage.removeEventListener("keydown", key);
      window.removeEventListener("blur", blur);
      preference.removeEventListener("change", preferenceChanged);
      if (pointer !== null && stage.hasPointerCapture(pointer)) stage.releasePointerCapture(pointer);
      stage.dataset.dragging = "false";
    };
  }, [images, paused, stageRef, planeRef, cameraRef, setCells]);
  return (event: MouseEvent<HTMLElement>) => event.detail === 0 || !blockClickRef.current;
}

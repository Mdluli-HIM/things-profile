"use client";

import { GalleryLightbox, type GallerySelection } from "./gallery-lightbox";
import { useGalleryPan } from "@/lib/use-gallery-pan";
import Image from "next/image";
import { useRef, useState, type MouseEvent } from "react";
import { Header } from "@/components/layout/header";
import { StudioDialog, type DialogView } from "@/components/layout/studio-dialog";
import { type GalleryCell, type GalleryImage } from "@/lib/infinite-gallery";
import "./work-gallery.css";

export function WorkGallery({ images }: { images: GalleryImage[] }) {
  const [view, setView] = useState<DialogView>(null);
  const [cells, setCells] = useState<GalleryCell[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef({ x: 0, y: 0 });
  const openProject = () => setView("project");

  const [lightbox, setLightbox] = useState<GallerySelection | null>(null);
  const allowImageClick = useGalleryPan({ images, paused: Boolean(view || lightbox), stageRef, planeRef, cameraRef, setCells });
  function openImage(event: MouseEvent<HTMLButtonElement>, photo: GalleryImage) {
    if (!allowImageClick(event)) return;
    const trigger = event.currentTarget;
    const preview = trigger.querySelector("img");
    setLightbox({ photo, trigger, origin: trigger.getBoundingClientRect(), preview: preview?.currentSrc || preview?.src });
  }
  function closeImage() {
    const trigger = lightbox?.trigger;
    setLightbox(null);
    requestAnimationFrame(() => {
      const target = trigger?.isConnected ? trigger : stageRef.current;
      target?.focus({ preventScroll: true });
    });
  }

  return <>
    <svg className="things-gallery-filter" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <filter id="things-gallery-logo-light" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" result="redGreen"
            values="1 -1 0 0 .5 1 -1 0 0 .5 1 -1 0 0 .5 0 0 0 0 1" />
          <feComponentTransfer in="redGreen" result="redGreenDifference">
            <feFuncR type="table" tableValues="1 0 1" />
            <feFuncG type="table" tableValues="1 0 1" />
            <feFuncB type="table" tableValues="1 0 1" />
          </feComponentTransfer>
          <feColorMatrix in="SourceGraphic" type="matrix" result="redBlue"
            values="1 0 -1 0 .5 1 0 -1 0 .5 1 0 -1 0 .5 0 0 0 0 1" />
          <feComponentTransfer in="redBlue" result="redBlueDifference">
            <feFuncR type="table" tableValues="1 0 1" />
            <feFuncG type="table" tableValues="1 0 1" />
            <feFuncB type="table" tableValues="1 0 1" />
          </feComponentTransfer>
          <feBlend in="redGreenDifference" in2="redBlueDifference" mode="lighten" result="colourDifference" />
          <feColorMatrix in="colourDifference" type="matrix" result="lightInk"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 -10 0 0 0 1" />
          <feComposite in="lightInk" in2="SourceAlpha" operator="in" result="whiteLetters" />
          <feComposite in="SourceGraphic" in2="lightInk" operator="out" result="brandLetters" />
          <feComposite in="whiteLetters" in2="brandLetters" operator="arithmetic" k2="1" k3="1" />
        </filter>
      </defs>
    </svg>
    <div className="things-gallery-header">
      <Header openMenu={() => setView("menu")} openProject={openProject} />
      
    </div>
    <main id="main" className="things-gallery-page" aria-labelledby="things-gallery-heading">
      <h1 id="things-gallery-heading" className="things-gallery-sr">Design projects</h1>
      <div ref={stageRef} className="things-gallery-stage" data-lenis-prevent data-empty={!images.length}
        role="region" aria-label="Work gallery" aria-describedby="gallery-instructions"
        tabIndex={images.length ? 0 : -1}>
        <div ref={planeRef} className="things-gallery-plane">
          {cells.map(cell => <button type="button" aria-label={"Open image: " + cell.photo.title} aria-haspopup="dialog" onClick={event => openImage(event, cell.photo)} key={cell.key} className="things-gallery-tile"
            style={{ position: "absolute", left: cell.x, top: cell.y, width: cell.width, height: cell.height }}>
            <Image src={cell.photo.src} alt="" fill draggable={false}
              sizes="(max-width: 767px) 160px, 220px" loading="eager" />
          </button>)}
        </div>
        {!images.length && <div className="things-gallery-empty"><p>New work is on its way.</p></div>}
      </div>
      <p id="gallery-instructions" className={images.length ? "things-gallery-help" : "things-gallery-sr"}>
        <span>Scroll or drag · Select an image to view</span>
        <span className="things-gallery-sr">. Use arrow keys to move. Shift and scroll moves sideways.</span>
      </p>
    </main>
    {lightbox && <GalleryLightbox selection={lightbox} images={images} onClose={closeImage} />}
    <StudioDialog view={view} onClose={() => setView(null)} openProject={openProject} />
  </>;
}

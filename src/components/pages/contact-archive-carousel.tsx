"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import archiveImages from "@/data/work-gallery.json";
import "./contact-archive-carousel.css";

const photos = archiveImages;
const wrap = (value: number) =>
  ((value % photos.length) + photos.length) % photos.length;

export function ContactArchiveCarousel() {
  const stage = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState(0);
  const [width, setWidth] = useState(240);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  useEffect(() => {
    const element = stage.current;
    if (!element) return;

    const resize = new ResizeObserver(() => {
      setWidth(Math.min(300, Math.max(150, element.clientWidth * 0.24)));
    });
    resize.observe(element);

    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    });
    observer.observe(element);

    return () => {
      resize.disconnect();
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (paused || reduced !== false || !visible || photos.length < 2) return;

    const timer = window.setInterval(() => {
      if (!document.hidden) setCursor(value => value + 1);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [paused, reduced, visible]);

  if (!photos.length) return null;

  const offsets = photos.length === 1
    ? [0]
    : [-4, -3, -2, -1, 0, 1, 2, 3, 4];

  return (
    <section className="things-contact-archive" aria-label="Selected archive images">
      <div className="things-contact-archive-stage" ref={stage}>
        {offsets.map(offset => {
          const position = cursor + offset;
          const photo = photos[wrap(position)];

          return (
            <motion.figure
              key={position}
              className="things-contact-archive-card"
              aria-hidden={offset !== 0}
              initial={false}
              animate={{
                x: offset * (width + 16),
                y: Math.abs(offset) * 14,
                rotateY: offset * -12,
                rotateZ: offset * 2,
                opacity: Math.abs(offset) > 3 ? 0 : 1
              }}
              transition={{
                duration: reduced ? 0 : 0.95,
                ease: [0.22, 1, 0.36, 1]
              }}
              style={{
                width,
                height: width * 1.05,
                marginLeft: -width / 2,
                zIndex: 10 - Math.abs(offset)
              }}
            >
              <Image
                src={photo.src}
                alt={offset === 0 ? photo.title : ""}
                fill
                sizes="(max-width: 767px) 190px, 300px"
                draggable={false}
              />
            </motion.figure>
          );
        })}
      </div>

      {photos.length > 1 && (
        <div className="things-contact-archive-controls">
          <button
            type="button"
            aria-label="Previous archive image"
            onClick={() => setCursor(value => value - 1)}
          >
            <ArrowLeft size={17} aria-hidden="true" />
          </button>

          {mounted && reduced === false && (
            <button
              type="button"
              aria-label={paused ? "Resume image rotation" : "Pause image rotation"}
              onClick={() => setPaused(value => !value)}
            >
              {paused
                ? <Play size={15} aria-hidden="true" />
                : <Pause size={15} aria-hidden="true" />}
            </button>
          )}

          <button
            type="button"
            aria-label="Next archive image"
            onClick={() => setCursor(value => value + 1)}
          >
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}

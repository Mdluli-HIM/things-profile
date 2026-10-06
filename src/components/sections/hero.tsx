"use client";

import "./hero-drift.css";
import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import imageData from "@/data/hero-images.json";

gsap.registerPlugin(useGSAP);

type HeroImage = {
  slot: number;
  src: string;
  alt: string;
};

const images = (imageData as HeroImage[]).slice(0, 5);

export function Hero({ openProject }: { openProject: () => void }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".things-headline-inner", {
        yPercent: 110,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "transform"
      });

      gsap.from(".things-photo-inner", {
        opacity: 0,
        scale: 1.05,
        y: 14,
        duration: 0.9,
        stagger: 0.08,
        delay: 0.15,
        ease: "power2.out",
        clearProps: "opacity,transform"
      });

      gsap.from(".things-hero-cta", {
        opacity: 0,
        y: 8,
        duration: 0.7,
        delay: 0.6,
        clearProps: "opacity,transform"
      });
    });

    media.add(
      "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
      () => {
        const section = ref.current;

        if (!section) return;

        const movers = Array.from(
          section.querySelectorAll<HTMLElement>(".things-photo")
        ).map(element => ({
          depth: Number(element.dataset.depth) || 8,
          x: gsap.quickTo(element, "x", {
            duration: 1,
            ease: "power2.out"
          }),
          y: gsap.quickTo(element, "y", {
            duration: 1,
            ease: "power2.out"
          })
        }));

        const move = (event: PointerEvent) => {
          const bounds = section.getBoundingClientRect();

          const x =
            ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;

          const y =
            ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

          movers.forEach(mover => {
            mover.x(x * mover.depth);
            mover.y(y * mover.depth);
          });
        };

        const reset = () => {
          movers.forEach(mover => {
            mover.x(0);
            mover.y(0);
          });
        };

        section.addEventListener("pointermove", move);
        section.addEventListener("pointerleave", reset);

        return () => {
          section.removeEventListener("pointermove", move);
          section.removeEventListener("pointerleave", reset);
        };
      }
    );

    return () => media.revert();
  }, { scope: ref });

  return (
    <section
      className="things-hero"
      ref={ref}
      aria-labelledby="hero-heading"
    >
      <div className="things-photo-field">
        {images.map(image => (
          <div
            key={image.slot}
            className={"things-photo things-photo--" + image.slot}
            data-depth={2 + image.slot * 0.5}
          >
            <div className="things-photo-drift">
<div className="things-photo-inner" style={{ position: "relative", width: "100%", aspectRatio: "8 / 5" }}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 599px) 110px, (max-width: 999px) 150px, 240px"
                preload={image.slot === 1}
              />
            </div>
</div>
          </div>
        ))}
      </div>

      <div className="things-hero-center">
        <h1 id="hero-heading" className="things-headline">
          <span className="things-headline-line">
            <span className="things-headline-inner">
              Digital <span className="things-brand-word"><span className="things-brand-red">t</span>h<span className="things-brand-dot">i</span>ng<span className="things-brand-red">s</span></span>.
            </span>
          </span>

          <span className="things-headline-line">
            <span className="things-headline-inner">
              Made to matter.
            </span>
          </span>
        </h1>

        <button
          type="button"
          className="text-link things-hero-cta"
          onClick={openProject}
        >
          Start a project <ArrowUpRight size={15} />
        </button>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(useGSAP);

export function Hero({ openProject }: { openProject: () => void }) {
  const ref = useRef<HTMLElement>(null);


  useEffect(() => {
    const section = ref.current;
    const artwork = section?.querySelector<HTMLImageElement>(".things-hero-artwork");
    if (!section || !artwork) return;

    const measure = () => {
      const spill = Math.max(0,
        artwork.getBoundingClientRect().bottom -
        section.getBoundingClientRect().bottom);
      section.style.setProperty("--hero-art-spill", spill + "px");
      section.nextElementSibling?.setAttribute("data-hero-art-following", "true");
      (section.nextElementSibling as HTMLElement | null)
        ?.style.setProperty("--hero-art-spill", spill + "px");
    };

    const observer = new ResizeObserver(measure);
    observer.observe(section);
    observer.observe(artwork);
    artwork.addEventListener("load", measure);
    measure();

    return () => {
      observer.disconnect();
      artwork.removeEventListener("load", measure);
    };
  }, []);

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

      gsap.from(".things-hero-cta", {
        opacity: 0,
        y: 8,
        duration: 0.7,
        delay: 0.6,
        clearProps: "opacity,transform"
      });
    });

    return () => media.revert();
  }, { scope: ref });

  return (
    <section
      className="things-hero"
      ref={ref}
      aria-labelledby="hero-heading"
      style={{
        backgroundImage: 'url("/images/hero/hero-background.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <img className="things-hero-artwork" src="/images/hero/hero-background.jpg" alt="" aria-hidden="true" />
      <div className="things-hero-center">
        <h1 id="hero-heading" className="things-headline">
          <span className="things-headline-line">
            <span className="things-headline-inner">
              Digital{" "}
              <span className="things-brand-word">
                <span className="things-brand-red">t</span>h
                <span className="things-brand-dot">i</span>ng
                <span className="things-brand-red">s</span>
              </span>.
            </span>
          </span>

          <span className="things-headline-line">
            <span className="things-headline-inner">
              Made to matter.
            </span>
          </span>
        </h1>

        <button type="button" className="text-link things-hero-cta"
          onClick={openProject}>
          Start a project <ArrowUpRight size={15} />
        </button>
      </div>
    </section>
  );
}

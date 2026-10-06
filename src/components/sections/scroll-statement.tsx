"use client";

import { Fragment, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./scroll-statement.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const statement =
  "Strategy, design and development that bring your brand to life. Online, in print and in the details that matter.";

function toneForWord(word: string) {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (clean === "design" || clean === "brand") return "red";
  if (clean === "development") return "blue";
  return "ink";
}

export function ScrollStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    let active = true;

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const heading = headingRef.current;
      if (!heading) return;

      const characters = heading.querySelectorAll(
        ".things-statement-character"
      );

      const styles = getComputedStyle(heading);
      const red =
        styles.getPropertyValue("--things-brand-red").trim() || "#d61415";
      const blue =
        styles.getPropertyValue("--things-brand-blue").trim() || "#0a23fc";

      gsap.fromTo(
        characters,
        { color: "#eeeeee" },
        {
          color: (_index: number, target: HTMLElement) => {
            const tone = target.parentElement?.dataset.tone;
            return tone === "red"
              ? red
              : tone === "blue"
                ? blue
                : "#101010";
          },
          duration: 1,
          stagger: 0.018,
          ease: "none",
          scrollTrigger: {
            trigger: heading,
            start: "top 90%",
            end: "bottom 25%",
            scrub: 1.2,
            invalidateOnRefresh: true
          }
        }
      );
    });

    document.fonts.ready.then(() => {
      if (active) ScrollTrigger.refresh();
    });

    return () => {
      active = false;
      media.revert();
    };
  }, { scope: sectionRef });

  return (
    <section
      className="things-statement"
      ref={sectionRef}
      aria-labelledby="things-statement-heading"
    >
      <h2
        className="things-statement-heading"
        id="things-statement-heading"
        ref={headingRef}
        aria-label={statement}
      >
        <span aria-hidden="true">
          {statement.split(" ").map((word, wordIndex, words) => (
            <Fragment key={wordIndex}>
              <span
                className="things-statement-word"
                data-tone={toneForWord(word)}
              >
                {Array.from(word).map((character, characterIndex) => (
                  <span
                    className="things-statement-character"
                    key={characterIndex}
                  >
                    {character}
                  </span>
                ))}
              </span>
              {wordIndex < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </span>
      </h2>
    </section>
  );
}

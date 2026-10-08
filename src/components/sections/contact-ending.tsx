"use client";

import { studioContact } from "@/data/studio-contact";
import Image from "next/image";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import imageData from "@/data/contact-image.json";
import "./contact-ending.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const image = imageData as { src: string | null };

export function ContactEnding({
  openProject
}: {
  openProject: () => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const frame = frameRef.current;
    const copy = copyRef.current;

    if (!section || !stage || !frame || !copy) return;

    /* Hold contact artwork behind the footer */
    const ending = section.closest<HTMLElement>(".things-ending");
    if (!ending) return;

    const header = document.querySelector<HTMLElement>(".things-header-shell");
    const headerHeight = () => header?.getBoundingClientRect().height || 0;
    const measureHeader = () => {
      ending.style.setProperty("--ending-header-height", `${headerHeight()}px`);
    };

    measureHeader();
    ScrollTrigger.addEventListener("refreshInit", measureHeader);

    let resizeFrame = 0;
    let previousHeight = headerHeight();
    const observer = new ResizeObserver(() => {
      const nextHeight = headerHeight();
      if (Math.abs(nextHeight - previousHeight) < 1) return;
      previousHeight = nextHeight;
      measureHeader();
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    if (header) observer.observe(header);

    const media = gsap.matchMedia();
    let active = true;

    media.add({
      desktop: "(min-width: 768px)",
      mobile: "(max-width: 767px)",
      motion: "(prefers-reduced-motion: no-preference)"
    }, context => {
      if (!context.conditions?.motion) return;

      const mobile = context.conditions.mobile;

      ScrollTrigger.create({
        trigger: section,
        start: () => `top ${headerHeight()}px`,
        endTrigger: ending,
        end: "bottom bottom",
        pin: stage,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true
      });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: () => `top ${headerHeight()}px`,
          end: "bottom bottom",
          scrub: 1.1,
          invalidateOnRefresh: true
        }
      });

      timeline.fromTo(
        frame,
        {
          width: () => stage.clientWidth * (mobile ? 0.84 : 0.46),
          height: () => stage.clientHeight * 0.72,
          borderRadius: 4
        },
        {
          width: () => stage.clientWidth,
          height: () => stage.clientHeight,
          borderRadius: 0,
          duration: 1.4
        },
        0
      );

      timeline.fromTo(
        copy,
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 0.55 },
        1.45
      );

      timeline.to(copy, {
        autoAlpha: 1,
        duration: 0.35
      });
    });

    document.fonts.ready.then(() => {
      if (active) ScrollTrigger.refresh();
    });

    return () => {
      active = false;
      observer.disconnect();
      cancelAnimationFrame(resizeFrame);
      ScrollTrigger.removeEventListener("refreshInit", measureHeader);
      media.revert();
      ending.style.removeProperty("--ending-header-height");
    };
  }, { scope: sectionRef });

  return (
    <div className="things-ending">
      <section
        id="contact"
        className="things-contact-scene"
        ref={sectionRef}
        aria-labelledby="things-contact-heading"
      >
        <div className="things-contact-stage" ref={stageRef}>
          <div className="things-contact-frame" ref={frameRef}>
            {image.src && (
              <Image
                src={image.src}
                alt=""
                fill
                sizes="100vw"
                className="things-contact-image"
                onLoad={() => ScrollTrigger.refresh()}
              />
            )}

            <div className="things-contact-shade" aria-hidden="true" />

            <div className="things-contact-copy" ref={copyRef}>
              <h2 id="things-contact-heading">
                Have a project in mind?
              </h2>

              <button
                type="button"
                className="things-contact-button"
                onClick={openProject}
              >
                Start a project <ArrowUpRight size={22} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer
        className="things-ending-footer"
        aria-labelledby="things-ending-heading"
      >
        <div className="things-ending-panel">
          <h2 id="things-ending-heading">
            <button
              type="button"
              className="things-ending-cta"
              onClick={openProject}
            >
              <span>Let’s make</span>
              <span>
                <span className="things-ending-red">good things</span>
                <span className="things-ending-blue">.</span>
              </span>
            </button>
          </h2>

          <div className="things-ending-details">
  <div className="things-ending-columns">
    <div className="things-ending-about">
      <p className="things-ending-label">Things</p>
      <p className="things-ending-description">Independent design & development studio.</p>
      <p>Cape Town, South Africa.</p>
      <p>Working worldwide.</p>

      {(studioContact.email || studioContact.phone) && (
        <div className="things-ending-contact-links">
          {studioContact.email && (
            <a href={"mailto:" + studioContact.email}>{studioContact.email}</a>
          )}
          {studioContact.phone && (
            <a href={"tel:" + studioContact.phone.replace(/[^+0-9]/g, "")}>
              {studioContact.phone}
            </a>
          )}
        </div>
      )}

      {studioContact.socials.some(social => social.label && social.url) && (
        <nav className="things-ending-socials" aria-label="Things social media">
          {studioContact.socials
            .filter(social => social.label && social.url)
            .map(social => (
              <a key={social.url} href={social.url}
                target="_blank" rel="noopener noreferrer">
                {social.label}<span aria-hidden="true"> ↗</span>
              </a>
            ))}
        </nav>
      )}
    </div>

    <div>
      <p className="things-ending-label">Pages</p>
      <nav aria-label="Footer navigation">
  <a href="#main">Home</a>
  <a href="/projects">Projects</a>
  <a href="/services">Services</a>
  <a href="#studio">About</a>
  <a href="#contact">Contact</a>
</nav>
    </div>

    <div>
      <p className="things-ending-label">What we do</p>
      <p>Web Applications</p>
      <p>Mobile Applications</p>
      <p>Design System</p>
      <p>Websites</p>
      <p>Brand</p>
      <p>Creative Direction</p>
    </div>
  </div>

  <div className="things-ending-bottom">
    <p>© {new Date().getFullYear()} Things</p>
    <a href="#main">Back to top ↑</a>
  </div>
</div>
        </div>
      </footer>
    </div>
  );
}

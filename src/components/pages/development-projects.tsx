"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/layout/header";
import { StudioDialog, type DialogView } from "@/components/layout/studio-dialog";
import type { WorkProject } from "@/data/work-projects";
import "./development-projects.css";

export const wrapProject = (value: number, count: number) =>
  count ? ((value % count) + count) % count : 0;

type Props = {
  projects: WorkProject[];
  covers: Record<string, string>;
  initialProject?: string;
};

export function DevelopmentProjects({ projects, covers, initialProject }: Props) {
  const [view, setView] = useState<DialogView>(null);
  const rail = useRef<HTMLDivElement>(null);
  const openProject = () => setView("project");

  useEffect(() => {
    const container = rail.current;
    const count = projects.length;
    if (!container || !count) return;

    let cycle = 0;
    let frame = 0;

    const measure = () => {
      const first = container.children[0] as HTMLElement;
      const next = container.children[count] as HTMLElement;
      if (!first || !next) return;

      cycle = next.offsetLeft - first.offsetLeft;
      const selected = Math.max(0,
        projects.findIndex(item => item.id === initialProject));
      const target = container.children[count * 3 + selected] as HTMLElement;
      container.scrollLeft = target.offsetLeft - first.offsetLeft;
    };

    const normalize = () => {
      frame = 0;
      if (!cycle) return;

      const position = container.scrollLeft;
      if (position < cycle * 2 || position >= cycle * 4) {
        const within = ((position % cycle) + cycle) % cycle;
        container.scrollLeft = cycle * 3 + within;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(normalize);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      event.preventDefault();
      const amount = event.deltaMode === 1 ? event.deltaY * 16
        : event.deltaMode === 2 ? event.deltaY * container.clientWidth
        : event.deltaY;
      container.scrollLeft += amount;
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    container.addEventListener("scroll", onScroll, { passive: true });
    container.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      container.removeEventListener("scroll", onScroll);
      container.removeEventListener("wheel", onWheel);
    };
  }, [initialProject, projects]);

  const move = (direction: number) => {
    const container = rail.current;
    if (!container) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    container.scrollBy({
      left: direction * container.clientWidth * 0.75,
      behavior: reduced ? "auto" : "smooth"
    });
  };

  return (
    <>
      <svg width="0" height="0" aria-hidden="true" focusable="false"
        style={{ position: "absolute", pointerEvents: "none" }}>
        <defs>
          <filter id="things-dev-light-logo" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" result="rg"
              values="1 -1 0 0 .5 1 -1 0 0 .5 1 -1 0 0 .5 0 0 0 0 1" />
            <feComponentTransfer in="rg" result="rgDifference">
              <feFuncR type="table" tableValues="1 0 1" />
              <feFuncG type="table" tableValues="1 0 1" />
              <feFuncB type="table" tableValues="1 0 1" />
            </feComponentTransfer>
            <feColorMatrix in="SourceGraphic" type="matrix" result="rb"
              values="1 0 -1 0 .5 1 0 -1 0 .5 1 0 -1 0 .5 0 0 0 0 1" />
            <feComponentTransfer in="rb" result="rbDifference">
              <feFuncR type="table" tableValues="1 0 1" />
              <feFuncG type="table" tableValues="1 0 1" />
              <feFuncB type="table" tableValues="1 0 1" />
            </feComponentTransfer>
            <feBlend in="rgDifference" in2="rbDifference"
              mode="lighten" result="colourDifference" />
            <feColorMatrix in="colourDifference" type="matrix" result="neutralMask"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 -10 0 0 0 1" />
            <feComposite in="neutralMask" in2="SourceAlpha"
              operator="in" result="whiteLetters" />
            <feComposite in="SourceGraphic" in2="neutralMask"
              operator="out" result="colourLetters" />
            <feComposite in="whiteLetters" in2="colourLetters"
              operator="arithmetic" k2="1" k3="1" />
          </filter>
        </defs>
      </svg>

      <main className="things-development-page" id="main"
        aria-labelledby="development-heading">
        <div className="things-development-header">
          <Header openMenu={() => setView("menu")} openProject={openProject} />
        </div>

        <div className="things-dev-heading">
          <div>
            <Link className="things-dev-back" href="/projects">
              ↖ Back to projects
            </Link>
            <h1 id="development-heading">Development.</h1>
          </div>
          <p>Selected websites and digital experiences.</p>
        </div>

        <section className="things-dev-gallery" aria-label="Development projects">
          <aside className="things-dev-sidebar">
            <span className="things-dev-label">Our work</span>
            <Link href="/projects">All projects</Link>
            <Link href="/projects/design">Design</Link>
            <Link href="/projects/development" aria-current="page">
              Development
            </Link>
            <span className="things-dev-count">
              {String(projects.length).padStart(2, "0")} projects
            </span>
          </aside>

          <div className="things-dev-rail" ref={rail}
            tabIndex={0} aria-label="Scrollable project gallery"
            data-lenis-prevent>
            {Array.from({ length: 7 }, () => projects).flat().map((project, index) => (
              <Link key={project.id + "-" + index} className="things-dev-card"
                href={"/projects/development/" + encodeURIComponent(project.id)}>
                <div className="things-dev-card-number">
                  <span>{String(index % projects.length + 1).padStart(2, "0")}</span>
                  <span aria-hidden="true">↗</span>
                </div>

                <div className="things-dev-card-media">
                  <span className="things-dev-placeholder">{project.title}</span>
                  {covers[project.id] && (
                    <Image src={covers[project.id]} alt={project.title + " website preview"}
                      fill sizes="(max-width: 640px) 78vw, (max-width: 1000px) 42vw, 25vw"
                      priority={index === projects.length * 3}
                      onError={event => { event.currentTarget.style.opacity = "0"; }} />
                  )}
                </div>

                <div className="things-dev-card-caption">
                  <h2>{project.title}</h2>
                  <p>{project.type}</p>
                  <span>{project.techStack.join(" / ")}</span>
                </div>
              </Link>
            ))}
            {!projects.length && <p className="things-dev-empty">New projects are on their way.</p>}
          </div>
        </section>

        <footer className="things-dev-footer">
          <p>Things / Development</p>
          <span>Scroll sideways to explore</span>
          <div className="things-dev-arrows">
            <button type="button" aria-label="Scroll to previous projects"
              onClick={() => move(-1)}>←</button>
            <button type="button" aria-label="Scroll to next projects"
              onClick={() => move(1)}>→</button>
          </div>
        </footer>
      </main>

      <StudioDialog view={view} onClose={() => setView(null)}
        openProject={openProject} />
    </>
  );
}

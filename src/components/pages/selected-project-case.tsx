"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { StudioDialog, type DialogView } from "@/components/layout/studio-dialog";
import type { selectedWorkProjects } from "@/data/selected-work-projects";
import "./selected-project-case.css";

type Project = (typeof selectedWorkProjects)[number];

export function SelectedProjectCase({
  project, nextProject
}: { project: Project; nextProject: Project }) {
  const [view, setView] = useState<DialogView>(null);
  const openProject = () => setView("project");
  const study = project.caseStudy;
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const nextHref = `/work/${nextProject.id}`;

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [project.id]);

  useEffect(() => {
    router.prefetch(nextHref);
  }, [router, nextHref]);

  useEffect(() => {
    if (!leaving) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const timer = window.setTimeout(() => {
      router.push(nextHref, { scroll: true });
    }, reduced ? 0 : 280);

    return () => window.clearTimeout(timer);
  }, [leaving, router, nextHref]);

  const facts = [
    { label: "Status", value: project.status },
    ...study.details,
    { label: "Role", value: project.services.join(" / ") }
  ];

  const picture = (index: number, hero = false) => (
    <div className={hero ? "things-study-hero-image" : "things-study-picture"}>
      <Image
        src={project.images[index].src}
        alt={`${project.alt} — preview ${index + 1}`}
        fill
        sizes={hero ? "96vw" : "(max-width: 767px) 92vw, 70vw"}
        priority={hero}
      />
    </div>
  );

  return (
    <>
      <Header openMenu={() => setView("menu")} openProject={openProject} />
      <main id="main" className={`things-study things-study-fade${leaving ? " is-leaving" : ""}`}>
        <header className="things-study-intro">
          <Link href="/#work" className="things-study-back">← Selected work</Link>
          <p className="things-study-name">{project.title}</p>
          <h1>{study.heading}</h1>
          <p className="things-study-meta">{project.meta}</p>
        </header>

        {picture(0, true)}

        <section className="things-study-text" aria-labelledby="study-about">
          <h2 id="study-about">About</h2>
          <div className="things-study-copy">
            {study.about.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            <div className="things-study-links">
              <a href={project.href} target="_blank" rel="noopener noreferrer">
                Visit website ↗
              </a>
              {project.figmaUrl && (
                <a href={project.figmaUrl} target="_blank" rel="noopener noreferrer">
                  View Figma ↗
                </a>
              )}
            </div>
            <dl className="things-study-facts">
              {facts.map(fact => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className="things-study-gallery">{picture(1)}</div>

        <section className="things-study-text" aria-labelledby="study-challenge">
          <h2 id="study-challenge">The challenge</h2>
          <div className="things-study-copy">
            <h3>{study.challenge}</h3>
            {study.challengeBody.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </section>

        <div className="things-study-gallery">{picture(2)}</div>

        <section className="things-study-text" aria-labelledby="study-outcome">
          <h2 id="study-outcome">
            {project.status === "In Progress" ? "Progress so far" : "The outcome"}
          </h2>
          <div className="things-study-copy">
            <h3>{study.outcome}</h3>
            {study.outcomeBody.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </section>

        <div className="things-study-gallery">{picture(3)}</div>

        <footer className="things-study-ending">
          <Link href="/#work">← Selected work</Link>
          <Link
            href={nextHref}
            className="things-study-next"
            onClick={event => {
              if (event.button !== 0 ||
                  event.metaKey || event.ctrlKey ||
                  event.shiftKey || event.altKey) return;
              event.preventDefault();
              if (!leaving) setLeaving(true);
            }}
          >
            <span>Next project</span>
            <strong>{nextProject.title} ↗</strong>
          </Link>
        </footer>
      </main>

      <StudioDialog
        view={view}
        onClose={() => setView(null)}
        openProject={openProject}
      />
    </>
  );
}

"use client";
import { ProjectPreviewCard } from "./project-preview-card";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { StudioDialog, type DialogView } from "@/components/layout/studio-dialog";
import type { WorkProject } from "@/data/work-projects";
import "./project-case-study.css";

export type CaseImage = {
  src: string;
  width: number;
  height: number;
  label: string;
};

export function ProjectCaseStudy({ project, images, cover, nextProject, nextCover }: {
  project: WorkProject;
  images: CaseImage[];
  cover?: string;
  nextProject?: WorkProject; nextCover?: string;
}) {
  const [view, setView] = useState<DialogView>(null);
  const [active, setActive] = useState("case-intro");
  const reduce = useReducedMotion();
  const router = useRouter();
  const back = "/projects/development?project=" + encodeURIComponent(project.id);
  const openProject = () => setView("project");
  const sections = [
    { id: "case-intro", label: "Overview", src: cover || images[0]?.src },
    ...images.map((image, index) => ({
      id: "case-image-" + index, label: image.label, src: image.src
    }))
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) =>
          Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
        );
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: "-20% 0px -60% 0px", threshold: 0 });

    document.querySelectorAll("[data-case-section]")
      .forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, [project.id, images]);

  useEffect(() => {
    function close(event: KeyboardEvent) {
      if (event.key === "Escape" && !view && !document.querySelector("dialog[open]")) {
        router.push(back);
      }
    }
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [view, router, back]);

  const facts = [
    ["Type", project.type],
    ["Role", project.services.join(" / ")],
    ["Category", project.category],
    ["Technology", project.techStack.join(" / ")],
    ["Location", project.location],
    ["Status", project.timeline || (project.href ? null : "In progress")]
  ].filter(([, value]) => value);

  return <main id="main" className="things-case-page" aria-labelledby="case-heading">
    <div className="things-case-backdrop" aria-hidden="true">
      {(cover || images[0]?.src) && <Image src={cover || images[0].src}
        alt="" fill sizes="100vw" loading="eager" />}
    </div>

    <div className="things-case-header">
      <Header openMenu={() => setView("menu")} openProject={openProject} />
    </div>

    <Link href={back} className="things-case-close"
      aria-label="Close project and return to Development">Close ×</Link>

    <motion.div className="things-case-column"
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : .65, ease: [.22, 1, .36, 1] }}>

      <section id="case-intro" className="things-case-intro"
        data-case-section tabIndex={-1}>
        <p className="things-case-eyebrow">Development / Case study</p>
        <h1 id="case-heading">{project.title}</h1>

        <dl className="things-case-facts">
          {facts.map(([label, value]) => <div key={label}>
            <dt>{label}</dt><dd>{value}</dd>
          </div>)}
        </dl>

        {project.href && <a className="things-case-visit" href={project.href}
          target="_blank" rel="noopener noreferrer">Visit website ↗</a>}

        <p className="things-case-description">{project.description}</p>
      </section>

      <section className="things-case-images"
        aria-label={project.title + " website screenshots"}>
        {images.map((image, index) => <figure key={image.src}
          id={"case-image-" + index} data-case-section tabIndex={-1}>
          <Image src={image.src} alt={project.title + " — " + image.label}
            width={image.width} height={image.height}
            sizes="(max-width: 767px) 92vw, 68vw" loading="lazy" />
          <figcaption>
            <span>{String(index + 1).padStart(2, "0")}</span>{image.label}
          </figcaption>
        </figure>)}
        {!images.length && <p className="things-case-empty">Project images coming soon.</p>}
      </section>

      <footer className="things-case-ending">
        <Link href={back}>← Back to Development</Link>
        {nextProject && <ProjectPreviewCard project={nextProject} cover={nextCover} />}
      </footer>
    </motion.div>

    <nav className="things-case-index" aria-label="Project sections">
      {sections.map((section, index) => <a key={section.id}
        href={"#" + section.id} aria-label={"Go to " + section.label}
        aria-current={active === section.id ? "location" : undefined}
        style={{ "--case-accent": index % 2
          ? "var(--things-brand-blue, #0a23fc)"
          : "var(--things-brand-red, #d61415)" } as CSSProperties}>
        {section.src
          ? <Image src={section.src} alt="" fill sizes="80px" />
          : <span>{String(index + 1).padStart(2, "0")}</span>}
      </a>)}
    </nav>

    <StudioDialog view={view} onClose={() => setView(null)} openProject={openProject} />
  </main>;
}
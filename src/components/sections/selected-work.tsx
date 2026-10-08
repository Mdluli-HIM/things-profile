"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { selectedWorkProjects as workProjects } from "@/data/selected-work-projects";
import "./selected-work.css";

type ProjectImage = {
  src: string;
  width?: number;
  height?: number;
  label?: string;
};

const galleries: Record<string, ProjectImage[]> = Object.fromEntries(
  workProjects.map(project => [project.id, project.images])
);
const thumbnails: Record<string, string> = Object.fromEntries(
  workProjects.map(project => [project.id, project.thumb])
);

export function SelectedWork() {
  const router = useRouter();

  /* Selected Work automatic scrolling */
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose = () => {};

    const setup = () => {
      dispose();
      dispose = () => {};
      if (preference.matches) return;

      const rows = Array.from(
        section.querySelectorAll<HTMLElement>(".things-selected-strip")
      ).flatMap(strip => {
        const originals = Array.from(strip.children) as HTMLElement[];
        if (originals.length < 2) return [];

        const copies = originals.map(original => {
          const copy = original.cloneNode(true) as HTMLElement;
          copy.setAttribute("aria-hidden", "true");
          copy.querySelectorAll("a").forEach(link => {
            link.setAttribute("tabindex", "-1");
          });
          strip.appendChild(copy);
          return copy;
        });

        return [{
          strip,
          originals,
          copies,
          cycle: 0,
          position: strip.scrollLeft,
          visible: false
        }];
      });

      let frame = 0;
      let previous = 0;
      let stopped = false;

      const measure = () => {
        rows.forEach(row => {
          row.cycle =
            row.copies[0].offsetLeft - row.originals[0].offsetLeft;
        });
      };

      const shouldRun = () =>
        !stopped && !document.hidden && rows.some(row => row.visible);

      const tick = (now: number) => {
        frame = 0;
        if (!shouldRun()) {
          previous = 0;
          return;
        }

        const elapsed = previous ? Math.min(now - previous, 50) : 0;
        previous = now;
        const visibleRows = rows.filter(row => row.visible && row.cycle > 0);

        // Read first, then write, without measuring layout each frame.
        visibleRows.forEach(row => {
          const actual = row.strip.scrollLeft;
          if (Math.abs(actual - row.position) > 2) {
            row.position = actual;
          }
          row.position = (row.position + elapsed * 0.018) % row.cycle;
        });

        visibleRows.forEach(row => {
          row.strip.scrollLeft = row.position;
        });

        frame = requestAnimationFrame(tick);
      };

      const sync = () => {
        if (shouldRun()) {
          if (!frame) {
            previous = 0;
            frame = requestAnimationFrame(tick);
          }
        } else {
          cancelAnimationFrame(frame);
          frame = 0;
          previous = 0;
        }
      };

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const row = rows.find(row => row.strip === entry.target);
          if (row) row.visible = entry.isIntersecting;
        });
        sync();
      });

      measure();
      const resize = new ResizeObserver(measure);
      rows.forEach(row => {
        observer.observe(row.strip);
        resize.observe(row.strip);
        resize.observe(row.originals[0]);
      });
      document.addEventListener("visibilitychange", sync);

      dispose = () => {
        stopped = true;
        cancelAnimationFrame(frame);
        observer.disconnect();
        resize.disconnect();
        document.removeEventListener("visibilitychange", sync);
        rows.forEach(row => row.copies.forEach(copy => copy.remove()));
      };
    };

    setup();
    preference.addEventListener("change", setup);
    return () => {
      preference.removeEventListener("change", setup);
      dispose();
    };
  }, []);


  return (
    <section
      id="work"
      ref={sectionRef}
      className="things-selected"
      aria-labelledby="things-work-heading"
    >
      <div className="things-selected-heading">
        <div>
          <h2 id="things-work-heading">Selected work.</h2>
          <p>
            A selection of projects across design, motion and development.
          </p>
        </div>

        <Link href="/projects" className="things-selected-all">
          Explore all work <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="things-selected-projects">
        {workProjects.map(project => {
          const images = galleries[project.id]?.length
            ? galleries[project.id]
            : thumbnails[project.id]
              ? [{ src: thumbnails[project.id], label: "Project overview" }]
              : [];

          const href = `/work/${project.id}`;

          return (
            <article
              className="things-selected-project"
              onClick={event => {
                if (event.defaultPrevented ||
                    event.button !== 0 ||
                    event.metaKey || event.ctrlKey ||
                    event.shiftKey || event.altKey) return;
                const target = event.target as HTMLElement;
                if (target.closest("a, button") ||
                    window.getSelection()?.toString()) return;
                router.push(href);
              }}
              key={project.id}
              aria-labelledby={`selected-${project.id}`}
            >
              <div
                className="things-selected-strip"
                role="region"
                aria-label={`${project.title} previews`}
                tabIndex={images.length > 1 ? 0 : undefined}
              >
                {images.map((image, index) => {
                  const preview = (
                    <Image
                      src={image.src}
                      alt={`${project.alt} — ${image.label || `preview ${index + 1}`}`}
                      fill
                      sizes="(max-width: 767px) 78vw, (max-width: 1167px) 280px, (max-width: 2000px) 24vw, 480px"
                    />
                  );

                  return href ? (
                    <Link
                      key={`${image.src}-${index}`}
                      href={href}
                      className="things-selected-image"
                      aria-label={`View ${project.title}: ${image.label || `preview ${index + 1}`}`}
                    >
                      {preview}
                    </Link>
                  ) : (
                    <div
                      key={`${image.src}-${index}`}
                      className="things-selected-image"
                    >
                      {preview}
                    </div>
                  );
                })}

                {!images.length && (
                  <div className="things-selected-image things-selected-empty">
                    <span>Coming soon.</span>
                  </div>
                )}
              </div>

              <div className="things-selected-caption">
                <div>
                  <h3 id={`selected-${project.id}`}>
                    {href ? (
                      <Link href={href}>{project.title}</Link>
                    ) : (
                      project.title
                    )}
                  </h3>
                  <p>{project.services.join(" / ")}</p>
                  {project.status === "In Progress" && (
                    <p className="things-selected-status">In progress</p>
                  )}
                </div>

                {href ? (
                  <Link
                    href={href}
                    className="things-selected-arrow"
                    aria-label={`View ${project.title}`}
                  >
                    <span aria-hidden="true">↗</span>
                  </Link>
                ) : (
                  <span className="things-selected-status">In progress</span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

import Image from "next/image";
import { workProjects, type WorkProject } from "@/data/work-projects";
import thumbnailData from "@/data/work-thumbnails.json";
import "./selected-work.css";

const thumbnails = thumbnailData as Record<string, string>;

function ProjectContent({
  project,
  index
}: {
  project: WorkProject;
  index: number;
}) {
  const thumbnail = thumbnails[project.id];

  return (
    <>
      <div className="things-work-summary">
        <h3 className="things-work-title">{project.title}</h3>
        <p className="things-work-services">
          {project.services.join(" / ")}
        </p>
      </div>

      <div className="things-work-meta">
        <p>{project.type}</p>
        {project.location && <p>{project.location}</p>}
      </div>

      <div className="things-work-thumbnail" aria-hidden="true">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="(max-width: 767px) 88px, 120px"
          />
        ) : (
          <span className="things-work-placeholder">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>
    </>
  );
}

export function SelectedWork() {
  return (
    <section
      id="work"
      className="things-work"
      aria-labelledby="things-work-heading"
    >
      <div className="things-work-inner">
        <div className="things-work-intro">
          <h2 id="things-work-heading">Selected work.</h2>
          <p>
            A selection of projects across design, motion and development.
          </p>
        <a href="/projects/design" className="things-work-gallery-link">Explore all work <span aria-hidden="true">↗</span></a>
        </div>

        <div className="things-work-list">
          {workProjects.map((project, index) => (
            <article className="things-work-project" key={project.id}>
              {project.href ? (
                <a className="things-work-row" href={project.href}>
                  <ProjectContent project={project} index={index} />
                </a>
              ) : (
                <div className="things-work-row things-work-row--upcoming">
                  <ProjectContent project={project} index={index} />
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";
import Image from "next/image";
import Link from "next/link";
import type { WorkProject } from "@/data/work-projects";

export function ProjectPreviewCard({ project, cover }: {
  project: WorkProject;
  cover?: string;
}) {
  return <Link href={"/projects/development/" + encodeURIComponent(project.id)}
    className="things-case-next things-case-preview-card"
    aria-label={"View " + project.title + " project"}>
    <span className="things-case-preview-window" aria-hidden="true">
      <span className="things-case-preview-bar"><i /><i /><i /></span>
      <span className="things-case-preview-image">
        <span className="things-case-preview-placeholder">{project.title}</span>
        {cover && <Image src={cover} alt="" fill
          sizes="(max-width: 767px) 82vw, 420px"
          onError={event => { event.currentTarget.style.opacity = "0"; }} />}
      </span>
    </span>
    <span className="things-case-preview-caption">
      <span>Next project</span><strong>{project.title} ↗</strong>
    </span>
  </Link>;
}
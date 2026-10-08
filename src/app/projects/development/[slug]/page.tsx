
import { notFound } from "next/navigation";
import { ProjectCaseStudy, type CaseImage } from "@/components/pages/project-case-study";
import { workProjects } from "@/data/work-projects";
import thumbnails from "@/data/work-thumbnails.json";
import developmentImages from "@/data/development-images.json";
import caseImages from "@/data/project-case-images.json";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return workProjects.map(project => ({ slug: project.id }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = workProjects.find(project => project.id === slug);
  return {
    title: project ? project.title + " — Things" : "Project — Things",
    description: project?.description
  };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = workProjects.findIndex(project => project.id === slug);
  if (index < 0) notFound();

  const project = workProjects[index];
  const covers: Record<string, string> = { ...thumbnails, ...developmentImages };
  return <ProjectCaseStudy key={project.id} project={project}
    cover={covers[project.id]}
    images={(caseImages as Record<string, CaseImage[]>)[project.id] || []}
    nextProject={workProjects.length > 1
      ? workProjects[(index + 1) % workProjects.length] : undefined} nextCover={(() => { const next = workProjects.length > 1
      ? workProjects[(index + 1) % workProjects.length] : undefined; return next ? (caseImages as Record<string, CaseImage[]>)[next.id]?.[0]?.src || covers[next.id] : undefined; })()} />;
}
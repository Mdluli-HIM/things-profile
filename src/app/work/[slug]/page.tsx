import { notFound } from "next/navigation";
import { selectedWorkProjects } from "@/data/selected-work-projects";
import { SelectedProjectCase } from "@/components/pages/selected-project-case";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return selectedWorkProjects.map(project => ({ slug: project.id }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = selectedWorkProjects.find(item => item.id === slug);
  return {
    title: project ? `${project.title} — Things` : "Project — Things",
    description: project?.caseStudy.about[0]
  };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const index = selectedWorkProjects.findIndex(item => item.id === slug);
  if (index < 0) notFound();

  return (
    <SelectedProjectCase
      key={selectedWorkProjects[index].id}
      project={selectedWorkProjects[index]}
      nextProject={selectedWorkProjects[(index + 1) % selectedWorkProjects.length]}
    />
  );
}

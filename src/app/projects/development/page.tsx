
import { DevelopmentProjects } from "@/components/pages/development-projects";
import { workProjects } from "@/data/work-projects";
import thumbnails from "@/data/work-thumbnails.json";
import developmentImages from "@/data/development-images.json";

export const metadata = { title: "Development projects — Things" };

export default async function DevelopmentPage({ searchParams }: {
  searchParams: Promise<{ project?: string | string[] }>;
}) {
  const query = await searchParams;
  const initialProject = typeof query.project === "string" ? query.project : undefined;
  return <DevelopmentProjects key={initialProject || "development"}
    initialProject={initialProject} projects={workProjects}
    covers={{ ...thumbnails, ...developmentImages }} />;
}
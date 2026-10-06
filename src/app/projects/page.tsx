import categoryCovers from "@/data/category-images.json";
import { CategoryLanding } from "@/components/pages/category-landing";
export const metadata = { title: "Projects — Things" };
export default function ProjectsPage() {
  return <CategoryLanding mode="projects" covers={categoryCovers} />;
}

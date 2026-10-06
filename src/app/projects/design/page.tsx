import { WorkGallery } from "@/components/pages/work-gallery";
import images from "@/data/work-gallery.json";

export const metadata = { title: "Design projects — Things" };
export default function DesignProjectsPage() {
  return <WorkGallery images={images} />;
}

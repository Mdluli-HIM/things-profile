import { WorkGallery } from "@/components/pages/work-gallery";
import images from "@/data/graphics-gallery.json";

export const metadata = {
  title: "Graphics — Things",
  description: "Graphic design and visual work by Things."
};

export default function GraphicsPage() {
  return <WorkGallery key="graphics" images={images} title="Graphics" />;
}

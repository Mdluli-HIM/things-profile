import categoryCovers from "@/data/category-images.json";
import { CategoryLanding } from "@/components/pages/category-landing";
export const metadata = { title: "Services — Things" };
export default function ServicesPage() {
  return <CategoryLanding mode="services" covers={categoryCovers} />;
}

export const workCategories = [
  {
    id: "strategy", number: "01", title: "Strategy",
    capabilities: ["Brand positioning", "SEO strategy", "Digital marketing", "Content direction"],
    description: "We start by understanding your business, your audience and what you want to achieve. That gives us a clear direction for your brand and website, so every decision supports the bigger picture."
  },
  {
    id: "design", number: "02", title: "Design",
    capabilities: ["Web design", "Graphic design", "Brand identity", "UI/UX design", "Creative direction", "Interaction design"],
    description: "We shape how your business looks and feels, online and in print. From brand identities and graphic design to websites and digital experiences, we create a clear visual language that connects everything you put into the world."
  },
  {
    id: "development", number: "03", title: "Development",
    capabilities: ["Custom websites", "E-commerce", "WordPress & Next.js", "Headless CMS"],
    description: "We turn the design into a fast, responsive website that works across devices. The technology fits your project, with a clear structure that makes the site easier to manage, maintain and develop as your business grows."
  }
] as const;
export type CategoryId = (typeof workCategories)[number]["id"];

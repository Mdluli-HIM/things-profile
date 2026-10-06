export type WorkProject = {
  id: string;
  title: string;
  href: string | null;
  services: string[];
  type: string;
  location: string | null;
  category: string;
  techStack: string[];
  description: string;
  timeline?: string;
};

export const workProjects: WorkProject[] = [
  {
    id: "xibelani",
    title: "Xibelani",
    href: "https://south-side-ten.vercel.app/",
    services: [
      "UI/UX Design",
      "Visual Design",
      "Motion",
      "Frontend Development"
    ],
    type: "Cultural Fashion E-commerce UI/UX Case Study",
    location: "Limpopo & Mpumalanga, South Africa",
    category: "Heritage Fashion / E-commerce / Brand Experience",
    techStack: ["Next.js", "TypeScript", "GSAP", "CSS"],
    timeline: "Completed Case Study",
    description:
      "Xibelani is a traditional attire e-commerce case study celebrating the knee-length pleated skirt and indigenous dance of Tsonga women from Limpopo and Mpumalanga. The work covers homepage storytelling, heritage archive, dedicated collection archive, shop browsing, product presentation, contact, and brand narrative across desktop and mobile."
  },
  {
    id: "noir-faces",
    title: "Noir Faces",
    href: "https://studio-tau-pearl.vercel.app/",
    services: [
      "UI/UX Design",
      "Visual Design",
      "Frontend Development"
    ],
    type: "Editorial UI/UX + Visual Design Case Study",
    location: "Cape Town, South Africa",
    category: "Editorial / Photography / Visual Design",
    techStack: ["Next.js", "TypeScript", "GSAP", "Lenis"],
    description:
      "Noir Faces is an editorial photography case study built around monochrome contrast, negative space, and gallery-led pacing — showing how layout, typography, and imagery create premium digital experiences without clutter. The work demonstrates clear hierarchy, consistent spacing, intentional white space, and responsive image treatment."
  },
  {
    id: "meroe-group",
    title: "Meroe Group",
    href: "https://meroe-group.vercel.app/",
    services: ["Project details coming soon"],
    type: "Website Project",
    location: null,
    category: "Details coming soon",
    techStack: [],
    description: "Project information will be added soon."
  },
  {
    id: "upcoming-project",
    title: "Next project",
    href: null,
    services: ["Details coming soon"],
    type: "In progress",
    location: null,
    category: "Details coming soon",
    techStack: [],
    description: "A new project is in progress. Details will follow."
  }
];

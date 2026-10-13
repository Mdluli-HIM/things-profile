export const studioContact: {
  email: string;
  phones: { number: string; href: string }[];
  website: string;
  whatsappHref: string;
  socials: { label: string; url: string; accessibleLabel?: string }[];
} = {
  email: "hello@thingsdesign.co.za",
  phones: [
    { number: "+27 68 036 4445", href: "tel:+27680364445" },
    { number: "+27 76 950 1959", href: "tel:+27769501959" }
  ],
  website: "https://www.thingsdesign.co.za",
  whatsappHref: "https://wa.me/27680364445",
  socials: [
    {
      label: "Instagram",
      url: "https://www.instagram.com/hellothingsdesign.co.za/",
      accessibleLabel: "Things on Instagram (opens in a new tab)"
    },
    {
      label: "Pinterest",
      url: "https://www.pinterest.com/thingsdesignstudio/",
      accessibleLabel: "Things on Pinterest (opens in a new tab)"
    },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/marcus-mdluli-aaa627443/",
      accessibleLabel: "Marcus Mdluli, founder of Things, on LinkedIn (opens in a new tab)"
    },
    {
      label: "Behance",
      url: "https://www.behance.net/thingsdesign1/",
      accessibleLabel: "Things on Behance (opens in a new tab)"
    }
  ]
};

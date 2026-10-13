import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import "./graphic-work.css";

const graphics = [
  {
    title: "DRY",
    category: "Brand visuals",
    image: "/images/graphics/branding-dry.png",
    width: 1198,
    height: 1313,
    alt: "DRY drink campaign with packaging, typography and outdoor posters"
  },
  {
    title: "Ntsaki’s Bakery",
    category: "Campaign design",
    image: "/images/graphics/bakery.jpeg",
    width: 1254,
    height: 1254,
    alt: "Blue and cream promotional artwork for Ntsaki’s Bakery raisin scones"
  },
  {
    title: "Culture Event",
    category: "Event poster",
    image: "/images/graphics/culture.png",
    width: 1086,
    height: 1448,
    alt: "Cultural Heritage Day poster with bold lettering and traditional patterns"
  }
];

export function GraphicWork() {
  return (
    <section id="graphics" className="things-graphics" aria-labelledby="graphics-heading">
      <div className="things-graphics-heading">
        <div>
          <h2 id="graphics-heading">Graphic design.</h2>
          <p>
            Brand visuals, campaign artwork and event posters.
            Thoughtful design for the things people see, share and remember.
          </p>
        </div>
        <Link href="/projects/graphics" className="things-graphics-link">
          Explore graphics <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>

      <div className="things-graphics-grid">
        {graphics.map(graphic => (
          <Link
            key={graphic.image}
            href="/projects/graphics"
            className="things-graphics-project"
            aria-label={`Explore ${graphic.title} and more graphic work`}
          >
            <div className="things-graphics-image">
              <Image
                src={graphic.image}
                alt={graphic.alt}
                width={graphic.width}
                height={graphic.height}
                sizes="(max-width: 767px) 92vw, 32vw"
              />
            </div>
            <div className="things-graphics-caption">
              <div>
                <h3>{graphic.title}</h3>
                <p>{graphic.category}</p>
              </div>
              <ArrowUpRight size={22} aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

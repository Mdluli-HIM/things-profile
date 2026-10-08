"use client";

import Image from "next/image";
import { useState } from "react";
import "./services.css";

const services = [
  {
    "title": "Web Applications",
    "description": "Purpose-built web applications that make complex tasks feel simple.",
    "image": "/images/services/web-applications.png"
  },
  {
    "title": "Mobile Applications",
    "description": "Product experiences for any device, designed for clarity.",
    "image": "/images/services/mobile-applications.png"
  },
  {
    "title": "Design System",
    "description": "Reusable components and clear guidelines that keep your product consistent.",
    "image": "/images/services/design-system.png"
  },
  {
    "title": "Websites",
    "description": "Distinctive websites designed and built around your business.",
    "image": "/images/services/websites.png"
  },
  {
    "title": "Brand",
    "description": "A clear visual identity that makes your business recognisable.",
    "image": "/images/services/brand.png"
  },
  {
    "title": "Creative Direction",
    "description": "A consistent visual point of view across every touchpoint.",
    "image": "/images/services/creative-direction.png"
  }
];

export function Services() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      id="services"
      className="things-offer"
      aria-labelledby="services-heading"
    >
      <div className="things-offer-intro">
        <div>
          <p className="things-offer-label">02 / Things we do</p>
          <h2 id="services-heading">Things we do.</h2>
        </div>

        <div className="things-offer-intro-copy">
          <p>
            We help businesses turn what makes them different into
            brands, websites and digital experiences with a clear
            point of view.
          </p>
          <a href="#contact" className="things-offer-contact">
            Get in touch <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div
        className="things-offer-list"
        onMouseLeave={() => {
          if (window.matchMedia("(hover: hover)").matches) {
            setActive(null);
          }
        }}
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setActive(null);
          }
        }}
      >
        {services.map((service, index) => (
          <div
            key={service.title}
            className="things-offer-row"
            data-active={active === index}
            data-accent={index % 2 === 0 ? "blue" : "red"}
            onMouseEnter={() => {
              if (window.matchMedia("(hover: hover)").matches) {
                setActive(index);
              }
            }}
          >
            <button
              type="button"
              className="things-offer-trigger"
              aria-expanded={active === index}
              aria-controls={`things-offer-preview-${index}`}
              onFocus={() => setActive(index)}
              onClick={() => {
                if (window.matchMedia("(hover: hover)").matches) {
                  setActive(index);
                } else {
                  setActive(current => current === index ? null : index);
                }
              }}
            >
              <span className="things-offer-description">
                {service.description}
              </span>
              <span className="things-offer-title">{service.title}</span>
            </button>

            <div
              id={`things-offer-preview-${index}`}
              className="things-offer-preview"
              aria-hidden={active !== index}
            >
              <div className="things-offer-photo">
                <Image
                  src={service.image}
                  alt={`${service.title} — Things preview`}
                  fill
                  sizes="(max-width: 900px) 90vw, 24vw"
                />
              </div>
              <p className="things-offer-mobile-description">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

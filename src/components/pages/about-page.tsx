"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { StudioDialog, type DialogView } from "@/components/layout/studio-dialog";
import "./about-page.css";

const services = [
  {
    title: "Web Applications",
    label: "Tools with purpose",
    description: "Interfaces that make complex tasks feel straightforward. We bring user flows, interface design and frontend development together to shape useful digital products.",
    image: "/images/freshdash/image-1.png",
    alt: "FreshDash storefront interface"
  },
  {
    title: "Mobile Applications",
    label: "Designed around everyday use",
    description: "Mobile application design built around clear journeys, thoughtful interactions and the way people use a small screen. From early flows to detailed interfaces, every step has a purpose.",
    image: "/images/freshdash/image-2.png",
    alt: "FreshDash commerce project detail"
  },
  {
    title: "Design System",
    label: "Consistency from the start",
    description: "A shared visual language for your product. We organise typography, colour, components and interaction states so your experience stays coherent as it grows.",
    image: "/images/work/noir-faces/image-2.png",
    alt: "Typography and layout in the Noir Faces project"
  },
  {
    title: "Websites",
    label: "A considered digital presence",
    description: "Responsive websites that balance personality with clarity. We connect content, design and development to help people understand your business and take the next step.",
    image: "/images/work/cocofizz/image-1.png",
    alt: "CocoFizz hospitality website"
  },
  {
    title: "Brand",
    label: "Something recognisably yours",
    description: "Visual identities and graphic design that express what makes your business different. We consider how type, colour and imagery work together across digital and print.",
    image: "/images/work/xibelani/image-1.png",
    alt: "Xibelani cultural fashion brand experience"
  },
  {
    title: "Creative Direction",
    label: "A clear point of view",
    description: "A focused direction for how your brand looks and feels. We bring imagery, layout and motion into one coherent expression, with attention to the details that give it character.",
    image: "/images/work/noir-faces/image-1.png",
    alt: "Noir Faces editorial art direction"
  }
];

export function AboutPage() {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const headerWrap = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<DialogView>(null);
  const [active, setActive] = useState(0);
  const selected = services[active];
  const openContact = () => router.push("/contact");

  useEffect(() => {
    const header = headerWrap.current?.querySelector("header");
    if (!header) return;
    const update = () => {
      root.current?.style.setProperty(
        "--about-header-height",
        header.getBoundingClientRect().height + "px"
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="things-about-page" ref={root}>
      <div ref={headerWrap}>
        <Header openMenu={() => setView("menu")} openProject={openContact} />
      </div>

      <main id="main">
        <section className="ta-hero" aria-labelledby="ta-heading">
          <div className="ta-hero-top">
            <p className="ta-label">About us / Things studio</p>
            <p className="ta-introduction">
              Things is an independent design and development studio based in
              Cape Town. We help businesses turn what makes them different into
              brands, websites and digital experiences with a clear point of view.
            </p>
          </div>

          <h1 id="ta-heading">
            Small studio.<br />
            Clear thinking.<br />
            <span className="ta-red">Good things</span><span className="ta-blue">.</span>
          </h1>

          <div className="ta-hero-bottom">
            <a href="#about-beliefs">
              Explore the studio <ArrowDown size={16} aria-hidden="true" />
            </a>
            <p>Cape Town, South Africa · Working globally</p>
          </div>
        </section>

        <section id="about-beliefs" className="ta-beliefs" aria-labelledby="ta-beliefs-heading">
          <h2 className="ta-label" id="ta-beliefs-heading">01 / What we believe</h2>
          <div>
            <p className="ta-statement">
              Good design starts with understanding.
              We bring <span className="ta-blue">clear thinking</span>,
              thoughtful design and careful development together
              to make things that matter.
            </p>
            <p className="ta-support">
              We care about how something works as much as how it looks.
              That means asking useful questions, simplifying where we can,
              and giving the details the attention they deserve.
            </p>
          </div>
        </section>

        <section className="ta-services" aria-labelledby="ta-services-heading">
          <div className="ta-section-top">
            <h2 className="ta-label" id="ta-services-heading">02 / Things we do</h2>
            <p>From the first idea to the final interaction.</p>
          </div>

          <div className="ta-services-grid">
            <div className="ta-service-visual">
              <figure className="ta-service-image">
                <Image
                  key={selected.image}
                  src={selected.image}
                  alt={selected.alt}
                  fill
                  sizes="(max-width: 767px) 90vw, 38vw"
                />
              </figure>
              <p className="ta-image-caption">A detail from our selected work.</p>
              <Link className="ta-text-link" href="/#work">
                Explore our work <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>

            <div className="ta-service-list">
              {services.map((service, index) => (
                <div className="ta-service-item" key={service.title} data-active={active === index}>
                  <h3>
                    <button
                      type="button"
                      id={"ta-service-button-" + index}
                      aria-expanded={active === index}
                      aria-controls={"ta-service-panel-" + index}
                      onClick={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      onPointerEnter={event => {
                        if (event.pointerType === "mouse") setActive(index);
                      }}
                    >
                      <span className="ta-service-kicker">
                        {String(index + 1).padStart(2, "0")} / {service.label}
                      </span>
                      <span className="ta-service-title">
                        {service.title}
                        <ArrowUpRight size={22} aria-hidden="true" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={"ta-service-panel-" + index}
                    role="region"
                    aria-labelledby={"ta-service-button-" + index}
                    hidden={active !== index}
                    className="ta-service-description"
                  >
                    <p>{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ta-partnership" aria-labelledby="ta-partnership-heading">
          <figure className="ta-wide-image">
            <Image
              src="/images/hero/hero-background.jpg"
              alt=""
              fill
              sizes="100vw"
            />
          </figure>
          <div className="ta-partnership-copy">
            <h2 id="ta-partnership-heading" className="ta-label">03 / Working together</h2>
            <div>
              <p className="ta-partnership-statement">
                Your ambition.<br />
                Our attention to <span className="ta-red">every detail.</span>
              </p>
              <p className="ta-support">
                Whether you are starting something new or improving what already
                exists, we work with you to understand the brief, shape a clear
                direction and bring it to life.
              </p>
              <Link href="/contact" className="ta-contact-button">
                Let’s talk <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="ta-footer">
        <div className="ta-wordmark" aria-hidden="true">
          things<span className="ta-red">.</span>
        </div>
        <div className="ta-footer-grid">
          <p className="ta-label">Good things start with a conversation.</p>
          <nav aria-label="About page footer">
            <Link href="/">Home</Link>
            <Link href="/#work">Work</Link>
            <Link href="/projects/design">Archived</Link>
            <Link href="/projects/graphics">Graphics</Link>
            <Link href="/about" aria-current="page">About us</Link>
            <Link href="/contact">Contacts</Link>
          </nav>
          <div className="ta-footer-contact">
            <a href="mailto:thingsinks@gmail.com">thingsinks@gmail.com</a>
            <a href="tel:+27680364445">+27 68 036 4445</a>
            <p>Cape Town based.<br />Working globally.</p>
          </div>
        </div>
        <div className="ta-footer-bottom">
          <p>© {new Date().getFullYear()} Things</p>
          <a href="#main">Back to top ↑</a>
        </div>
      </footer>

      <StudioDialog view={view} onClose={() => setView(null)} openProject={openContact} />
    </div>
  );
}

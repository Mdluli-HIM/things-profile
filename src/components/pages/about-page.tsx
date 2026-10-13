"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { StudioDialog, type DialogView } from "@/components/layout/studio-dialog";
import { studioContact } from "@/data/studio-contact";
import "./about-page.css";

export function AboutPage() {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const headerWrap = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<DialogView>(null);
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
              brands, graphic design, websites and digital experiences with a clear point of view.
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
          <h2 className="things-accessible-heading" id="ta-beliefs-heading">What we believe</h2>
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
            <h2 id="ta-partnership-heading" className="things-accessible-heading">Working together</h2>
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
            <a href={"mailto:" + studioContact.email}>{studioContact.email}</a>
            {studioContact.phones.map(phone => (
              <a key={phone.href} href={phone.href}>{phone.number}</a>
            ))}
            <p>Cape Town based.<br />Working globally.</p>
          </div>
        </div>
        <div className="ta-footer-bottom">
          <p>© {new Date().getFullYear()} Things</p>
          <nav className="ta-footer-socials" aria-label="Things social profiles">
            {studioContact.socials.filter(social => social.url).map(social => (
              <a
                key={social.label}
                href={social.url}
                aria-label={social.accessibleLabel || social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.label}
              </a>
            ))}
          </nav>
          <a href="#main">Back to top ↑</a>
        </div>
      </footer>

      <StudioDialog view={view} onClose={() => setView(null)} openProject={openContact} />
    </div>
  );
}

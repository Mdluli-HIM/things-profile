"use client";

import { ContactArchiveCarousel } from "./contact-archive-carousel";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { StudioDialog, type DialogView } from "@/components/layout/studio-dialog";
import { studioContact } from "@/data/studio-contact";
import "./contact-page.css";

// Prefilled contact enquiries
const enquiry = [
  "Hi Things,",
  "",
  "I'd like to enquire about a project.",
  "",
  "My name:",
  "Business / brand:",
  "What I need help with:",
  "Ideal timeline:",
  "",
  "Thank you!"
].join("\n");

const emailHref =
  "mailto:" + studioContact.email +
  "?subject=" + encodeURIComponent("Project enquiry — Things") +
  "&body=" + encodeURIComponent(enquiry);

const whatsappHref =
  studioContact.whatsappHref +
  "?text=" + encodeURIComponent(enquiry);


export function ContactPage() {
  const [view, setView] = useState<DialogView>(null);
  const openEmail = () => {
    window.location.href = emailHref;
  };

  return (
    <>
      <Header openMenu={() => setView("menu")} openProject={openEmail} />

      <main id="main" className="things-connect-page">
        <section className="things-connect-intro" aria-labelledby="connect-heading">
          <p className="things-connect-eyebrow">Cape Town based. Working globally.</p>

          <h1 id="connect-heading">
            Helping brands<br className="things-connect-mobile-break" /> stand apart.
          </h1>

          <a className="things-connect-email" href={emailHref}>
            {studioContact.email}
          </a>

          <div className="things-connect-actions">
            <a className="things-connect-primary" href={emailHref}>
              Get in touch <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a
              className="things-connect-secondary"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>

          <div className="things-connect-phones" aria-label="Call Things">
            <span>Call Things</span>
            {studioContact.phones.map(phone => (
              <a key={phone.href} href={phone.href}>{phone.number}</a>
            ))}
          </div>
        </section>

        <ContactArchiveCarousel />

        <footer className="things-connect-bottom">
          <p>© {new Date().getFullYear()} Things</p>
          <nav className="things-connect-socials" aria-label="Things social profiles">
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
          <a href={studioContact.website}>thingsdesign.co.za</a>
        </footer>
      </main>

      <StudioDialog
        view={view}
        onClose={() => setView(null)}
        openProject={openEmail}
      />
    </>
  );
}

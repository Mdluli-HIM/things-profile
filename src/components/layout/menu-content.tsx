"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { studioContact } from "@/data/studio-contact";
import "./menu-content.css";

const links = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Graphics", href: "/projects/graphics" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

const socialLinks = studioContact.socials.filter(social => social.url);

export function MenuContent({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const currentLink = links
    .filter(link => pathname === link.href || pathname?.startsWith(link.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <div className="things-menu-layout">
      <div className="things-menu-primary">
        <p className="things-menu-label">Independent design & development studio</p>
        <nav className="things-menu-pages" aria-label="Main navigation">
          {links.map(link => (
            <Link key={link.href} href={link.href} onClick={onClose}
              aria-current={currentLink === link.href ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="things-menu-contact">
          {studioContact.email && (
            <a href={"mailto:" + studioContact.email}>
              {studioContact.email}
            </a>
          )}
          {studioContact.phones.map(phone => (
            <a key={phone.href} href={phone.href}>
              {phone.number}
            </a>
          ))}
          <a
            href={studioContact.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Things on WhatsApp"
          >
            WhatsApp ↗
          </a>
          {socialLinks.length > 0 && (
            <nav className="things-menu-socials" aria-label="Things social media">
              {socialLinks.map(social => (
                <a key={social.label} href={social.url}
                  target="_blank" rel="noopener noreferrer"
                  aria-label={social.accessibleLabel || social.label}>
                  {social.label}<span aria-hidden="true"> ↗</span>
                </a>
              ))}
            </nav>
          )}
          <p>Cape Town, South Africa.<br />Working worldwide.</p>
        </div>
      </div>
      <aside className="things-menu-note" aria-label="Studio focus">
        <span>Digital products.</span>
        <span>Distinctive brands.</span>
        <span>Clear experiences.</span>
      </aside>
    </div>
  );
}

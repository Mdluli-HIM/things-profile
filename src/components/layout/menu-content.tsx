"use client";

import { useEffect as useMenuEffect, useState as useMenuState } from "react";
import { usePathname as useMenuPathname } from "next/navigation";

import { studioContact } from "@/data/studio-contact";





import "./menu-content.css";


const links = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/#studio" },
  { label: "Contact", href: "/#contact" }
];

export function MenuContent({ onClose }: { onClose: () => void }) {
  /* Things current navigation */
  const pathname = useMenuPathname();
  const [menuHash, setMenuHash] = useMenuState("");
  useMenuEffect(() => {
    const update = () => setMenuHash(window.location.hash);
    update();
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
    };
  }, [pathname]);
  function isCurrentMenuLink(href: string) {
    if (!pathname) return false;
    const currentPath = pathname.replace(/\/+$/, "") || "/";
    const [route, fragment] = href.split("#");
    const targetPath = route.replace(/\/+$/, "") || "/";
    if (fragment) return currentPath === targetPath && menuHash === "#" + fragment;
    if (targetPath === "/") {
      const sectionActive = links.some(item => item.href.startsWith("/#") && menuHash === item.href.slice(1));
      return currentPath === "/" && !sectionActive;
    }
    return currentPath === targetPath || currentPath.startsWith(targetPath + "/");
  }
  /* End Things current navigation */



  return (
    <div className="things-menu-layout">
      <div className="things-menu-primary">
        <p className="things-menu-label">Independent digital studio</p>
        <nav className="things-menu-pages" aria-label="Main navigation">
          {links.map(link => (
            <a key={link.href} href={link.href} onClick={onClose}
              aria-current={isCurrentMenuLink(link.href) ? "page" : undefined}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="things-menu-contact">
          {studioContact.email && (
            <a href={"mailto:" + studioContact.email}>
              {studioContact.email}
            </a>
          )}
          {studioContact.phone && (
            <a href={"tel:" + studioContact.phone.replace(/[^+0-9]/g, "")}>
              {studioContact.phone}
            </a>
          )}
          {studioContact.socials.some(social => social.label && social.url) && (
            <nav className="things-menu-socials" aria-label="Things social media">
              {studioContact.socials
                .filter(social => social.label && social.url)
                .map(social => (
                  <a key={social.url} href={social.url}
                    target="_blank" rel="noopener noreferrer">
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

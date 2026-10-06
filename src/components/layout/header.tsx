"use client";

import { useEffect as useHeaderEffect, useState as useHeaderState } from "react";
import { BrandLogo } from "@/components/ui/brand-logo";
import Link from "next/link";
import "./opening.css";

type HeaderProps = {
  openMenu: () => void;
  openProject: () => void;
};

export function Header({ openMenu }: HeaderProps) {
  /* Things scrolling header */
  const [scrolled, setScrolled] = useHeaderState(false);

  useHeaderEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className="things-header-shell" data-scrolled={scrolled}>
      <div className="things-header-panel">
        <Link href="/" className="things-brand-link" aria-label="Things home"><BrandLogo /></Link>

        <button
          type="button"
          className="things-menu-toggle"
          onClick={openMenu}
          aria-label="Open navigation menu"
          aria-haspopup="dialog"
        >
          <span className="things-menu-lines" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>
    </header>
  );
}

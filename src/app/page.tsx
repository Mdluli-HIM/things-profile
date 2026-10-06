"use client";

import { ContactEnding } from "@/components/sections/contact-ending";
import { SelectedWork } from "@/components/sections/selected-work";
import { ScrollStatement } from "@/components/sections/scroll-statement";
import { Services } from "@/components/sections/services";
import { useCallback, useState } from "react";
import { Header } from "@/components/layout/header";
import {
  StudioDialog,
  type DialogView
} from "@/components/layout/studio-dialog";
import { Hero } from "@/components/sections/hero";



export default function Home() {
  const [view, setView] = useState<DialogView>(null);

  const openProject = useCallback(() => setView("project"), []);
  const closeDialog = useCallback(() => setView(null), []);

  return (
    <>
      <Header
        openMenu={() => setView("menu")}
        openProject={openProject}
      />

      <main id="main">
        <Hero openProject={openProject} />

        <section
          id="studio"
          className="studio-section container"
          aria-labelledby="studio-heading"
        >
          <div className="section-label eyebrow">
            <span>01 / Things we believe</span>
            <span>Studio</span>
          </div>

          <div className="studio-grid">
            <h2 id="studio-heading">
              Small studio.
              <br />
              Clear thinking.
              <br />
              Good things.
            </h2>

            <div className="studio-copy">
              <p>
                Things is an independent studio working across strategy,
                design and technology.
              </p>

              <p>
                We help businesses turn what makes them different into
                brands, websites and digital experiences with a clear
                point of view.
              </p>

              <div className="studio-detail eyebrow">
                <span>Cape Town based.</span>
                <span>Working globally.</span>
              </div>
            </div>
          </div>
        </section>

        <Services />
        <ScrollStatement />
        <SelectedWork />
      </main>

      <ContactEnding openProject={openProject} />

      <StudioDialog
        view={view}
        onClose={closeDialog}
        openProject={openProject}
      />
    </>
  );
}

"use client";

import { MenuContent } from "./menu-content";
import { BrandLogo } from "@/components/ui/brand-logo";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Download, X } from "lucide-react";

export type DialogView = "menu" | "project" | null;

type DialogProps = {
  view: DialogView;
  onClose: () => void;
  openProject: () => void;
};

function ProjectForm() {
  const [downloaded, setDownloaded] = useState(false);

  function downloadBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const brief = [
      "THINGS — PROJECT BRIEF",
      "",
      "Name: " + data.get("name"),
      "Email: " + data.get("email"),
      "Company: " + (data.get("company") || "—"),
      "Project: " + data.get("project"),
      "",
      "THE IDEA",
      String(data.get("idea"))
    ].join("\n");

    const url = URL.createObjectURL(
      new Blob([brief], { type: "text/plain;charset=utf-8" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "things-project-brief.txt";

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }

  return (
    <div className="project-layout">
      <div>
        <p className="eyebrow">Good things start here</p>

        <h2 className="dialog-heading">
          What do you
          <br />
          have in mind?
        </h2>

        <p className="project-description">
          A new website, a clearer identity, or an idea that needs a little
          thinking. Tell us about it.
        </p>

        <p className="project-note">
          Prepare a brief to download and share. This form keeps your details
          in this browser and doesn’t send them.
        </p>
      </div>

      <form
        className="project-form"
        onSubmit={downloadBrief}
        onChange={() => setDownloaded(false)}
      >
        <div className="form-pair">
          <label>
            Your name
            <input
              name="name"
              autoComplete="name"
              required
              maxLength={120}
            />
          </label>

          <label>
            Email address
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
          </label>
        </div>

        <label>
          Company / brand (optional)
          <input
            name="company"
            autoComplete="organization"
            maxLength={150}
          />
        </label>

        <label>
          What are we making?
          <select name="project" required defaultValue="">
            <option value="" disabled>Select a project</option>
            <option>New website</option>
            <option>Website redesign</option>
            <option>Brand identity</option>
            <option>Digital product</option>
            <option>Something else</option>
          </select>
        </label>

        <label>
          A little about the idea
          <textarea
            name="idea"
            required
            rows={4}
            maxLength={5000}
            placeholder="What would you like to make, change or achieve?"
          />
        </label>

        <button type="submit" className="text-link ruled-link">
          Download project brief <Download size={17} />
        </button>

        <p className="download-status" role="status">
          {downloaded
            ? "Your brief has been downloaded. It hasn’t been sent to Things."
            : ""}
        </p>
      </form>
    </div>
  );
}

export function StudioDialog({ view, onClose }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const open = view !== null;

  useEffect(() => {
    const dialog = ref.current;

    if (!dialog) return;

    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }

    if (!dialog.open) dialog.showModal();

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
      if (dialog.open) dialog.close();
    };
  }, [open]);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [view, open]);

  return (
    <dialog
      className={"studio-dialog" + (view === "menu" ? " things-menu-dialog" : "")}
      ref={ref}
      aria-label={view === "menu" ? "Navigation" : "Start a project"}
      onCancel={event => {
        event.preventDefault();
        onClose();
      }}
      data-lenis-prevent
    >
      <div className="dialog-top container">
        <BrandLogo />

        <button
          type="button"
          className="text-link"
          ref={closeRef}
          aria-label="Close dialog"
          onClick={onClose}
        >
          Close <X size={17} />
        </button>
      </div>

      {view && (
        <motion.div
          key={view}
          className="dialog-content container"
          initial={{ opacity: 0, y: reduce ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.45,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {view === "project" ? (
            <ProjectForm />
          ) : <MenuContent onClose={onClose} />}
        </motion.div>
      )}
    </dialog>
  );
}

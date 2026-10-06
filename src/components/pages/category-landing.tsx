"use client";
import { useRouter } from "next/navigation";
import { createCategoryTransition } from "@/lib/category-transition";
import { useCallback } from "react";
import type { MouseEvent } from "react";
import { WaterImage as Image } from "@/components/ui/water-image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { Header } from "@/components/layout/header";
import { StudioDialog, type DialogView } from "@/components/layout/studio-dialog";
import { workCategories, type CategoryId } from "@/data/work-categories";

import "./category-landing.css";


type Category = (typeof workCategories)[number];

function CategoryPreview({
  category,
  onClose
}: {
  category: Category;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previous = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <dialog ref={ref} className="things-category-dialog"
      aria-labelledby="category-dialog-title" data-lenis-prevent
      onCancel={event => {
        event.preventDefault();
        onClose();
      }}>
      <div className="things-category-dialog-top">
        <button type="button" onClick={onClose} aria-label="Close category">
          <X size={22} />
        </button>
      </div>
      <h2 id="category-dialog-title">{category.title}</h2>
      <p>{category.description}</p>
      <ul>
        {category.capabilities.map(item => <li key={item}>{item}</li>)}
      </ul>
    </dialog>
  );
}

export function CategoryLanding({ mode, covers }: { mode: "projects" | "services"; covers: Partial<Record<CategoryId, string>> }) {
  const [view, setView] = useState<DialogView>(null);
  const [selected, setSelected] = useState<CategoryId | null>(null);
  const [opening, setOpening] = useState<CategoryId | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<ReturnType<typeof createCategoryTransition> | null>(null);
  if (!transitionRef.current) transitionRef.current = createCategoryTransition();
  const router = useRouter();
  const reduce = useReducedMotion();
  const active = workCategories.find(category => category.id === selected);
  const openProject = () => setView("project");

  useEffect(() => () => transitionRef.current?.stop(), []);
  useEffect(() => { if (mode === "projects") router.prefetch("/projects/design"); }, [mode, router]);
  const reset = useCallback(() => { transitionRef.current?.stop(); setOpening(null); }, []);
  useEffect(() => {
    if (!opening) return;
    const cancel = (event: KeyboardEvent) => { if (event.key === "Escape") reset(); };
    const resize = () => reset();
    window.addEventListener("keydown", cancel);
    window.addEventListener("resize", resize);
    return () => { window.removeEventListener("keydown", cancel); window.removeEventListener("resize", resize); };
  }, [opening, reset]);

  async function choose(event: MouseEvent<HTMLElement>, id: CategoryId) {
    // Preserve the usual open-in-new-tab gesture for the Design link.
    if (event.currentTarget.tagName === "A" && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)) return;
    event.preventDefault();
    const transition = transitionRef.current!;
    if (transition.busy || view || selected) return;
    const card = event.currentTarget;
    const cards = Array.from(gridRef.current?.querySelectorAll<HTMLElement>(".things-category-card") || []);
    setOpening(id);
    const completed = await transition.play(card, cards, Boolean(reduce));
    if (!completed) { if (!transition.busy) setOpening(null); return; }
    if (mode === "projects" && id === "design") {
      router.push("/projects/design");
    } else {
      transition.unlock();
      setOpening(null);
      setSelected(id);
    }
  }
  return <>
    <Header openMenu={() => { reset(); setView("menu"); }} openProject={openProject} />
    <main id="main" className="things-category-page" data-opening={Boolean(opening)} data-lenis-prevent={opening ? true : undefined} aria-busy={Boolean(opening)}>
      <h1 className="things-category-page-title">{mode === "projects" ? "Projects" : "Services"}</h1>
      <div ref={gridRef} className="things-category-grid">
        {workCategories.map(category => {
          const gallery = mode === "projects" && category.id === "design";
          const Card = gallery ? "a" : "button";
          return <Card key={category.id} type={gallery ? undefined : "button"}
            href={gallery ? "/projects/design" : undefined} className="things-category-card"
            data-category={category.id} data-photo={Boolean(covers[category.id])}
            data-selected={opening === category.id} aria-disabled={Boolean(opening)}
            aria-label={"Explore " + category.title + " " + mode} aria-haspopup={gallery ? undefined : "dialog"}
            onClick={event => { void choose(event, category.id); }}>
            {covers[category.id] && <Image src={covers[category.id]!} alt="" fill
              sizes="(max-width: 767px) 90vw, 480px" className="things-category-photo" loading="eager" />}
            <span className="things-category-shade" aria-hidden="true" />
            <span className="things-category-caption">
              <span className="things-category-title">{category.title}</span>
              <span className="things-category-action" aria-hidden="true">Explore <ArrowUpRight size={13} /></span>
            </span>
          </Card>;
        })}
      </div>
    </main>
    <StudioDialog view={view} onClose={() => setView(null)} openProject={openProject} />
    {active && <CategoryPreview key={active.id} category={active} onClose={() => { reset(); setSelected(null); }} />}
  </>;
}

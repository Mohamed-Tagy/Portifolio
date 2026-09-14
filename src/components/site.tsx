"use client";

import { useState } from "react";
import { About } from "./about";
import { Contact } from "./contact";
import { Cursor } from "./cursor";
import { Experience } from "./experience";
import { Footer } from "./footer";
import { Hero } from "./hero";
import { Nav } from "./nav";
import { Preloader } from "./preloader";
import { Principles } from "./principles";
import { Providers } from "./providers";
import { Skills } from "./skills";
import { Work } from "./work";

export function Site() {
  const [booted, setBooted] = useState(false);

  return (
    <Providers>
      <a
        href="#projects"
        className="sr-only z-[95] rounded-[2px] bg-fog px-4 py-2 font-mono text-xs text-void focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to selected work
      </a>

      <Preloader onDone={() => setBooted(true)} />
      <Cursor />
      <Nav booted={booted} />

      <main>
        <Hero booted={booted} />
        <About />
        <Work />
        <Skills />
        <Experience />
        <Principles />
        <Contact />
      </main>

      <Footer />
    </Providers>
  );
}

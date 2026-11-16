import { useEffect, useState } from 'react';
import { useSmoothScroll } from '@/lib/useSmoothScroll';
import { Cursor } from '@/components/Cursor';
import { ScrollProgress } from '@/components/ScrollProgress';
import { Navigation } from '@/components/Navigation';
import { Preloader } from '@/components/Preloader';
import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { Work } from '@/components/Work';
import { VisualInterlude } from '@/components/VisualInterlude';
import { About } from '@/components/About';
import { Services } from '@/components/Services';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  useSmoothScroll();

  // Lock scroll during preloader
  useEffect(() => {
    document.body.style.overflow = loaded ? '' : 'hidden';
  }, [loaded]);

  return (
    <>
      {!loaded && <Preloader onDone={() => setLoaded(true)} />}

      <div className="grain" />
      <Cursor />
      <ScrollProgress />
      <Navigation />

      <main>
        <Hero />
        <Marquee />
        <Work />
        <VisualInterlude />
        <About />
        <Services />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

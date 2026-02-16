import {
  Navigation,
  Hero,
  VideoHero,
  Problem,
  Features,
  HowItWorks,
  Demo,
  Categories,
  Comparison,
  Pricing,
  FAQ,
  CTA,
  Footer,
} from "@/components";

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <Hero />
      <hr className="section-divider" />
      <Problem />
      <hr className="section-divider" />
      <Features />
      <hr className="section-divider" />
      <Demo />
      <VideoHero />
      <hr className="section-divider" />
      <HowItWorks />
      <hr className="section-divider" />
      <Categories />
      <hr className="section-divider" />
      <Comparison />
      <hr className="section-divider" />
      <Pricing />
      <hr className="section-divider" />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}

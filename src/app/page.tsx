import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DemoShowcase from "@/components/DemoShowcase";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <DemoShowcase />
        <Stats />
        <Features />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

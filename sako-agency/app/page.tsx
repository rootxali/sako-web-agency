import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Process from "@/components/Process";
import Team from "@/components/Team";
import TestimonialMarquee from "@/components/TestimonialMarquee";
import Contact from "@/components/Contact";
import Blog from "@/components/Blog";
import { CinematicFooter } from "@/components/ui/cinematic-footer";
import PricingSection from "@/components/ui/PricingSection";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Page() {
  return (
    <ErrorBoundary componentName="HomePage">
      <main>
        <Nav />
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Work />
        <Process />
        <Team />
        <TestimonialMarquee />
        <Blog />
        <PricingSection />
        <Contact />
        <CinematicFooter
          brandName="SAKO"
          tagline="Ready to build something extraordinary?"
          email="hello@sako.agency"
          copyrightYear="2024–2026"
          secondaryLinks={[
            { label: "About",           href: "#about"    },
            { label: "Work",            href: "#work"     },
            { label: "Services",        href: "#services" },
            { label: "Privacy Policy",  href: "#privacy"  },
            { label: "Terms of Service",href: "#terms"    },
          ]}
        />
      </main>
    </ErrorBoundary>
  );
}

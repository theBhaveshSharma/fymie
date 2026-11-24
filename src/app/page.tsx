import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Problem } from "@/components/Problem";
import { SiteNav } from "@/components/SiteNav";
import { Waitlist } from "@/components/Waitlist";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteNav />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
}

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

const Platform = dynamic(() => import("@/components/Platform"));
const Explore = dynamic(() => import("@/components/explore"));
const HowItWork = dynamic(() => import("@/components/HowItWork"));
const SchoolAndFamily = dynamic(() => import("@/components/SchoolFamily"));
const Join = dynamic(() => import("@/components/Join"));
const FAQ = dynamic(() => import("@/components/FAQ"));

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Platform />
      <Explore />
      <HowItWork />
      <SchoolAndFamily />
      <Join />
      <FAQ />
      <Footer />
    </div>
  );
}

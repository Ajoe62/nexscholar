import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorksNew";
import FeaturedScholarships from "@/components/home/FeaturedScholarshipsNew";
import Testimonials from "@/components/home/TestimonialsNew";
import Footer from "@/components/layout/FooterNew";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <FeaturedScholarships />
      <Testimonials />
      <Footer />
    </main>
  );
}

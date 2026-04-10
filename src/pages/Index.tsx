import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ArticlesSection from "@/components/ArticlesSection";
import CategoriesSection from "@/components/CategoriesSection";
import AboutSection from "@/components/AboutSection";
import NewsletterSection from "@/components/NewsletterSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <ArticlesSection />
    <CategoriesSection />
    <AboutSection />
    <NewsletterSection />
    <ContactSection />
    <Footer />
  </div>
);

export default Index;

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ArticlesSection from "@/components/ArticlesSection";
import CategoriesSection from "@/components/CategoriesSection";
import AboutSection from "@/components/AboutSection";
import NewsletterSection from "@/components/NewsletterSection";
import ContactSection from "@/components/ContactSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ArticlesSection activeCategory={activeCategory} onCategorySelect={setActiveCategory} />
      <CategoriesSection activeCategory={activeCategory} onCategorySelect={setActiveCategory} />
      <AboutSection />
      <NewsletterSection />
      <ContactSection />
      <FaqSection />
      <Footer />
    </div>
  );
};

export default Index;

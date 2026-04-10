import { motion } from "framer-motion";
import { TrendingUp, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const tickerItems = [
  "AAPL +2.4%", "TSLA +1.8%", "BTC $67,240", "ETH $3,520", "S&P 500 +0.6%",
  "GOOGL +1.2%", "AMZN +0.9%", "NIFTY 50 +0.4%", "GOLD $2,380", "USD/EUR 0.92",
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Ticker bar */}
      <div className="relative z-10 mt-16 border-b border-emerald bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="flex animate-ticker">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="flex-shrink-0 px-6 py-2 text-xs font-medium text-muted-foreground whitespace-nowrap">
              <TrendingUp size={12} className="inline mr-1 text-primary" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Hero content */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        {/* Glowing orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-primary/8 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-medium tracking-widest uppercase rounded-full border border-emerald text-primary bg-primary/5">
              <TrendingUp size={14} /> Finance & Investing Blog
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Master Your{" "}
            <span className="text-gradient-emerald">Money.</span>
            <br />
            Build Your{" "}
            <span className="text-gradient-emerald">Wealth.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Expert insights on personal finance, investing, stock markets, and wealth building — 
            written for the modern investor.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="#articles" className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-lg bg-gradient-emerald text-primary-foreground hover:opacity-90 transition-all glow-emerald">
              Read Latest Articles <ArrowRight size={16} />
            </a>
            <a href="#newsletter" className="px-8 py-3.5 text-sm font-semibold rounded-lg border border-emerald text-foreground hover:bg-primary/5 transition-all">
              Join Newsletter
            </a>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Wallet, Building2, Bitcoin, PiggyBank, BarChart3, Receipt } from "lucide-react";

const categories = [
  { icon: TrendingUp, name: "Stock Market", count: 24, desc: "Analysis, picks & strategy" },
  { icon: Wallet, name: "Personal Finance", count: 18, desc: "Budgeting & saving smart" },
  { icon: Bitcoin, name: "Cryptocurrency", count: 15, desc: "Crypto insights & trends" },
  { icon: Building2, name: "Real Estate", count: 12, desc: "Property investment guide" },
  { icon: PiggyBank, name: "Wealth Building", count: 20, desc: "Long-term growth plans" },
  { icon: BarChart3, name: "Mutual Funds", count: 14, desc: "Fund reviews & SIP tips" },
  { icon: Receipt, name: "Tax Planning", count: 10, desc: "Save more, legally" },
];

const CategoriesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="categories" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-14">
          <span className="text-xs font-medium tracking-widest uppercase text-primary mb-3 block">Topics</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Explore by <span className="text-gradient-emerald">Category</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.a
              key={i}
              href="#articles"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group p-5 rounded-xl border border-border bg-card hover:border-emerald transition-all duration-300 cursor-pointer text-center"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                <cat.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{cat.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">{cat.desc}</p>
              <span className="text-[10px] font-medium text-primary">{cat.count} articles</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Clock, ArrowRight, Bookmark } from "lucide-react";

const featuredPost = {
  category: "Investing",
  title: "The Complete Guide to Building a Diversified Portfolio in 2024",
  excerpt: "Learn how to spread risk across asset classes and build a portfolio that weathers any market condition. From index funds to alternative investments.",
  author: "H",
  date: "Apr 8, 2026",
  readTime: "12 min read",
};

const posts = [
  {
    category: "Stock Market",
    title: "5 Undervalued Stocks Smart Money Is Buying Right Now",
    excerpt: "Institutional investors are quietly accumulating these positions. Here's what they see that retail investors are missing.",
    date: "Apr 6, 2026",
    readTime: "8 min",
  },
  {
    category: "Personal Finance",
    title: "The 50/30/20 Rule Is Dead — Here's What Works in 2026",
    excerpt: "Why the classic budgeting rule no longer applies and the updated framework top financial advisors recommend.",
    date: "Apr 4, 2026",
    readTime: "6 min",
  },
  {
    category: "Crypto",
    title: "Bitcoin's Next Move: On-Chain Data Reveals the Answer",
    excerpt: "Analyzing whale wallets, exchange flows, and miner behavior to predict Bitcoin's short-term trajectory.",
    date: "Apr 2, 2026",
    readTime: "10 min",
  },
  {
    category: "Real Estate",
    title: "REITs vs Physical Property: Which Builds Wealth Faster?",
    excerpt: "A data-driven comparison of returns, effort, and tax efficiency between REITs and direct real estate investment.",
    date: "Mar 30, 2026",
    readTime: "9 min",
  },
  {
    category: "Wealth Building",
    title: "How I Built a ₹1 Crore Portfolio Before 30",
    excerpt: "The exact strategy, mistakes, and mindset shifts that helped me reach financial independence in my twenties.",
    date: "Mar 28, 2026",
    readTime: "14 min",
  },
  {
    category: "Tax Planning",
    title: "Tax-Loss Harvesting: The Strategy Saving Investors Lakhs",
    excerpt: "A step-by-step guide to legally reducing your tax bill while maintaining your investment strategy.",
    date: "Mar 25, 2026",
    readTime: "7 min",
  },
];

const categoryColors: Record<string, string> = {
  "Stock Market": "bg-emerald-dark/20 text-emerald-light",
  "Personal Finance": "bg-blue-500/10 text-blue-400",
  Crypto: "bg-orange-500/10 text-orange-400",
  "Real Estate": "bg-purple-500/10 text-purple-400",
  "Wealth Building": "bg-yellow-500/10 text-yellow-400",
  "Tax Planning": "bg-rose-500/10 text-rose-400",
  Investing: "bg-primary/10 text-primary",
};

const ArticlesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="articles" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs font-medium tracking-widest uppercase text-primary mb-3 block">Latest Articles</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Fresh <span className="text-gradient-emerald">Insights</span>
            </h2>
          </div>
          <a href="#" className="hidden md:inline-flex items-center gap-1 text-sm text-primary hover:gap-2 transition-all font-medium">
            View All <ArrowRight size={14} />
          </a>
        </motion.div>

        {/* Featured Post */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="group mb-10 rounded-2xl border border-emerald bg-card p-6 md:p-10 hover:border-emerald-strong transition-all duration-300 cursor-pointer card-shadow"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
            <div className="flex-1">
              <span className={`inline-block px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full mb-4 ${categoryColors[featuredPost.category]}`}>
                {featuredPost.category}
              </span>
              <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {featuredPost.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{featuredPost.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">By {featuredPost.author}</span>
                <span>•</span>
                <span>{featuredPost.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {featuredPost.readTime}</span>
              </div>
            </div>
            <div className="w-full md:w-64 h-40 md:h-48 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
              <TrendingUp size={48} className="text-primary/20" />
            </div>
          </div>
        </motion.article>

        {/* Post grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
              className="group rounded-xl border border-border bg-card p-5 hover:border-emerald hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full ${categoryColors[post.category] || "bg-primary/10 text-primary"}`}>
                  {post.category}
                </span>
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  <Bookmark size={14} />
                </button>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{post.date}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <a href="#" className="inline-flex items-center gap-1 text-sm text-primary font-medium">
            View All Articles <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { TrendingUp, Clock, ArrowRight, Bookmark, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  read_time: string;
  created_at: string;
  is_premium: boolean;
}

const categoryColors: Record<string, string> = {
  "Stock Market": "bg-emerald-dark/20 text-emerald-light",
  "Personal Finance": "bg-blue-500/10 text-blue-400",
  Crypto: "bg-orange-500/10 text-orange-400",
  "Real Estate": "bg-purple-500/10 text-purple-400",
  "Wealth Building": "bg-yellow-500/10 text-yellow-400",
  "Tax Planning": "bg-rose-500/10 text-rose-400",
  Investing: "bg-primary/10 text-primary",
};

interface ArticlesSectionProps {
  activeCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const ArticlesSection = ({ activeCategory, onCategorySelect }: ArticlesSectionProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      let query = supabase
        .from("posts")
        .select("id, title, excerpt, category, author, read_time, created_at, is_premium")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (activeCategory) query = query.eq("category", activeCategory);
      const { data, error } = await query;
      if (error) console.error("Posts fetch error:", error.message);
      if (data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, [activeCategory]);

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <section id="articles" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-medium tracking-widest uppercase text-primary mb-3 block">Latest Articles</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Fresh <span className="text-gradient-emerald">Insights</span>
            </h2>
          </div>
        </motion.div>

        {/* Category filter pills */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => activeCategory && onCategorySelect(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              !activeCategory ? "bg-primary text-background" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {["Stock Market", "Personal Finance", "Crypto", "Real Estate", "Wealth Building", "Tax Planning", "Investing"].map((cat) => (
            <button
              key={cat}
              onClick={() => onCategorySelect(activeCategory === cat ? null : cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeCategory === cat ? "bg-primary text-background" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <TrendingUp size={40} className="mx-auto mb-4 text-primary/20" />
            <p>No articles published yet. Check back soon!</p>
          </div>
        )}

        {/* Featured Post */}
        {featured && (
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            onClick={() => navigate(`/blog/${featured.id}`)}
            className="group mb-10 rounded-2xl border border-emerald bg-card p-6 md:p-10 hover:border-emerald-strong transition-all duration-300 cursor-pointer card-shadow"
          >
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
              <div className="flex-1">
                <span className={`inline-block px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full mb-4 ${categoryColors[featured.category] || "bg-primary/10 text-primary"}`}>
                  {featured.category}
                </span>
                {featured.is_premium && (
                  <span className="inline-flex items-center gap-1 ml-2 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-yellow-500/10 text-yellow-400 mb-4">
                    <Lock size={9} /> Premium
                  </span>
                )}
                <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {featured.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">By {featured.author}</span>
                  <span>•</span>
                  <span>{new Date(featured.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  {featured.read_time && <><span>•</span><span className="flex items-center gap-1"><Clock size={12} /> {featured.read_time}</span></>}
                </div>
              </div>
              <div className="w-full md:w-64 h-40 md:h-48 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <TrendingUp size={48} className="text-primary/20" />
              </div>
            </div>
          </motion.article>
        )}

        {/* Post grid */}
        {rest.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                onClick={() => navigate(`/blog/${post.id}`)}
                className="group rounded-xl border border-border bg-card p-5 hover:border-emerald hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full ${categoryColors[post.category] || "bg-primary/10 text-primary"}`}>
                    {post.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {post.is_premium && <Lock size={13} className="text-yellow-400" />}
                    <button className="text-muted-foreground hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                      <Bookmark size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  {post.read_time && <span className="flex items-center gap-1"><Clock size={11} /> {post.read_time}</span>}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticlesSection;

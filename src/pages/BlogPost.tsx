import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Clock, ArrowLeft, Calendar, Lock, Zap } from "lucide-react";
import { usePremium } from "@/hooks/usePremium";
import PremiumModal from "@/components/PremiumModal";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
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

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { isPremium, loading: premiumLoading, refetch } = usePremium();

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .single();
      if (error || !data) navigate("/");
      else setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [id, navigate]);

  if (loading || premiumLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  if (!post) return null;

  const isLocked = post.is_premium && !isPremium;

  return (
    <div className="min-h-screen bg-background">
      {showModal && <PremiumModal onClose={() => setShowModal(false)} onSuccess={refetch} />}

      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
          <span className="text-muted-foreground/40">|</span>
          <span className="text-sm font-display font-bold text-gradient-emerald">H&S Learning Hub</span>
        </div>
      </div>

      <article className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-6">
          <span className={`inline-block px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full ${categoryColors[post.category] || "bg-primary/10 text-primary"}`}>
            {post.category}
          </span>
          {post.is_premium && (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-yellow-500/10 text-yellow-400">
              <Zap size={10} /> Premium
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg text-muted-foreground leading-relaxed mb-6 border-l-2 border-primary pl-4">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-10 pb-8 border-b border-border">
          <span className="font-medium text-foreground">By {post.author}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar size={13} />
            {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          {post.read_time && <><span>•</span><span className="flex items-center gap-1"><Clock size={13} /> {post.read_time}</span></>}
        </div>

        {/* Content or Paywall */}
        {isLocked ? (
          <>
            {/* Show first ~300 chars blurred */}
            <div className="relative">
              <div className="text-foreground/90 leading-relaxed text-sm" style={{ whiteSpace: "pre-wrap" }}>
                {post.content.slice(0, 300)}...
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
            </div>

            {/* Paywall card */}
            <div className="mt-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                <Lock size={22} className="text-yellow-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">This is Premium Content</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                Subscribe to unlock this article and all other exclusive premium content.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 bg-gradient-emerald text-primary-foreground font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition glow-emerald"
              >
                <Zap size={16} /> Unlock Premium — from ₹30/mo
              </button>
            </div>
          </>
        ) : (
          <div className="text-foreground/90 leading-relaxed space-y-4" style={{ whiteSpace: "pre-wrap" }}>
            {post.content}
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogPost;

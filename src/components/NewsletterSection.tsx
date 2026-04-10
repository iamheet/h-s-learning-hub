import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const NewsletterSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("subscribers").insert([{ email }]);
    setLoading(false);
    if (error) {
      if (error.code === "23505") toast.error("You're already subscribed!");
      else toast.error(error.message);
      return;
    }
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section id="newsletter" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-cta" />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(hsl(155 60% 45%) 1px, transparent 1px)`,
        backgroundSize: "30px 30px",
      }} />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">
            Get Smarter About <span className="text-gradient-emerald">Money</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Join 10,000+ readers. Weekly insights on investing, finance, and wealth building — straight to your inbox. No spam, ever.
          </p>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-2 text-primary font-medium">
              <CheckCircle2 size={20} /> You're in! Check your inbox.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-5 py-3.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              />
              <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-lg bg-gradient-emerald text-primary-foreground hover:opacity-90 transition-all glow-emerald disabled:opacity-50">
                {loading ? "Subscribing..." : <> Subscribe <ArrowRight size={16} /> </>}
              </button>
            </form>
          )}

          <p className="text-xs text-muted-foreground mt-4">Free forever. Unsubscribe anytime.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;

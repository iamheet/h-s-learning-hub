import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("messages").insert([form]);
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-14">
          <span className="text-xs font-medium tracking-widest uppercase text-primary mb-3 block">Contact</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Get in <span className="text-gradient-emerald">Touch</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">Have a question, collaboration idea, or just want to say hi? Drop a message.</p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg mx-auto space-y-5"
        >
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center gap-3 py-10 text-primary">
              <CheckCircle2 size={40} />
              <p className="font-medium text-foreground">Message sent! We'll get back to you soon.</p>
            </motion.div>
          ) : (
            <>
          {[
            { name: "name" as const, label: "Name", type: "text" },
            { name: "email" as const, label: "Email", type: "email" },
          ].map((field) => (
            <input
              key={field.name}
              type={field.type}
              placeholder={field.label}
              value={form[field.name]}
              onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
              required
              className="w-full px-5 py-3.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
            />
          ))}
          <textarea
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            rows={5}
            className="w-full px-5 py-3.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all resize-none"
          />
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-lg bg-gradient-emerald text-primary-foreground hover:opacity-90 transition-all glow-emerald disabled:opacity-50">
            {loading ? "Sending..." : <> Send Message <Send size={16} /> </>}
          </button>
            </>
          )}
        </motion.form>
      </div>
    </section>
  );
};

export default ContactSection;

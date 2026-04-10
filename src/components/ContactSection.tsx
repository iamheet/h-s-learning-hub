import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send } from "lucide-react";

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-primary mb-4 block">
            Contact
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Get in <span className="text-gradient-gold">Touch</span>
          </h2>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg mx-auto space-y-5"
        >
          {[
            { name: "name" as const, label: "Name", type: "text" },
            { name: "email" as const, label: "Email", type: "email" },
          ].map((field) => (
            <div key={field.name}>
              <input
                type={field.type}
                placeholder={field.label}
                value={form[field.name]}
                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                required
                className="w-full px-5 py-3.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
              />
            </div>
          ))}
          <textarea
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            rows={5}
            className="w-full px-5 py-3.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200 resize-none"
          />
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-lg bg-gradient-gold text-primary-foreground hover:opacity-90 transition-all duration-200 glow-gold"
          >
            Send Message <Send size={16} />
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default ContactSection;

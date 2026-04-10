import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { PenLine, BookOpen, Award } from "lucide-react";

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4" ref={ref}>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }} className="relative">
            <div className="aspect-square max-w-md rounded-2xl bg-secondary overflow-hidden border border-emerald relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-9xl font-display font-bold text-gradient-emerald opacity-20">H</span>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-5 px-6 py-4 rounded-xl bg-gradient-emerald card-shadow">
              <p className="text-xl font-bold text-primary-foreground">200+</p>
              <p className="text-xs text-primary-foreground/80">Articles Published</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}>
            <span className="text-xs font-medium tracking-widest uppercase text-primary mb-4 block">About</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-foreground">
              The Voice Behind{" "}
              <span className="text-gradient-emerald">LearnWith H</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              I'm H — a finance enthusiast, investor, and writer on a mission to make money management
              accessible to everyone. From breaking down stock market strategies to simplifying tax
              planning, I write to empower you with financial literacy.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              With experience in equity research and personal investing, I share honest, research-backed
              insights — no hype, no jargon, just actionable knowledge.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: PenLine, val: "200+", label: "Articles" },
                { icon: BookOpen, val: "50K+", label: "Readers" },
                { icon: Award, val: "3+", label: "Years" },
              ].map((s, i) => (
                <div key={i} className="text-center p-4 rounded-xl border border-border">
                  <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-lg font-bold text-foreground">{s.val}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-cta" />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(hsl(40 70% 55%) 1px, transparent 1px)`,
        backgroundSize: "30px 30px",
      }} />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
            Start Your Learning{" "}
            <span className="text-gradient-gold">Journey Today</span>
          </h2>
          <p className="text-lg text-muted-foreground font-body mb-10">
            Join thousands of students who have already transformed their careers.
            Your future self will thank you.
          </p>
          <a
            href="#courses"
            className="inline-block px-10 py-4 text-sm font-semibold rounded-lg bg-gradient-gold text-primary-foreground hover:opacity-90 transition-all duration-200 glow-gold"
          >
            Get Started Now
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code, Rocket, Target, Lightbulb, Users, Shield } from "lucide-react";

const features = [
  { icon: Code, title: "Practical Learning", desc: "Hands-on projects and real code from day one." },
  { icon: Rocket, title: "Real-world Projects", desc: "Build portfolio-worthy apps that impress employers." },
  { icon: Target, title: "Career Guidance", desc: "Personalized mentoring to land your dream role." },
  { icon: Lightbulb, title: "Latest Technologies", desc: "Stay ahead with cutting-edge tools and frameworks." },
  { icon: Users, title: "Community Access", desc: "Join a thriving community of ambitious learners." },
  { icon: Shield, title: "Lifetime Access", desc: "Learn at your pace with lifetime course access." },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-primary mb-4 block">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Built for <span className="text-gradient-gold">Excellence</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group p-6 rounded-xl border border-border hover:border-gold transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

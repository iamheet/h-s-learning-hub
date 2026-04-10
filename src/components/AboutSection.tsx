import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Users, BookOpen } from "lucide-react";

const stats = [
  { icon: Users, value: "10K+", label: "Students" },
  { icon: BookOpen, value: "50+", label: "Courses" },
  { icon: Award, value: "98%", label: "Satisfaction" },
];

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4" ref={ref}>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl bg-secondary overflow-hidden border border-gold relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl font-extrabold text-gradient-gold opacity-30">H</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-xl bg-gradient-gold flex items-center justify-center card-shadow">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-foreground">5+</p>
                <p className="text-xs text-primary-foreground/80 font-medium">Years Exp.</p>
              </div>
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="text-xs font-medium tracking-widest uppercase text-primary mb-4 block">
              About Me
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Your Mentor for the{" "}
              <span className="text-gradient-gold">Digital Age</span>
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed mb-6">
              I'm H — a passionate educator and tech enthusiast dedicated to helping
              you master in-demand skills. With years of industry experience and a
              teaching philosophy rooted in practical, real-world application, I've
              helped thousands of students transform their careers.
            </p>
            <p className="text-muted-foreground font-body leading-relaxed mb-10">
              Every course is carefully crafted to give you not just knowledge, but
              the confidence to build, create, and innovate.
            </p>

            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
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

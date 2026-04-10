import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const courses = [
  {
    title: "Full-Stack Web Development",
    description: "Master React, Node.js, and modern web technologies from scratch to deployment.",
    level: "Beginner",
    duration: "12 Weeks",
    color: "from-primary/20 to-primary/5",
  },
  {
    title: "Advanced JavaScript Mastery",
    description: "Deep dive into JS patterns, async programming, and performance optimization.",
    level: "Advanced",
    duration: "8 Weeks",
    color: "from-primary/15 to-primary/5",
  },
  {
    title: "UI/UX Design Fundamentals",
    description: "Learn design thinking, Figma, and create stunning user experiences.",
    level: "Beginner",
    duration: "6 Weeks",
    color: "from-primary/20 to-primary/5",
  },
  {
    title: "Python & Data Science",
    description: "From Python basics to machine learning models and data visualization.",
    level: "Intermediate",
    duration: "10 Weeks",
    color: "from-primary/15 to-primary/5",
  },
];

const CoursesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="courses" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-primary mb-4 block">
            Courses
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Premium <span className="text-gradient-gold">Learning Paths</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-xl border border-gold bg-card p-6 hover:border-gold-strong transition-all duration-300 hover:-translate-y-1 card-shadow"
            >
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${course.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-primary/10 text-primary mb-4">
                  {course.level}
                </span>
                <h3 className="text-lg font-bold text-foreground mb-3">{course.title}</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">
                  {course.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{course.duration}</span>
                  <button className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all duration-200">
                    Enroll <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;

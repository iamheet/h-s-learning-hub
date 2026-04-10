import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  { name: "Sarah K.", role: "Frontend Developer", text: "LearnWith H completely changed my career trajectory. The practical approach and mentorship are unmatched.", rating: 5 },
  { name: "James L.", role: "Full-Stack Engineer", text: "The best investment I've made in my career. The courses are comprehensive, clear, and incredibly well-structured.", rating: 5 },
  { name: "Priya M.", role: "UI/UX Designer", text: "From zero coding knowledge to landing my dream job in 6 months. H's teaching style is simply phenomenal.", rating: 5 },
  { name: "Alex T.", role: "Data Scientist", text: "The Python and Data Science course was exactly what I needed. Real projects, real skills, real results.", rating: 5 },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-primary mb-4 block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            What Students <span className="text-gradient-gold">Say</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative rounded-2xl border border-gold bg-card p-8 md:p-12 text-center card-shadow">
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                <Star key={i} size={16} className="fill-primary text-primary" />
              ))}
            </div>
            <p className="text-lg text-foreground font-body leading-relaxed mb-8 italic">
              "{testimonials[current].text}"
            </p>
            <p className="font-semibold text-foreground">{testimonials[current].name}</p>
            <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-gold-strong transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? "bg-primary w-6" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-gold-strong transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

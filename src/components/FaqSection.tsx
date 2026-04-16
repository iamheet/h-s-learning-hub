import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Faq {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

const FaqSection = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("faqs")
      .select("id, question, answer, order_index")
      .order("order_index", { ascending: true })
      .then(({ data }) => setFaqs(data ?? []));
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest text-primary uppercase">FAQ</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-3 text-sm">Everything you need to know about H&S Learning Hub</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className={`bg-card border rounded-xl overflow-hidden transition-colors ${open === faq.id ? "border-primary/40" : "border-border"}`}
            >
              <button
                onClick={() => setOpen(open === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
              >
                <span className="text-sm font-semibold text-foreground">{faq.question}</span>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open === faq.id ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

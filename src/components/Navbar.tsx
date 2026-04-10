import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Articles", href: "#articles" },
  { label: "Categories", href: "#categories" },
  { label: "About", href: "#about" },
  { label: "Newsletter", href: "#newsletter" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-emerald" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-emerald flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">H</span>
          </div>
          <span className="text-lg font-display font-bold text-foreground">
            LearnWith <span className="text-gradient-emerald">H</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </a>
          ))}
          <a href="#newsletter" className="px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-emerald text-primary-foreground hover:opacity-90 transition-opacity">
            Subscribe
          </a>
          {user ? (
            <button onClick={signOut} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LogOut size={15} /> Sign Out
            </button>
          ) : (
            <button onClick={() => navigate("/login")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LogIn size={15} /> Sign In
            </button>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-background/95 backdrop-blur-xl border-b border-emerald px-6 pb-6">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block py-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </a>
          ))}
          <a href="#newsletter" onClick={() => setMobileOpen(false)} className="mt-2 block text-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-gradient-emerald text-primary-foreground">
            Subscribe
          </a>
          {user ? (
            <button onClick={signOut} className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LogOut size={15} /> Sign Out
            </button>
          ) : (
            <button onClick={() => { navigate("/login"); setMobileOpen(false); }} className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LogIn size={15} /> Sign In
            </button>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;

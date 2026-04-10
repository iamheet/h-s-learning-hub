import { Globe, MessageCircle, Bookmark, Code2 } from "lucide-react";

const socials = [
  { icon: MessageCircle, href: "#", label: "Twitter" },
  { icon: Bookmark, href: "#", label: "LinkedIn" },
  { icon: Globe, href: "#", label: "Website" },
  { icon: Code2, href: "#", label: "GitHub" },
];

const Footer = () => (
  <footer className="py-12 bg-card border-t border-border">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-md bg-gradient-emerald flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">H</span>
            </div>
            <span className="text-lg font-display font-bold text-foreground">
              LearnWith <span className="text-gradient-emerald">H</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} LearnWith H. All rights reserved.</p>
        </div>

        <div className="flex items-center gap-6">
          {["Articles", "Categories", "About", "Contact"].map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {socials.map((s, i) => (
            <a key={i} href={s.href} aria-label={s.label} className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-emerald transition-all">
              <s.icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

import { GithubIcon, TwitterIcon, LinkedinIcon, YoutubeIcon } from "lucide-react";

const socials = [
  { icon: Twitter, href: "#" },
  { icon: Linkedin, href: "#" },
  { icon: Youtube, href: "#" },
  { icon: Github, href: "#" },
];

const Footer = () => (
  <footer className="py-12 bg-background border-t border-border">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-lg font-bold">
            <span className="text-gradient-gold">LearnWith</span>{" "}
            <span className="text-foreground">H</span>
          </span>
          <p className="text-xs text-muted-foreground mt-1">
            © {new Date().getFullYear()} LearnWith H. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-6">
          {["About", "Courses", "Contact"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {socials.map((s, i) => (
            <a
              key={i}
              href={s.href}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-gold transition-all duration-200"
            >
              <s.icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

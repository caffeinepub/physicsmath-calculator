import { Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-center">
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          © {year}. Built with{" "}
          <Heart className="w-3 h-3 text-red-500 fill-red-500" /> using{" "}
          <a
            href={utm}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

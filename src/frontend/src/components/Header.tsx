import { Button } from "@/components/ui/button";
import { Landmark, Moon, Sun } from "lucide-react";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Header({ isDark, onToggleTheme }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative w-8 h-8 rounded-lg bg-survey-amber/10 border border-survey-amber/30 flex items-center justify-center">
            <Landmark className="w-4 h-4 text-survey-amber" />
            <div className="absolute inset-0 rounded-lg bg-survey-amber/5" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Land Survey{" "}
            <span
              className="text-survey-amber"
              style={{
                textShadow: "0 0 18px oklch(var(--survey-amber) / 0.4)",
              }}
            >
              Converter
            </span>
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            data-ocid="theme.toggle"
            className="w-8 h-8 rounded-md text-muted-foreground hover:text-foreground"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  FlaskConical,
  History,
  Home,
  Map as MapIcon,
  Moon,
  Sun,
} from "lucide-react";

type Page = "home" | "calculators" | "history" | "land-survey";

interface HeaderProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  historyCount?: number;
}

export function Header({
  currentPage,
  onPageChange,
  isDark,
  onToggleTheme,
  historyCount,
}: HeaderProps) {
  const navItems = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "calculators" as const, label: "Calculators", icon: Calculator },
    { id: "land-survey" as const, label: "Land Survey", icon: MapIcon },
    { id: "history" as const, label: "History", icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onPageChange("home")}
          className="flex items-center gap-2.5 shrink-0 group"
          data-ocid="nav.link"
        >
          <div className="relative w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:border-primary/60 transition-colors">
            <FlaskConical className="w-4 h-4 text-primary" />
            <div className="absolute inset-0 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Physics<span className="text-primary">Math</span>
          </span>
        </button>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onPageChange(id)}
              data-ocid="nav.link"
              className={`
                relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                ${
                  currentPage === id
                    ? id === "land-survey"
                      ? "text-survey-amber bg-survey-amber/10"
                      : "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }
              `}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
              {id === "history" && historyCount != null && historyCount > 0 && (
                <Badge
                  variant="secondary"
                  className="h-4 px-1 text-[10px] font-mono ml-0.5"
                >
                  {historyCount}
                </Badge>
              )}
              {id === "land-survey" && (
                <Badge
                  variant="secondary"
                  className="h-4 px-1 text-[10px] font-mono ml-0.5 text-survey-amber bg-survey-amber/10"
                >
                  NEW
                </Badge>
              )}
            </button>
          ))}
        </nav>

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

          {/* Mobile nav */}
          <div className="flex sm:hidden items-center gap-1">
            {navItems.map(({ id, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onPageChange(id)}
                data-ocid="nav.link"
                className={`p-1.5 rounded-md transition-colors ${
                  currentPage === id
                    ? id === "land-survey"
                      ? "text-survey-amber bg-survey-amber/10"
                      : "text-primary bg-primary/10"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

import { CalculatorCard } from "@/components/CalculatorCard";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  type CalculatorDef,
  allCalculators,
  mathSubcategories,
  physicsSubcategories,
} from "@/data/calculators";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Atom,
  BarChart3,
  Clock,
  Compass,
  Eye,
  FlaskConical,
  Radio,
  Sigma,
  Star,
  Thermometer,
  Triangle,
  Waves,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface CalculatorsPageProps {
  initialSubcategory?: string;
  onOpenCalculator: (calc: CalculatorDef) => void;
}

const subcategoryIcons: Record<string, React.ElementType> = {
  Kinematics: Compass,
  "Newton's Laws": Zap,
  "Energy & Work": Star,
  Thermodynamics: Thermometer,
  Waves: Waves,
  Electromagnetism: Radio,
  Optics: Eye,
  Relativity: Clock,
  "Quantum Mechanics": Atom,
  Gravitation: FlaskConical,
  Algebra: Sigma,
  Geometry: Triangle,
  Trigonometry: Compass,
  Calculus: BarChart3,
  Statistics: BarChart3,
  "Unit Converter": ArrowRight,
};

export function CalculatorsPage({
  initialSubcategory,
  onOpenCalculator,
}: CalculatorsPageProps) {
  const [activeCategory, setActiveCategory] = useState<
    "Physics" | "Mathematics"
  >(
    mathSubcategories.includes(initialSubcategory ?? "")
      ? "Mathematics"
      : "Physics",
  );
  const [activeSubcategory, setActiveSubcategory] = useState<string>(
    initialSubcategory ??
      (mathSubcategories.includes(initialSubcategory ?? "")
        ? mathSubcategories[0]
        : physicsSubcategories[0]),
  );

  // Sync when initialSubcategory changes
  useEffect(() => {
    if (initialSubcategory) {
      if (mathSubcategories.includes(initialSubcategory)) {
        setActiveCategory("Mathematics");
      } else {
        setActiveCategory("Physics");
      }
      setActiveSubcategory(initialSubcategory);
    }
  }, [initialSubcategory]);

  const subcategories =
    activeCategory === "Physics" ? physicsSubcategories : mathSubcategories;
  const filteredCalcs = allCalculators.filter(
    (c) => c.subcategory === activeSubcategory,
  );

  return (
    <main className="min-h-screen" data-ocid="calculator.page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Category toggle */}
        <div className="flex items-center gap-2 mb-5">
          {(["Physics", "Mathematics"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                setActiveSubcategory(
                  cat === "Physics"
                    ? physicsSubcategories[0]
                    : mathSubcategories[0],
                );
              }}
              data-ocid="calculator.category.tab"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-plasma-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30",
              )}
            >
              {cat === "Physics" ? (
                <Atom className="w-3.5 h-3.5" />
              ) : (
                <Sigma className="w-3.5 h-3.5" />
              )}
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-5">
          {/* Sidebar subcategories */}
          <aside className="hidden sm:block w-48 shrink-0">
            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="space-y-1 pr-2">
                {subcategories.map((sub) => {
                  const Icon = subcategoryIcons[sub] ?? Sigma;
                  const count = allCalculators.filter(
                    (c) => c.subcategory === sub,
                  ).length;
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setActiveSubcategory(sub)}
                      data-ocid="calculator.category.tab"
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all text-left",
                        activeSubcategory === sub
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent",
                      )}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="flex-1 truncate font-medium text-xs">
                        {sub}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] font-mono h-4 px-1.5 shrink-0",
                          activeSubcategory === sub
                            ? "bg-primary/20 text-primary border-primary/30"
                            : "",
                        )}
                      >
                        {count}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </aside>

          {/* Mobile: horizontal scroll subcategories */}
          <div className="sm:hidden w-full mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
              {subcategories.map((sub) => {
                const Icon = subcategoryIcons[sub] ?? Sigma;
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setActiveSubcategory(sub)}
                    data-ocid="calculator.category.tab"
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-all shrink-0",
                      activeSubcategory === sub
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calculator grid */}
          <div className="flex-1 min-w-0">
            {/* Subcategory header */}
            <div className="flex items-center gap-3 mb-4">
              {(() => {
                const Icon = subcategoryIcons[activeSubcategory] ?? Sigma;
                return <Icon className="w-4 h-4 text-primary" />;
              })()}
              <h2 className="font-display font-bold text-base">
                {activeSubcategory}
              </h2>
              <Badge variant="secondary" className="font-mono text-[10px]">
                {filteredCalcs.length}
              </Badge>
            </div>

            {filteredCalcs.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-20 text-center"
                data-ocid="calculator.empty_state"
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <FlaskConical className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">
                  No calculators in this category yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredCalcs.map((calc, i) => (
                  <CalculatorCard
                    key={calc.id}
                    calculator={calc}
                    index={i + 1}
                    onClick={onOpenCalculator}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

import { Badge } from "@/components/ui/badge";
import type { CalculatorDef } from "@/data/calculators";
import { ChevronRight } from "lucide-react";

interface CalculatorCardProps {
  calculator: CalculatorDef;
  index: number;
  onClick: (calc: CalculatorDef) => void;
}

const categoryGradients: Record<string, string> = {
  Kinematics: "from-blue-500/10 to-cyan-500/5",
  "Newton's Laws": "from-violet-500/10 to-purple-500/5",
  "Energy & Work": "from-amber-500/10 to-yellow-500/5",
  Thermodynamics: "from-red-500/10 to-orange-500/5",
  Waves: "from-teal-500/10 to-cyan-500/5",
  Electromagnetism: "from-yellow-500/10 to-amber-500/5",
  Optics: "from-pink-500/10 to-rose-500/5",
  Relativity: "from-indigo-500/10 to-blue-500/5",
  "Quantum Mechanics": "from-purple-500/10 to-violet-500/5",
  Gravitation: "from-slate-500/10 to-gray-500/5",
  Algebra: "from-emerald-500/10 to-green-500/5",
  Geometry: "from-sky-500/10 to-blue-500/5",
  Trigonometry: "from-orange-500/10 to-amber-500/5",
  Calculus: "from-fuchsia-500/10 to-pink-500/5",
  Statistics: "from-lime-500/10 to-green-500/5",
  "Unit Converter": "from-cyan-500/10 to-teal-500/5",
};

export function CalculatorCard({
  calculator,
  index,
  onClick,
}: CalculatorCardProps) {
  const gradient =
    categoryGradients[calculator.subcategory] ?? "from-primary/10 to-primary/5";

  return (
    <button
      type="button"
      onClick={() => onClick(calculator)}
      data-ocid={`calculator.item.${index}`}
      className={`
        group relative w-full text-left p-4 rounded-lg border border-border
        bg-card hover:border-primary/40 transition-all duration-200 shimmer-hover
        hover:shadow-plasma-sm
      `}
    >
      <div
        className={`absolute inset-0 rounded-lg bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
      />
      <div className="relative">
        {/* Formula badge */}
        <div className="mb-2">
          <code className="text-xs font-mono text-primary/80 bg-primary/10 px-2 py-0.5 rounded">
            {calculator.formula.split(",")[0].slice(0, 24)}
            {calculator.formula.length > 24 ? "…" : ""}
          </code>
        </div>

        <h3 className="font-semibold text-sm text-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
          {calculator.name}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {calculator.description}
        </p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">
            {calculator.fields.length} input
            {calculator.fields.length !== 1 ? "s" : ""}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </button>
  );
}

interface TrendingCardProps {
  name: string;
  category: string;
  usageCount: number;
  index: number;
  onClick: () => void;
}

export function TrendingCard({
  name,
  category,
  usageCount,
  index,
  onClick,
}: TrendingCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`trending.item.${index}`}
      className="group relative w-full text-left p-4 rounded-lg border border-border bg-card hover:border-primary/40 hover:shadow-plasma-sm transition-all shimmer-hover"
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="secondary"
              className={`text-[10px] font-mono shrink-0 ${category === "Physics" ? "text-chart-1" : "text-chart-2"}`}
            >
              {category}
            </Badge>
          </div>
          <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
            {name}
          </h3>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xs font-mono text-primary font-semibold">
            {usageCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-muted-foreground">uses</div>
        </div>
      </div>
    </button>
  );
}

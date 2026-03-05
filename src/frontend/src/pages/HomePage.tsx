import { TrendingCard } from "@/components/CalculatorCard";
import { ParticleField } from "@/components/ParticleField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { type CalculatorDef, allCalculators } from "@/data/calculators";
import { usePopularCalculators } from "@/hooks/useQueries";
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
  TrendingUp,
  Triangle,
  Waves,
  Zap,
} from "lucide-react";
import { useMemo } from "react";

interface HomePageProps {
  onNavigateCalculators: (subcategory?: string) => void;
  onOpenCalculator: (calc: CalculatorDef) => void;
}

const physicsCategories = [
  { name: "Kinematics", icon: Compass, description: "Motion equations" },
  { name: "Newton's Laws", icon: Zap, description: "Force & mass" },
  { name: "Energy & Work", icon: Star, description: "Energy forms" },
  { name: "Thermodynamics", icon: Thermometer, description: "Heat & gases" },
  { name: "Waves", icon: Waves, description: "Oscillations" },
  { name: "Electromagnetism", icon: Radio, description: "Fields & circuits" },
  { name: "Optics", icon: Eye, description: "Light & lenses" },
  { name: "Relativity", icon: Clock, description: "Space-time" },
  { name: "Quantum Mechanics", icon: Atom, description: "Quantum world" },
  { name: "Gravitation", icon: FlaskConical, description: "Gravity laws" },
];

const mathCategories = [
  { name: "Algebra", icon: Sigma, description: "Equations" },
  { name: "Geometry", icon: Triangle, description: "Shapes & space" },
  { name: "Trigonometry", icon: Compass, description: "Angles & triangles" },
  { name: "Calculus", icon: BarChart3, description: "Derivatives & integrals" },
  { name: "Statistics", icon: BarChart3, description: "Data analysis" },
  { name: "Unit Converter", icon: ArrowRight, description: "Unit conversion" },
];

const featuredCalculators = [
  allCalculators.find((c) => c.id === "relativity-mass-energy")!,
  allCalculators.find((c) => c.id === "quantum-de-broglie")!,
  allCalculators.find((c) => c.id === "kinematics-velocity")!,
  allCalculators.find((c) => c.id === "gravity-escape")!,
  allCalculators.find((c) => c.id === "algebra-quadratic")!,
  allCalculators.find((c) => c.id === "relativity-time-dilation")!,
].filter(Boolean) as CalculatorDef[];

export function HomePage({
  onNavigateCalculators,
  onOpenCalculator,
}: HomePageProps) {
  const { data: popularData, isLoading: popularLoading } =
    usePopularCalculators(10n);

  // Merge backend popularity with local defaults
  const trendingItems = useMemo(() => {
    if (popularData && popularData.length > 0) {
      return popularData.map((p) => ({
        name: p.calculatorName,
        category: p.category,
        usageCount: Number(p.usageCount),
        calc: allCalculators.find((c) => c.name === p.calculatorName) ?? null,
      }));
    }
    // Default trending when no backend data
    return featuredCalculators.map((c, i) => ({
      name: c.name,
      category: c.category,
      usageCount: [128, 97, 84, 71, 63, 55][i] ?? 40,
      calc: c,
    }));
  }, [popularData]);

  return (
    <main className="min-h-screen" data-ocid="home.page">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-quantum-field.dim_1400x600.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-20 dark:opacity-15"
          />
        </div>
        <div className="absolute inset-0 bg-background/60 quantum-grid" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(var(--primary) / 0.1) 0%, transparent 70%)",
          }}
        />
        <ParticleField count={20} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-mono text-primary mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Scientific Computing Platform
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-none mb-4">
            <span className="text-foreground">Physics</span>
            <span
              className="text-primary text-glow-plasma"
              style={{ textShadow: "0 0 40px oklch(var(--primary) / 0.4)" }}
            >
              Math
            </span>
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
            Precision calculators for{" "}
            <span className="text-foreground font-medium">
              quantum mechanics
            </span>
            , <span className="text-foreground font-medium">relativity</span>,{" "}
            <span className="text-foreground font-medium">thermodynamics</span>,
            and advanced mathematics — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => onNavigateCalculators()}
              data-ocid="category.physics.button"
              size="lg"
              className="font-semibold px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-plasma"
            >
              <FlaskConical className="w-4 h-4 mr-2" />
              Explore Calculators
            </Button>
            <Button
              onClick={() => onNavigateCalculators("Algebra")}
              data-ocid="category.math.button"
              variant="outline"
              size="lg"
              className="font-semibold px-8 border-border hover:border-primary/40"
            >
              <Sigma className="w-4 h-4 mr-2" />
              Mathematics
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 flex items-center justify-center gap-8 sm:gap-12">
            {[
              { label: "Calculators", value: `${allCalculators.length}+` },
              { label: "Physics Topics", value: "10" },
              { label: "Math Topics", value: "6" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="font-display font-bold text-2xl text-primary">
                  {value}
                </div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Formulas ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            "E = mc²",
            "F = ma",
            "v = u + at",
            "λ = h/mv",
            "PV = nRT",
            "F = Gm₁m₂/r²",
          ].map((formula) => (
            <div
              key={formula}
              className="px-3 py-1.5 rounded-md border border-border bg-card font-mono text-xs text-primary/80"
            >
              {formula}
            </div>
          ))}
        </div>
      </section>

      {/* ── Trending Calculators ──────────────────────────────────────── */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
        data-ocid="trending.section"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="font-display font-bold text-lg">
              Trending Calculators
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateCalculators()}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            View all <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>

        {popularLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((k) => (
              <Skeleton key={k} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {trendingItems.slice(0, 6).map((item, i) => (
              <TrendingCard
                key={`${item.name}-${i}`}
                name={item.name}
                category={item.category}
                usageCount={item.usageCount}
                index={i + 1}
                onClick={() => {
                  if (item.calc) onOpenCalculator(item.calc);
                  else onNavigateCalculators();
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Physics Categories ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2.5 mb-5">
          <Atom className="w-4 h-4 text-chart-1" />
          <h2 className="font-display font-bold text-lg">Physics</h2>
          <Badge variant="secondary" className="font-mono text-[10px]">
            {allCalculators.filter((c) => c.category === "Physics").length}{" "}
            calculators
          </Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {physicsCategories.map(({ name, icon: Icon, description }) => (
            <button
              key={name}
              type="button"
              onClick={() => onNavigateCalculators(name)}
              data-ocid="category.physics.button"
              className="group relative p-4 rounded-lg border border-border bg-card hover:border-primary/40 hover:shadow-plasma-sm transition-all text-left shimmer-hover"
            >
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Icon className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-xs leading-tight text-foreground group-hover:text-primary transition-colors">
                {name}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {description}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Math Categories ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-16">
        <div className="flex items-center gap-2.5 mb-5">
          <Sigma className="w-4 h-4 text-chart-2" />
          <h2 className="font-display font-bold text-lg">Mathematics</h2>
          <Badge variant="secondary" className="font-mono text-[10px]">
            {allCalculators.filter((c) => c.category === "Mathematics").length}{" "}
            calculators
          </Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {mathCategories.map(({ name, icon: Icon, description }) => (
            <button
              key={name}
              type="button"
              onClick={() => onNavigateCalculators(name)}
              data-ocid="category.math.button"
              className="group relative p-4 rounded-lg border border-border bg-card hover:border-primary/40 hover:shadow-plasma-sm transition-all text-left shimmer-hover"
            >
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-chart-2/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Icon className="w-5 h-5 text-chart-2 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-xs leading-tight text-foreground group-hover:text-chart-2 transition-colors">
                {name}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {description}
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useActor } from "@/hooks/useActor";
import {
  ArrowLeftRight,
  Info,
  Landmark,
  Map as MapIcon,
  MapPin,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ── Unit definitions ──────────────────────────────────────────────────────────
interface UnitDef {
  key: string;
  displayName: string;
  symbol: string;
  sqftFactor: number;
  category: "Indian" | "International";
  region?: string;
}

const INDIAN_UNITS: UnitDef[] = [
  {
    key: "Bigha",
    displayName: "Bigha",
    symbol: "Bigha",
    sqftFactor: 27220,
    category: "Indian",
    region: "Bihar/UP/Jharkhand",
  },
  {
    key: "Kattha",
    displayName: "Kattha",
    symbol: "Kattha",
    sqftFactor: 1361,
    category: "Indian",
    region: "Bihar/UP/Jharkhand",
  },
  {
    key: "Dhur",
    displayName: "Dhur",
    symbol: "Dhur",
    sqftFactor: 68.0625,
    category: "Indian",
    region: "Bihar/UP/Jharkhand",
  },
  {
    key: "Dhurki",
    displayName: "Dhurki",
    symbol: "Dhurki",
    sqftFactor: 17.015625,
    category: "Indian",
    region: "Bihar/UP/Jharkhand",
  },
  {
    key: "Guniya",
    displayName: "Guniya",
    symbol: "Guniya",
    sqftFactor: 1361,
    category: "Indian",
    region: "Bihar/UP/Jharkhand",
  },
  {
    key: "Latha",
    displayName: "Latha",
    symbol: "Latha",
    sqftFactor: 68.0625,
    category: "Indian",
    region: "Bihar/UP/Jharkhand",
  },
  {
    key: "Decimal",
    displayName: "Decimal (Dismil)",
    symbol: "Decimal",
    sqftFactor: 435.6,
    category: "Indian",
    region: "Pan-India",
  },
  {
    key: "Cent",
    displayName: "Cent",
    symbol: "Cent",
    sqftFactor: 435.6,
    category: "Indian",
    region: "South India",
  },
  {
    key: "Guntha",
    displayName: "Guntha",
    symbol: "Guntha",
    sqftFactor: 1089,
    category: "Indian",
    region: "Maharashtra/Karnataka",
  },
  {
    key: "Kanal",
    displayName: "Kanal",
    symbol: "Kanal",
    sqftFactor: 5445,
    category: "Indian",
    region: "Punjab/Haryana/J&K",
  },
  {
    key: "Marla",
    displayName: "Marla",
    symbol: "Marla",
    sqftFactor: 272.25,
    category: "Indian",
    region: "Punjab/Haryana",
  },
  {
    key: "Biswa",
    displayName: "Biswa",
    symbol: "Biswa",
    sqftFactor: 1361,
    category: "Indian",
    region: "UP/Haryana",
  },
  {
    key: "Ground",
    displayName: "Ground",
    symbol: "Ground",
    sqftFactor: 2400,
    category: "Indian",
    region: "Tamil Nadu",
  },
  {
    key: "Are",
    displayName: "Are",
    symbol: "Are",
    sqftFactor: 1076.39104,
    category: "Indian",
    region: "Pan-India",
  },
];

const INTERNATIONAL_UNITS: UnitDef[] = [
  {
    key: "SquareMillimeter",
    displayName: "Square Millimeter",
    symbol: "mm²",
    sqftFactor: 0.00001076391,
    category: "International",
  },
  {
    key: "SquareCentimeter",
    displayName: "Square Centimeter",
    symbol: "cm²",
    sqftFactor: 0.001076391,
    category: "International",
  },
  {
    key: "SquareMeter",
    displayName: "Square Meter",
    symbol: "m²",
    sqftFactor: 10.76391,
    category: "International",
  },
  {
    key: "SquareKilometer",
    displayName: "Square Kilometer",
    symbol: "km²",
    sqftFactor: 10763910.417,
    category: "International",
  },
  {
    key: "SquareFoot",
    displayName: "Square Foot",
    symbol: "ft²",
    sqftFactor: 1,
    category: "International",
  },
  {
    key: "SquareYard",
    displayName: "Square Yard",
    symbol: "yd²",
    sqftFactor: 9,
    category: "International",
  },
  {
    key: "Acre",
    displayName: "Acre",
    symbol: "Acre",
    sqftFactor: 43560,
    category: "International",
  },
  {
    key: "Hectare",
    displayName: "Hectare",
    symbol: "ha",
    sqftFactor: 107639.1042,
    category: "International",
  },
];

const ALL_UNITS: UnitDef[] = [...INDIAN_UNITS, ...INTERNATIONAL_UNITS];

const UNIT_MAP: Record<string, UnitDef> = Object.fromEntries(
  ALL_UNITS.map((u) => [u.key, u]),
);

const BASE_FACTS = [
  { label: "1 Dhur", value: "68.0625 sq ft" },
  { label: "1 Kattha", value: "1,361 sq ft" },
  { label: "1 Bigha", value: "27,220 sq ft" },
  { label: "1 Decimal", value: "435.6 sq ft" },
  { label: "1 Acre", value: "43,560 sq ft" },
];

// ── Conversion helpers ────────────────────────────────────────────────────────
function convertValue(value: number, fromKey: string, toKey: string): number {
  const from = UNIT_MAP[fromKey];
  const to = UNIT_MAP[toKey];
  if (!from || !to) return 0;
  return (value * from.sqftFactor) / to.sqftFactor;
}

function formatNumber(num: number): string {
  if (!Number.isFinite(num) || Number.isNaN(num)) return "—";
  if (num === 0) return "0";
  const abs = Math.abs(num);
  if (abs >= 1e12 || (abs < 1e-6 && abs > 0)) {
    return num.toExponential(4);
  }
  if (abs >= 1e6) {
    return num.toLocaleString("en-IN", { maximumFractionDigits: 4 });
  }
  // Trim trailing zeros from toFixed(8)
  const fixed = num.toFixed(8);
  return Number.parseFloat(fixed).toString();
}

function formatResult(num: number): string {
  if (!Number.isFinite(num) || Number.isNaN(num)) return "—";
  if (num === 0) return "0";
  const abs = Math.abs(num);
  if (abs >= 1e12 || (abs < 1e-6 && abs > 0)) {
    return num.toExponential(6);
  }
  // Smart precision
  if (abs >= 10000)
    return num.toLocaleString("en-IN", { maximumFractionDigits: 4 });
  if (abs >= 100)
    return num.toLocaleString("en-IN", { maximumFractionDigits: 6 });
  return Number.parseFloat(num.toFixed(8)).toString();
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function LandSurveyPage() {
  const { actor } = useActor();
  const [value, setValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("Bigha");
  const [toUnit, setToUnit] = useState<string>("Acre");
  const resultKeyRef = useRef(0);

  // Fire-and-forget backend initialization
  useEffect(() => {
    if (actor) {
      actor.initializeUnits().catch(() => {
        /* silent */
      });
    }
  }, [actor]);

  const numValue = useMemo(() => {
    const n = Number.parseFloat(value);
    return Number.isNaN(n) ? 0 : n;
  }, [value]);

  const result = useMemo(() => {
    return convertValue(numValue, fromUnit, toUnit);
  }, [numValue, fromUnit, toUnit]);

  const fromUnitDef = UNIT_MAP[fromUnit];
  const toUnitDef = UNIT_MAP[toUnit];

  // Increment key on each render with new result for animation
  resultKeyRef.current += 1;
  const resultKey = resultKeyRef.current;

  const handleSwap = useCallback(() => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }, [fromUnit, toUnit]);

  // All-units table
  const allConversions = useMemo(() => {
    if (numValue === 0 || !fromUnit) return [];
    return ALL_UNITS.map((unit) => ({
      unit,
      converted: convertValue(numValue, fromUnit, unit.key),
    }));
  }, [numValue, fromUnit]);

  const indianConversions = allConversions.filter(
    (c) => c.unit.category === "Indian",
  );
  const internationalConversions = allConversions.filter(
    (c) => c.unit.category === "International",
  );

  return (
    <TooltipProvider>
      <main className="min-h-screen relative" data-ocid="survey.page">
        {/* Background texture */}
        <div className="absolute inset-0 cadaster-grid opacity-60 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 40% at 50% 0%, oklch(var(--survey-amber) / 0.07) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-16">
          {/* ── Page Header ──────────────────────────────────────────────── */}
          <header className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-survey-amber/30 bg-survey-amber/5 text-xs font-mono text-survey-amber mb-4">
              <MapPin className="w-3.5 h-3.5" />
              Indian & International Land Units
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-none mb-3">
              <span className="text-foreground">Land Survey</span>{" "}
              <span
                className="text-survey-amber"
                style={{
                  textShadow: "0 0 30px oklch(var(--survey-amber) / 0.35)",
                }}
              >
                Converter
              </span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
              Convert between all land measurement units — Bihar, UP & Jharkhand
              amin units, and international standards.
            </p>
          </header>

          {/* ── Converter Card ───────────────────────────────────────────── */}
          <Card className="border-border bg-card shadow-card-dark mb-6 overflow-hidden">
            {/* Amber accent top bar */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-survey-amber to-transparent opacity-60" />

            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base flex items-center gap-2 text-foreground">
                <MapIcon className="w-4 h-4 text-survey-amber" />
                Unit Converter
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Value input + unit selects */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] gap-3 items-end">
                {/* Value Input */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-medium">
                    Value
                  </Label>
                  <Input
                    data-ocid="converter.value_input"
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter value"
                    className="text-lg font-mono font-semibold h-12 border-border focus:border-survey-amber/60 focus:ring-survey-amber/30 bg-background"
                    min="0"
                  />
                </div>

                {/* From Unit */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-medium">
                    From Unit
                  </Label>
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger
                      data-ocid="converter.from_unit_select"
                      className="h-12 w-full sm:min-w-[170px] border-border bg-background"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      <SelectGroup>
                        <SelectLabel className="text-xs font-semibold text-survey-amber flex items-center gap-1.5">
                          <Landmark className="w-3 h-3" />
                          Indian Units
                        </SelectLabel>
                        {INDIAN_UNITS.map((u) => (
                          <SelectItem key={u.key} value={u.key}>
                            <span className="font-medium">{u.displayName}</span>
                            {u.region && (
                              <span className="text-muted-foreground text-[11px] ml-1.5">
                                ({u.region})
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel className="text-xs font-semibold text-primary flex items-center gap-1.5 mt-1">
                          <MapIcon className="w-3 h-3" />
                          International Units
                        </SelectLabel>
                        {INTERNATIONAL_UNITS.map((u) => (
                          <SelectItem key={u.key} value={u.key}>
                            <span className="font-medium">{u.displayName}</span>
                            <span className="text-muted-foreground text-[11px] ml-1.5">
                              {u.symbol}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Swap Button */}
                <div className="flex items-end justify-center pb-0.5">
                  <Button
                    data-ocid="converter.swap_button"
                    variant="outline"
                    size="icon"
                    onClick={handleSwap}
                    className="h-12 w-12 border-survey-amber/30 hover:border-survey-amber/60 hover:bg-survey-amber/10 text-survey-amber transition-all hover:rotate-180"
                    title="Swap units"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* To Unit */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-medium">
                    To Unit
                  </Label>
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger
                      data-ocid="converter.to_unit_select"
                      className="h-12 w-full sm:min-w-[170px] border-border bg-background"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      <SelectGroup>
                        <SelectLabel className="text-xs font-semibold text-survey-amber flex items-center gap-1.5">
                          <Landmark className="w-3 h-3" />
                          Indian Units
                        </SelectLabel>
                        {INDIAN_UNITS.map((u) => (
                          <SelectItem key={u.key} value={u.key}>
                            <span className="font-medium">{u.displayName}</span>
                            {u.region && (
                              <span className="text-muted-foreground text-[11px] ml-1.5">
                                ({u.region})
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel className="text-xs font-semibold text-primary flex items-center gap-1.5 mt-1">
                          <MapIcon className="w-3 h-3" />
                          International Units
                        </SelectLabel>
                        {INTERNATIONAL_UNITS.map((u) => (
                          <SelectItem key={u.key} value={u.key}>
                            <span className="font-medium">{u.displayName}</span>
                            <span className="text-muted-foreground text-[11px] ml-1.5">
                              {u.symbol}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Info tooltip */}
                <div className="hidden sm:flex items-end justify-center pb-0.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-10 text-muted-foreground hover:text-survey-amber"
                        data-ocid="converter.info.button"
                      >
                        <Info className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="left"
                      className="max-w-xs p-3"
                      data-ocid="converter.info.tooltip"
                    >
                      <p className="font-semibold text-xs mb-2 text-survey-amber">
                        Base Conversion Facts
                      </p>
                      <div className="space-y-1">
                        {BASE_FACTS.map((f) => (
                          <div
                            key={f.label}
                            className="flex justify-between gap-4 text-xs"
                          >
                            <span className="text-muted-foreground">
                              {f.label}
                            </span>
                            <span className="font-mono font-medium text-foreground">
                              {f.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* ── Result Display ─────────────────────────────────────── */}
              <div
                key={resultKey}
                data-ocid="converter.result_panel"
                className="mt-5 rounded-xl survey-result-bg p-5 result-flash glow-amber"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  {/* Input summary */}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-mono font-semibold text-xl text-foreground">
                      {value || "0"}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {fromUnitDef?.displayName ?? fromUnit}
                    </span>
                    <span className="text-muted-foreground text-xs">=</span>
                  </div>

                  {/* Result */}
                  <div className="flex items-baseline gap-2 flex-wrap sm:flex-row-reverse sm:text-right">
                    <span className="font-mono font-black text-2xl sm:text-3xl text-survey-amber">
                      {formatResult(result)}
                    </span>
                    <span className="text-foreground font-semibold text-sm">
                      {toUnitDef?.displayName ?? toUnit}
                    </span>
                  </div>
                </div>

                {/* Formula note */}
                {fromUnitDef && toUnitDef && (
                  <div className="mt-3 pt-3 border-t border-survey-amber/20">
                    <p className="text-xs text-muted-foreground font-mono">
                      Formula: value × {fromUnitDef.sqftFactor} ÷{" "}
                      {toUnitDef.sqftFactor} (base: sq ft)
                    </p>
                  </div>
                )}
              </div>

              {/* Mobile info */}
              <div className="mt-4 sm:hidden rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs font-semibold text-survey-amber mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Base Conversion Facts
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {BASE_FACTS.map((f) => (
                    <div key={f.label} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{f.label}</span>
                      <span className="font-mono font-medium text-foreground">
                        {f.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Convert to All Units Table ───────────────────────────────── */}
          <Card
            className="border-border bg-card shadow-card-dark overflow-hidden"
            data-ocid="all_units.table"
          >
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-survey-green to-transparent opacity-50" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="font-display text-base flex items-center gap-2 text-foreground">
                  <ArrowLeftRight className="w-4 h-4 text-survey-green" />
                  All Unit Conversions
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="font-mono text-[10px] px-2"
                >
                  {numValue} {fromUnitDef?.symbol ?? fromUnit}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-6">
                {/* ── Indian Units ────────────────────────────────────── */}
                <div data-ocid="all_units.indian_section">
                  <div className="flex items-center gap-2 mb-3">
                    <Landmark className="w-3.5 h-3.5 text-survey-amber" />
                    <h3 className="text-sm font-semibold text-survey-amber">
                      Indian Survey Units
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      Bihar · UP · Jharkhand · Pan-India
                    </span>
                  </div>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                          <TableHead className="text-xs font-semibold w-[140px]">
                            Unit
                          </TableHead>
                          <TableHead className="text-xs font-semibold w-[80px]">
                            Symbol
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-right">
                            Converted Value
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-right w-[130px] hidden sm:table-cell">
                            Region
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {indianConversions.map(({ unit, converted }, idx) => (
                          <TableRow
                            key={unit.key}
                            data-ocid={`all_units.indian.row.${idx + 1}`}
                            className={`
                              hover:bg-survey-amber/5 transition-colors
                              ${unit.key === fromUnit ? "bg-survey-amber/8 border-l-2 border-survey-amber" : ""}
                            `}
                          >
                            <TableCell className="font-medium text-sm py-2.5">
                              {unit.displayName}
                              {unit.key === fromUnit && (
                                <Badge
                                  variant="secondary"
                                  className="ml-1.5 text-[9px] px-1 py-0 h-4 text-survey-amber bg-survey-amber/10"
                                >
                                  source
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground py-2.5">
                              {unit.symbol}
                            </TableCell>
                            <TableCell className="font-mono font-semibold text-sm text-right py-2.5 text-survey-amber">
                              {formatNumber(converted)}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground text-right py-2.5 hidden sm:table-cell">
                              {unit.region}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* ── International Units ─────────────────────────────── */}
                <div data-ocid="all_units.international_section">
                  <div className="flex items-center gap-2 mb-3">
                    <MapIcon className="w-3.5 h-3.5 text-primary" />
                    <h3 className="text-sm font-semibold text-primary">
                      International / Standard Units
                    </h3>
                  </div>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                          <TableHead className="text-xs font-semibold w-[180px]">
                            Unit
                          </TableHead>
                          <TableHead className="text-xs font-semibold w-[80px]">
                            Symbol
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-right">
                            Converted Value
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {internationalConversions.map(
                          ({ unit, converted }, idx) => (
                            <TableRow
                              key={unit.key}
                              data-ocid={`all_units.international.row.${idx + 1}`}
                              className={`
                              hover:bg-primary/5 transition-colors
                              ${unit.key === fromUnit ? "bg-primary/8 border-l-2 border-primary" : ""}
                            `}
                            >
                              <TableCell className="font-medium text-sm py-2.5">
                                {unit.displayName}
                                {unit.key === fromUnit && (
                                  <Badge
                                    variant="secondary"
                                    className="ml-1.5 text-[9px] px-1 py-0 h-4 text-primary bg-primary/10"
                                  >
                                    source
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="font-mono text-xs text-muted-foreground py-2.5">
                                {unit.symbol}
                              </TableCell>
                              <TableCell className="font-mono font-semibold text-sm text-right py-2.5 text-primary">
                                {formatNumber(converted)}
                              </TableCell>
                            </TableRow>
                          ),
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Base Conversion Reference ─────────────────────────────────── */}
          <div className="mt-6 rounded-xl border border-border bg-card/60 p-4">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-survey-amber shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground mb-2">
                  Standard Reference Values (Bihar/UP/Jharkhand Amin Survey)
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  {BASE_FACTS.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <span className="text-muted-foreground">{f.label}</span>
                      <span className="text-foreground/40">=</span>
                      <span className="font-mono font-semibold text-survey-amber">
                        {f.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </TooltipProvider>
  );
}

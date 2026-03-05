import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CalculatorDef, CalculatorResult } from "@/data/calculators";
import { useLogCalculation } from "@/hooks/useQueries";
import { ChevronRight, Loader2, X, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CalculatorModalProps {
  calculator: CalculatorDef | null;
  onClose: () => void;
}

export function CalculatorModal({ calculator, onClose }: CalculatorModalProps) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const logCalculation = useLogCalculation();

  if (!calculator) return null;

  const handleInputChange = (id: string, value: string) => {
    setInputs((prev) => ({ ...prev, [id]: value }));
    setResult(null);
  };

  const handleCalculate = async () => {
    // Validate inputs
    const missing = calculator.fields.filter(
      (f) => !inputs[f.id] && f.type !== "text",
    );
    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.map((f) => f.label).join(", ")}`);
      return;
    }

    setIsCalculating(true);
    try {
      const res = calculator.calculate(inputs);
      setResult(res);

      // Log to backend
      logCalculation.mutate({
        calculatorName: calculator.name,
        category: calculator.category,
        inputSummary: res.inputSummary,
        resultSummary: `${res.value} ${res.unit}`.trim(),
      });
    } catch (_err) {
      toast.error("Calculation error. Please check your inputs.");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCalculate();
  };

  const handleReset = () => {
    setInputs({});
    setResult(null);
  };

  const categoryColor =
    calculator.category === "Physics" ? "text-chart-1" : "text-chart-2";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      data-ocid="calc.modal"
    >
      {/* Backdrop */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop close on click is standard modal UX */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="relative w-full sm:max-w-xl max-h-[90vh] sm:max-h-[85vh] bg-card border border-border rounded-t-2xl sm:rounded-xl shadow-card-dark flex flex-col overflow-hidden animate-fade-in"
        style={{
          boxShadow:
            "0 0 0 1px oklch(var(--border)), 0 20px 60px rgba(0,0,0,0.5), 0 0 40px oklch(var(--primary) / 0.05)",
        }}
      >
        {/* Glow line at top */}
        <div
          className="absolute top-0 left-1/4 right-1/4 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(var(--primary) / 0.6), transparent)",
          }}
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-5 border-b border-border shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant="secondary"
                className={`text-xs font-mono ${categoryColor}`}
              >
                {calculator.category}
              </Badge>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {calculator.subcategory}
              </span>
            </div>
            <h2 className="font-display font-semibold text-base leading-tight">
              {calculator.name}
            </h2>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {calculator.description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0 w-8 h-8 text-muted-foreground"
            data-ocid="calc.close_button"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Formula display */}
          <div className="formula-block" aria-label="Formula">
            <div className="text-xs text-muted-foreground font-mono mb-1 opacity-60">
              FORMULA
            </div>
            <div className="text-primary font-mono text-lg font-semibold tracking-wide">
              {calculator.formula}
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-3">
            {calculator.fields.map((field, i) => (
              <div key={field.id} className="space-y-1.5">
                <Label
                  htmlFor={`field-${field.id}`}
                  className="text-xs font-medium text-foreground/80"
                >
                  {field.label}
                  {field.unit && (
                    <span className="ml-1 text-muted-foreground font-mono">
                      [{field.unit}]
                    </span>
                  )}
                </Label>
                <Input
                  id={`field-${field.id}`}
                  data-ocid={i === 0 ? "calc.input" : `calc.input.${i + 1}`}
                  type={field.type === "text" ? "text" : "number"}
                  placeholder={field.placeholder}
                  value={inputs[field.id] ?? ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="font-mono text-sm bg-background border-input focus:border-primary/60 h-9"
                  autoFocus={i === 0}
                />
                {field.hint && (
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {field.hint}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Result panel */}
          {result && (
            <div
              className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2 animate-fade-in"
              data-ocid="calc.result_panel"
              style={{ boxShadow: "0 0 20px oklch(var(--primary) / 0.08)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-mono text-primary font-semibold tracking-widest uppercase">
                  Result
                </span>
              </div>
              <div className="font-mono text-xl font-bold text-foreground">
                {result.value}
                {result.unit && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {result.unit}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-2 mt-2">
                {result.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-2 p-4 border-t border-border shrink-0">
          <Button
            onClick={handleCalculate}
            disabled={isCalculating}
            data-ocid="calc.submit_button"
            className="flex-1 font-semibold h-9 bg-primary text-primary-foreground hover:bg-primary/90"
            style={{ boxShadow: "0 0 16px oklch(var(--primary) / 0.2)" }}
          >
            {isCalculating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 mr-2" />
                Calculate
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            data-ocid="calc.secondary_button"
            className="h-9 px-4 text-muted-foreground"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

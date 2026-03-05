import { CalculatorModal } from "@/components/CalculatorModal";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import type { CalculatorDef } from "@/data/calculators";
import { useCalculationHistory } from "@/hooks/useQueries";
import { CalculatorsPage } from "@/pages/CalculatorsPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { HomePage } from "@/pages/HomePage";
import { useCallback, useEffect, useState } from "react";

type Page = "home" | "calculators" | "history";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [initialSubcategory, setInitialSubcategory] = useState<
    string | undefined
  >();
  const [activeCalculator, setActiveCalculator] =
    useState<CalculatorDef | null>(null);
  const [isDark, setIsDark] = useState(true);

  const { data: history } = useCalculationHistory(20n);

  // Apply dark mode class
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  }, [isDark]);

  const handlePageChange = useCallback((newPage: Page) => {
    setPage(newPage);
    if (newPage !== "calculators") {
      setInitialSubcategory(undefined);
    }
  }, []);

  const handleNavigateCalculators = useCallback((subcategory?: string) => {
    setInitialSubcategory(subcategory);
    setPage("calculators");
  }, []);

  const handleOpenCalculator = useCallback((calc: CalculatorDef) => {
    setActiveCalculator(calc);
  }, []);

  const handleCloseCalculator = useCallback(() => {
    setActiveCalculator(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header
        currentPage={page}
        onPageChange={handlePageChange}
        isDark={isDark}
        onToggleTheme={() => setIsDark((d) => !d)}
        historyCount={history?.length}
      />

      <div className="flex-1">
        {page === "home" && (
          <HomePage
            onNavigateCalculators={handleNavigateCalculators}
            onOpenCalculator={handleOpenCalculator}
          />
        )}
        {page === "calculators" && (
          <CalculatorsPage
            initialSubcategory={initialSubcategory}
            onOpenCalculator={handleOpenCalculator}
          />
        )}
        {page === "history" && <HistoryPage />}
      </div>

      <Footer />

      {/* Calculator modal overlay */}
      {activeCalculator && (
        <CalculatorModal
          calculator={activeCalculator}
          onClose={handleCloseCalculator}
        />
      )}

      <Toaster
        theme={isDark ? "dark" : "light"}
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "font-body text-sm border-border bg-popover",
          },
        }}
      />
    </div>
  );
}

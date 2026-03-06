import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { LandSurveyPage } from "@/pages/LandSurveyPage";
import { useEffect, useState } from "react";

export default function App() {
  const [isDark, setIsDark] = useState(true);

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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header isDark={isDark} onToggleTheme={() => setIsDark((d) => !d)} />

      <div className="flex-1">
        <LandSurveyPage />
      </div>

      <Footer />

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

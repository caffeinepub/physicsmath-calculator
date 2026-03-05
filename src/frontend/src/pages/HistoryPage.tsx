import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useCalculationHistory, useClearHistory } from "@/hooks/useQueries";
import {
  AlertTriangle,
  ChevronRight,
  Clock,
  History,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000; // nanoseconds to milliseconds
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

export function HistoryPage() {
  const { data: history, isLoading } = useCalculationHistory(20n);
  const clearHistory = useClearHistory();

  const handleClear = async () => {
    try {
      await clearHistory.mutateAsync();
      toast.success("Calculation history cleared.");
    } catch {
      toast.error("Failed to clear history.");
    }
  };

  return (
    <main className="min-h-screen" data-ocid="history.panel">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-primary" />
            <h1 className="font-display font-bold text-xl">
              Calculation History
            </h1>
            {history && history.length > 0 && (
              <Badge variant="secondary" className="font-mono text-xs">
                {history.length}
              </Badge>
            )}
          </div>

          {history && history.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive/30 hover:border-destructive/60 hover:bg-destructive/5"
                  data-ocid="history.clear_button"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent data-ocid="history.dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    Clear History?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {history.length}{" "}
                    calculation records. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-ocid="history.cancel_button">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClear}
                    data-ocid="history.confirm_button"
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Clear History
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {["hsk1", "hsk2", "hsk3", "hsk4", "hsk5"].map((k) => (
              <Skeleton
                key={k}
                className="h-20 rounded-lg"
                data-ocid="history.loading_state"
              />
            ))}
          </div>
        ) : !history || history.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="history.empty_state"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
              <History className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-base mb-2">
              No calculations yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Use any calculator to see your calculation history appear here.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-2 pr-2">
              {history.map((record, i) => (
                <div
                  key={record.id.toString()}
                  data-ocid={`history.item.${i + 1}`}
                  className="group p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="font-mono text-xs text-primary font-bold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-foreground truncate">
                            {record.calculatorName}
                          </span>
                          <Badge
                            variant="secondary"
                            className={`text-[10px] font-mono shrink-0 ${record.category === "Physics" ? "text-chart-1" : "text-chart-2"}`}
                          >
                            {record.category}
                          </Badge>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div className="text-muted-foreground">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
                            Input:{" "}
                          </span>
                          <span className="font-mono text-foreground/80">
                            {record.inputSummary}
                          </span>
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
                            Result:{" "}
                          </span>
                          <span className="font-mono text-primary font-medium">
                            {record.resultSummary}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{formatTimestamp(record.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </main>
  );
}

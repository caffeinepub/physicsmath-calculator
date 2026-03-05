import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useCalculationHistory(limit = 20n) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["history", limit.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCalculationHistory(limit);
    },
    enabled: !!actor && !isFetching,
    refetchOnWindowFocus: false,
  });
}

export function usePopularCalculators(limit = 10n) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["popular", limit.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPopularCalculators(limit);
    },
    enabled: !!actor && !isFetching,
    refetchOnWindowFocus: false,
  });
}

export function useLogCalculation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      calculatorName,
      category,
      inputSummary,
      resultSummary,
    }: {
      calculatorName: string;
      category: string;
      inputSummary: string;
      resultSummary: string;
    }) => {
      if (!actor) return;
      await actor.logCalculation(
        calculatorName,
        category,
        inputSummary,
        resultSummary,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
      queryClient.invalidateQueries({ queryKey: ["popular"] });
    },
  });
}

export function useClearHistory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.clearHistory();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}

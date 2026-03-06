import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useCalculationHistory(_limit = 20n) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      if (!actor) return [];
      // Backend is a land survey converter — no calculation history endpoint
      return [] as { calculatorName: string; category: string }[];
    },
    enabled: !!actor && !isFetching,
    refetchOnWindowFocus: false,
  });
}

export function usePopularCalculators(_limit = 10n) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["popular"],
    queryFn: async () => {
      if (!actor) return [];
      // Backend is a land survey converter — no popular calculators endpoint
      return [] as {
        calculatorName: string;
        category: string;
        usageCount: bigint;
      }[];
    },
    enabled: !!actor && !isFetching,
    refetchOnWindowFocus: false,
  });
}

export function useLogCalculation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_params: {
      calculatorName: string;
      category: string;
      inputSummary: string;
      resultSummary: string;
    }) => {
      if (!actor) return;
      // No-op: backend is a land survey converter
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
      // No-op: backend is a land survey converter
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}

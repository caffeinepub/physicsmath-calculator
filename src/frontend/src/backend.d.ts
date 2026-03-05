import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CalculationRecord {
    id: bigint;
    inputSummary: string;
    timestamp: bigint;
    category: string;
    calculatorName: string;
    resultSummary: string;
}
export interface PopularCalculator {
    usageCount: bigint;
    category: string;
    calculatorName: string;
}
export interface backendInterface {
    clearHistory(): Promise<void>;
    getCalculationHistory(limit: bigint): Promise<Array<CalculationRecord>>;
    getPopularCalculators(limit: bigint): Promise<Array<PopularCalculator>>;
    logCalculation(calculatorName: string, category: string, inputSummary: string, resultSummary: string): Promise<void>;
}

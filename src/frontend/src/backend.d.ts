import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UnitType = string;
export type UnitCategory = string;
export interface AllUnitsConversion {
    inputUnit: UnitType;
    inputValue: number;
    conversions: Array<[UnitType, number]>;
}
export interface UnitMetadata {
    displayName: string;
    category: UnitCategory;
    symbol: string;
}
export interface ConversionResult {
    convertedValue: number;
    toUnit: UnitType;
    fromUnit: UnitType;
    inputValue: number;
}
export interface backendInterface {
    clearUnitData(): Promise<void>;
    convertArea(fromUnit: UnitType, toUnit: UnitType, value: number): Promise<ConversionResult | null>;
    convertToAllUnits(inputUnit: UnitType, value: number): Promise<AllUnitsConversion | null>;
    getSupportedUnits(): Promise<Array<UnitType>>;
    getUnitMetadata(): Promise<Array<[UnitType, UnitMetadata]>>;
    initializeUnits(): Promise<void>;
}

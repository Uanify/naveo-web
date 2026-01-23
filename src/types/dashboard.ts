export interface KpiEntry {
    title: string;
    percentage: number;
    current: number;
    allowed: number;
    unit?: string;
};

export type KpiEntryExtended = Omit<
    KpiEntry,
    "current" | "allowed" | "unit"
> & {
    value: string
    color: string
}
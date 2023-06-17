export type CellConversionFunction<T,K extends keyof T> = (value: string) => T[K];

export type TableToRecordMapping<T> = Array<ColumnMapping<T>>

export interface ITableRow {
    cells: string[];
}

export interface ITable {
    headers: string[];
    rows: ITableRow[];
}

export interface ColumnMapping<T> {
    tableColHeader: string;
    target: MappingToField<T, keyof T> | MappingToField<T, keyof T>[];
}

export interface MappingToField<T, K extends keyof T> {
    fieldName: K;
    convert?: CellConversionFunction<T, K>;
}
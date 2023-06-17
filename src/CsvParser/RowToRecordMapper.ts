import { ITableRow, MappingToField, TableToRecordMapping } from "./Model";

export class RowToRecordMapper<T> {

    private _indexedMapping! : Record<number, MappingToField<T, keyof T>[]>;

    constructor(headers : ITableRow, tableToRecordMapping: TableToRecordMapping<T>) {
        this._indexedMapping = RowToRecordMapper.buildMapping(headers, tableToRecordMapping);
    }

    private static buildMapping<T>(headers: ITableRow, tableToRecord: TableToRecordMapping<T>) : Record<number, MappingToField<T, keyof T>[]> {
        let mapping = {} as Record<number, MappingToField<T, keyof T>[]>;
        for(const tableToRecordEntry of tableToRecord) {
            const index = RowToRecordMapper.getIndex(headers, tableToRecordEntry.tableColHeader);

            if (!mapping[index]) {
                mapping[index] = [];
            }
            
            if (tableToRecordEntry.target instanceof Array) {
                mapping[index]!.push(...tableToRecordEntry.target);
            }
            else {
                mapping[index]!.push(tableToRecordEntry.target);
            }
        }
        return mapping;
    }

    private static getIndex(headers: ITableRow, headerToFind: string) : number {
        return headers.cells.findIndex(cell => RowToRecordMapper.normalizeHeader(cell) === RowToRecordMapper.normalizeHeader(headerToFind));
    }

    private static normalizeHeader(header: string) : string {
        return header.trim().toUpperCase();
    }

    public Map(row: ITableRow): T {
        let record = {} as T;
        row.cells.forEach((cell, index) => {
            const projectionsForCell = this._indexedMapping[index];

            if (!projectionsForCell) {
                throw new Error(`No mapping found for column ${index}`);
            }

            projectionsForCell.forEach(projection => {
                const value = projection.convert
                    ? projection.convert(cell)
                    : cell as T[keyof T];
                if(projection.convert) {
                    projection.convert(cell);
                }
                record[projection.fieldName] = value;
            });
        });
        return record;
    }
}

import { CsvParserConfiguration } from './CsvParserConfiguration';
import { ITableRow, TableToRecordMapping } from './Model';
import { RowToRecordMapper } from './RowToRecordMapper';

export default class CsvTableParser {

    constructor(
        private _csvTable: string,
        private _config: CsvParserConfiguration) {
    }

    public parseToRecordArray<T>(mappings: TableToRecordMapping<T>): T[] {
        let index = 0;
        
        let headers : ITableRow = { cells: []};
        let records : T[] = []; 

        // Read Headers
        const [row, lastIndex] = this.readRow(index);
        index = lastIndex + 1;
        headers = row;

        let rowToRecordMapper = new RowToRecordMapper<T>(headers, mappings);

        // Read Data
        while(index < this._csvTable.length) {
            const [row, lastIndex] = this.readRow(index);
            const record = rowToRecordMapper.Map(row);
            records.push(record);
            index = lastIndex + 1;
        }

        return records;
    }

    private readRow(startIndex: number): [ITableRow, number] {
        const escapeChar = this._config.escapeChar;
        const cellDelimiter = this._config.cellDelimiter;
        const lineEnding = this._config.lineEnding;

        let cells: string[] = [];
        let isEscaping = false;

        let cell = '';
        for(let i=startIndex; i<this._csvTable.length; i++) {
            var char = this._csvTable[i];

            // Toggle escaping and skip double escape chars
            if (char === escapeChar) {
                if (isEscaping) {
                    // Do not toggle, if next is also escape char -> "" means one " is to add to cell
                    if (this._csvTable.length >= i + 1 && this._csvTable[i + 1] === escapeChar) {
                        cell += char;
                        i++; // Skip next char
                        continue;
                    }
                }
                isEscaping = !isEscaping;
                continue;
            }

            // Close last cell, add to row and start new cell
            if (char === cellDelimiter && !isEscaping) {
                cells.push(cell);
                cell = '';
                continue;
            }

            // If we encounter the first char of a linebreak, check if linebreak fully matches
            if (char === lineEnding[0] && !isEscaping) {
                if(lineEnding.length === 1 || (i + lineEnding.length - 1 < this._csvTable.length && this._csvTable.substring(i, i + lineEnding.length) === lineEnding)) {
                    cells.push(cell);
                    return [{ cells: cells }, i + lineEnding.length - 1];
                }
            }

            cell += char;
        }
        
        // End of file: Check if we have something in working buffer and push to cell
        if (cell.length > 0) {
            cells.push(cell);
        }
        
        return [{ cells: cells }, this._csvTable.length - 1];
    }
}
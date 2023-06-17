import { readFileSync } from 'fs';

import ConvertCell from './CsvParser/ConvertCell';
import CsvTableParser from './CsvParser/CsvTableParser';
import { TableToRecordMapping } from './CsvParser/Model';

interface IFirstRecord {
    some: string;
    test: string;
    data: number;
    yeah: boolean;
}

interface ISecondRecord {
    a: string;
    b: string;
    c: number;
    d: string;
    e: boolean;
    f: string;
    g: string;
}

const firstMapping: TableToRecordMapping<IFirstRecord> = [
    { tableColHeader: 'Some', target: { fieldName: 'some' } },
    { tableColHeader: 'test', target: { fieldName: 'test', convert: ConvertCell.toUpperCase } },
    { tableColHeader: 'data', target: { fieldName: 'data', convert: ConvertCell.toNumber } },
    { tableColHeader: 'YEAH!', target: { fieldName: 'yeah'} },
];

const secondMapping: TableToRecordMapping<ISecondRecord> = [
    { tableColHeader: 'Some', target: { fieldName: 'a' } },
    { tableColHeader: 'test', target:  [
        { fieldName: 'b', convert: ConvertCell.toLowerCase },
        { fieldName: 'g', convert: ConvertCell.toUpperCase },
    ] },
    { tableColHeader: 'data', target: [
        { fieldName: 'c', convert: ConvertCell.toNumber },
        { fieldName: 'd' },
    ]},
    { tableColHeader: 'YEAH!', target: [
        { fieldName: 'e', convert: ConvertCell.toBoolean },
        { fieldName: 'f',  convert: ConvertCell.toUpperCase },
    ]},
];

// Read file
const csvCrlfFile = readFileSync('testfile_"_;_win1252.crlf.csv', 'utf8');

const csvParser = new CsvTableParser(csvCrlfFile, {
    cellDelimiter: ';',
    lineEnding: '\r\n',
    escapeChar: '"'
});

console.log('Table:');
console.log(csvCrlfFile);

var firstRecord = csvParser.parseToRecordArray(firstMapping);
console.log('First record:');
console.log(firstRecord);

var secondRecord = csvParser.parseToRecordArray(secondMapping);
console.log('Second record:');
console.log(secondRecord);
export interface CsvParserConfiguration {
    cellDelimiter: string;
    lineEnding: string;
    escapeChar: string;
}

export const DEFAULT_CONFIG: CsvParserConfiguration = {
    cellDelimiter: ',',
    escapeChar: '"',
    lineEnding: '\n',
};

export const SEMICOLON_CONFIG: CsvParserConfiguration = {
    ...DEFAULT_CONFIG,
    cellDelimiter: ';',
};

export const TSV_CONFIG: CsvParserConfiguration = {
    ...DEFAULT_CONFIG,
    cellDelimiter: '\t',
};

export const GERMAN_EXCEL_CONFIG: CsvParserConfiguration = {
    ...DEFAULT_CONFIG,
    cellDelimiter: ',',
    escapeChar: '"',
    lineEnding: '\r\n',
};

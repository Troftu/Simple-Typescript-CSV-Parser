export default class ConvertCell {
    public static toNumber(cell: string): number {
        return parseFloat(cell);
    }

    public static toBoolean(cell: string): boolean {
        return cell.toLowerCase() === 'true';
    }

    public static toTrimmedString(cell: string): string {
        return cell.trim();
    }

    public static toLowerCase(value: string): string {
        return value.toLowerCase();
    }

    public static toUpperCase(value: string): string {
        return value.toUpperCase();
    }

    public static toDate(value: string): Date {
        return new Date(value);
    }
}
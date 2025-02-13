export function truncateString(str: string, maxLength: number = 1024): string {
    return str.length > maxLength ? `${str.slice(0, maxLength - 3)}...` : str;
}

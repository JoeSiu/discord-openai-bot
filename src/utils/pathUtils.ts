import * as path from "path";

export function isValidPathString(input: string): boolean {
    return input.includes(path.sep) || input.includes("/");
}

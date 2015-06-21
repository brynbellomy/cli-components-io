

declare module 'cli-components-io' {

    export class Logger {
        folderDepth: number;
        tab: string;
        prefix: string;
        outStream: NodeJS.WritableStream;

        constructor(prefixString?: string, tabString?: string);
        prettyPrint(obj: any, label?: string): void;
        prettyFormat(obj: any): string;
        print(...str: string[]): void;
        println(...str: string[]): void;
        dieError(err);
        indent(): void;
        unindent(): void;
    }

    export var settings = {
        currentProcessLogger: Logger;
    };

    export function logger(): Logger;
    export function prettyPrint(obj: any, label?: string);
    export function prettyFormat(obj: any);
    export function print(str: string);
    export function println(str: string);
    export function dieError(err: any);

}
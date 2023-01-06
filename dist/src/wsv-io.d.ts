import { ReliableTxtEncoding } from "@stenway/reliabletxt";
import { WsvDocument, WsvLine } from "@stenway/wsv";
export declare abstract class WsvFile {
    static loadSync(filePath: string, preserveWhitespacesAndComments?: boolean): WsvDocument;
    static saveSync(document: WsvDocument, filePath: string, preserveWhitespacesAndComments?: boolean): void;
    static readJaggedArraySync(filePath: string): (string | null)[][];
    static writeJaggedArraySync(jaggedArray: (string | null)[][], filePath: string, encoding?: ReliableTxtEncoding): void;
    static appendSync(document: WsvDocument, filePath: string, preserveWhitespacesAndComments?: boolean): void;
    static appendJaggedArraySync(jaggedArray: (string | null)[][], filePath: string, createWithEncoding?: ReliableTxtEncoding): void;
    static appendLineSync(line: WsvLine, filePath: string, createWithEncoding?: ReliableTxtEncoding, preserveWhitespacesAndComments?: boolean): void;
    static appendLineValuesSync(values: (string | null)[], filePath: string, createWithEncoding?: ReliableTxtEncoding): void;
}
export declare class SyncWsvStreamReader {
    private reader;
    private preserveWhitespacesAndComments;
    get encoding(): ReliableTxtEncoding;
    get isClosed(): boolean;
    constructor(filePath: string, preserveWhitespacesAndComments?: boolean, chunkSize?: number);
    readLine(): WsvLine | null;
    readLineValues(): (string | null)[] | null;
    close(): void;
}
export declare class SyncWsvStreamWriter {
    private writer;
    private preserveWhitespacesAndComments;
    get encoding(): ReliableTxtEncoding;
    get isClosed(): boolean;
    constructor(filePath: string, createWithEncoding?: ReliableTxtEncoding, append?: boolean, preserveWhitespacesAndComments?: boolean);
    writeLineValues(values: (string | null)[]): void;
    writeLine(line: WsvLine): void;
    writeLines(lines: WsvLine[]): void;
    writeDocument(document: WsvDocument): void;
    close(): void;
}
//# sourceMappingURL=wsv-io.d.ts.map
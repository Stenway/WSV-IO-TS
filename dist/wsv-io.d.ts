import { ReliableTxtEncoding } from "@stenway/reliabletxt";
import { WsvDocument, WsvLine } from "@stenway/wsv";
export declare abstract class WsvFile {
    static loadSync(filePath: string, preserveWhitespacesAndComments?: boolean): WsvDocument;
    static saveSync(document: WsvDocument, filePath: string, preserveWhitespacesAndComments?: boolean): void;
    static appendSync(document: WsvDocument, filePath: string, preserveWhitespacesAndComments?: boolean): void;
}
export declare class SyncWsvStreamReader {
    private reader;
    private preserveWhitespacesAndComments;
    get encoding(): ReliableTxtEncoding;
    get isClosed(): boolean;
    constructor(filePath: string, preserveWhitespacesAndComments?: boolean, chunkSize?: number);
    readLine(): WsvLine | null;
    close(): void;
}
export declare class SyncWsvStreamWriter {
    private writer;
    private preserveWhitespacesAndComments;
    get encoding(): ReliableTxtEncoding;
    constructor(filePath: string, createWithEncoding?: ReliableTxtEncoding, append?: boolean, preserveWhitespacesAndComments?: boolean);
    writeLine(line: WsvLine): void;
    writeDocument(document: WsvDocument): void;
    close(): void;
}

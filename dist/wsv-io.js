"use strict";
/* (C) Stefan John / Stenway / WhitespaceSV.com / 2022 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncWsvStreamWriter = exports.SyncWsvStreamReader = exports.WsvFile = void 0;
const reliabletxt_1 = require("@stenway/reliabletxt");
const reliabletxt_io_1 = require("@stenway/reliabletxt-io");
const wsv_1 = require("@stenway/wsv");
// ----------------------------------------------------------------------
class WsvFile {
    static loadSync(filePath, preserveWhitespacesAndComments = true) {
        let reliableTxtDocument = reliabletxt_io_1.ReliableTxtFile.loadSync(filePath);
        let wsvDocument = wsv_1.WsvDocument.parse(reliableTxtDocument.text, preserveWhitespacesAndComments);
        wsvDocument.encoding = reliableTxtDocument.encoding;
        return wsvDocument;
    }
    static saveSync(document, filePath, preserveWhitespacesAndComments = true) {
        let text = document.toString(preserveWhitespacesAndComments);
        reliabletxt_io_1.ReliableTxtFile.writeAllTextSync(text, filePath, document.encoding);
    }
    static appendSync(document, filePath, preserveWhitespacesAndComments = true) {
        let text = document.toString(preserveWhitespacesAndComments);
        let lines = reliabletxt_1.ReliableTxtLines.split(text);
        reliabletxt_io_1.ReliableTxtFile.appendAllLinesSync(lines, filePath, document.encoding);
    }
}
exports.WsvFile = WsvFile;
// ----------------------------------------------------------------------
class SyncWsvStreamReader {
    constructor(filePath, preserveWhitespacesAndComments = true, chunkSize = 4096) {
        this.preserveWhitespacesAndComments = preserveWhitespacesAndComments;
        this.reader = new reliabletxt_io_1.SyncReliableTxtStreamReader(filePath, chunkSize);
    }
    get encoding() {
        return this.reader.encoding;
    }
    get isClosed() {
        return this.reader.isClosed;
    }
    readLine() {
        let lineStr = this.reader.readLine();
        if (lineStr === null) {
            return null;
        }
        return wsv_1.WsvLine.parse(lineStr, this.preserveWhitespacesAndComments);
    }
    close() {
        this.reader.close();
    }
}
exports.SyncWsvStreamReader = SyncWsvStreamReader;
// ----------------------------------------------------------------------
class SyncWsvStreamWriter {
    constructor(filePath, createWithEncoding = reliabletxt_1.ReliableTxtEncoding.Utf8, append = false, preserveWhitespacesAndComments = true) {
        this.preserveWhitespacesAndComments = preserveWhitespacesAndComments;
        this.writer = new reliabletxt_io_1.SyncReliableTxtStreamWriter(filePath, createWithEncoding, append);
    }
    get encoding() {
        return this.writer.encoding;
    }
    writeLine(line) {
        let lineStr = line.toString(this.preserveWhitespacesAndComments);
        this.writer.writeLine(lineStr);
    }
    writeDocument(document) {
        let content = document.toString(this.preserveWhitespacesAndComments);
        this.writer.writeLine(content);
    }
    close() {
        this.writer.close();
    }
}
exports.SyncWsvStreamWriter = SyncWsvStreamWriter;

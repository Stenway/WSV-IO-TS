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
        const reliableTxtDocument = reliabletxt_io_1.ReliableTxtFile.loadSync(filePath);
        const wsvDocument = wsv_1.WsvDocument.parse(reliableTxtDocument.text, preserveWhitespacesAndComments);
        wsvDocument.encoding = reliableTxtDocument.encoding;
        return wsvDocument;
    }
    static saveSync(document, filePath, preserveWhitespacesAndComments = true) {
        const text = document.toString(preserveWhitespacesAndComments);
        reliabletxt_io_1.ReliableTxtFile.writeAllTextSync(text, filePath, document.encoding);
    }
    static readJaggedArraySync(filePath) {
        const document = WsvFile.loadSync(filePath, false);
        return document.toJaggedArray();
    }
    static writeJaggedArraySync(jaggedArray, filePath, encoding = reliabletxt_1.ReliableTxtEncoding.Utf8) {
        const document = wsv_1.WsvDocument.fromJaggedArray(jaggedArray, encoding);
        WsvFile.saveSync(document, filePath, false);
    }
    static appendSync(document, filePath, preserveWhitespacesAndComments = true) {
        const text = document.toString(preserveWhitespacesAndComments);
        const lines = reliabletxt_1.ReliableTxtLines.split(text);
        reliabletxt_io_1.ReliableTxtFile.appendAllLinesSync(lines, filePath, document.encoding);
    }
    static appendJaggedArraySync(jaggedArray, filePath, createWithEncoding = reliabletxt_1.ReliableTxtEncoding.Utf8) {
        const document = wsv_1.WsvDocument.fromJaggedArray(jaggedArray, createWithEncoding);
        WsvFile.appendSync(document, filePath, false);
    }
    static appendLineSync(line, filePath, createWithEncoding = reliabletxt_1.ReliableTxtEncoding.Utf8, preserveWhitespacesAndComments = true) {
        reliabletxt_io_1.ReliableTxtFile.appendAllLinesSync([line.toString(preserveWhitespacesAndComments)], filePath, createWithEncoding);
    }
    static appendLineValuesSync(values, filePath, createWithEncoding = reliabletxt_1.ReliableTxtEncoding.Utf8) {
        reliabletxt_io_1.ReliableTxtFile.appendAllLinesSync([wsv_1.WsvLine.serialize(values)], filePath, createWithEncoding);
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
        const lineStr = this.reader.readLine();
        if (lineStr === null) {
            return null;
        }
        return wsv_1.WsvLine.parse(lineStr, this.preserveWhitespacesAndComments);
    }
    readLineValues() {
        const lineStr = this.reader.readLine();
        if (lineStr === null) {
            return null;
        }
        return wsv_1.WsvLine.parseAsArray(lineStr);
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
    get isClosed() {
        return this.writer.isClosed;
    }
    writeLineValues(values) {
        const lineStr = wsv_1.WsvLine.serialize(values);
        this.writer.writeLine(lineStr);
    }
    writeLine(line) {
        const lineStr = line.toString(this.preserveWhitespacesAndComments);
        this.writer.writeLine(lineStr);
    }
    writeLines(lines) {
        this.writeDocument(new wsv_1.WsvDocument(lines));
    }
    writeDocument(document) {
        const content = document.toString(this.preserveWhitespacesAndComments);
        this.writer.writeLine(content);
    }
    close() {
        this.writer.close();
    }
}
exports.SyncWsvStreamWriter = SyncWsvStreamWriter;
//# sourceMappingURL=wsv-io.js.map
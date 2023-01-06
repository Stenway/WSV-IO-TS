"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const reliabletxt_1 = require("@stenway/reliabletxt");
const wsv_1 = require("@stenway/wsv");
const src_1 = require("../src");
const fs = __importStar(require("fs"));
const reliabletxt_io_1 = require("@stenway/reliabletxt-io");
function getFilePath(name) {
    return "test_files/" + name;
}
const testFilePath = getFilePath("Test.wsv");
function writeBytes(bytes, filePath) {
    fs.writeFileSync(filePath, bytes);
}
function deleteFile(filePath) {
    try {
        fs.unlinkSync(filePath);
    }
    catch (_a) {
        return false;
    }
    return true;
}
// ----------------------------------------------------------------------
describe("WsvFile.saveSync + loadSync", () => {
    test.each([
        [reliabletxt_1.ReliableTxtEncoding.Utf8],
        [reliabletxt_1.ReliableTxtEncoding.Utf16],
        [reliabletxt_1.ReliableTxtEncoding.Utf16Reverse],
        [reliabletxt_1.ReliableTxtEncoding.Utf32],
    ])("Given %p", (encoding) => {
        const document = wsv_1.WsvDocument.parse("a b #comment\n  c  ");
        document.encoding = encoding;
        src_1.WsvFile.saveSync(document, testFilePath);
        let loadedDocument = src_1.WsvFile.loadSync(testFilePath);
        expect(loadedDocument.toString()).toEqual(document.toString());
        expect(loadedDocument.encoding).toEqual(document.encoding);
        loadedDocument = src_1.WsvFile.loadSync(testFilePath, false);
        expect(loadedDocument.toString()).toEqual("a b\nc");
        expect(loadedDocument.encoding).toEqual(document.encoding);
        src_1.WsvFile.saveSync(document, testFilePath, false);
        loadedDocument = src_1.WsvFile.loadSync(testFilePath, true);
        expect(loadedDocument.toString()).toEqual("a b\nc");
        expect(loadedDocument.encoding).toEqual(document.encoding);
    });
    test("Throws", () => {
        writeBytes(new Uint8Array([]), testFilePath);
        expect(() => src_1.WsvFile.loadSync(testFilePath)).toThrowError(reliabletxt_1.NoReliableTxtPreambleError);
    });
});
describe("WsvFile.appendSync", () => {
    test.each([
        ["", reliabletxt_1.ReliableTxtEncoding.Utf8, "", reliabletxt_1.ReliableTxtEncoding.Utf8, ""],
        ["Test1", reliabletxt_1.ReliableTxtEncoding.Utf8, "", reliabletxt_1.ReliableTxtEncoding.Utf8, "Test1\n"],
        ["", reliabletxt_1.ReliableTxtEncoding.Utf8, "Test2", reliabletxt_1.ReliableTxtEncoding.Utf8, "Test2"],
        ["Test1", reliabletxt_1.ReliableTxtEncoding.Utf8, "Test2", reliabletxt_1.ReliableTxtEncoding.Utf8, "Test1\nTest2"],
        ["Test1", reliabletxt_1.ReliableTxtEncoding.Utf8, "Test2", reliabletxt_1.ReliableTxtEncoding.Utf16, "Test1\nTest2"],
        ["Test1", reliabletxt_1.ReliableTxtEncoding.Utf8, "Test2", reliabletxt_1.ReliableTxtEncoding.Utf16Reverse, "Test1\nTest2"],
        ["Test1", reliabletxt_1.ReliableTxtEncoding.Utf8, "Test2", reliabletxt_1.ReliableTxtEncoding.Utf32, "Test1\nTest2"],
        ["Test1", reliabletxt_1.ReliableTxtEncoding.Utf16, "Test2", reliabletxt_1.ReliableTxtEncoding.Utf8, "Test1\nTest2"],
        ["Test1", reliabletxt_1.ReliableTxtEncoding.Utf16, "Test2", reliabletxt_1.ReliableTxtEncoding.Utf16, "Test1\nTest2"],
        ["Test1", reliabletxt_1.ReliableTxtEncoding.Utf16, "Test2", reliabletxt_1.ReliableTxtEncoding.Utf16Reverse, "Test1\nTest2"],
        ["Test1", reliabletxt_1.ReliableTxtEncoding.Utf16, "Test2", reliabletxt_1.ReliableTxtEncoding.Utf32, "Test1\nTest2"],
        ["Test1", reliabletxt_1.ReliableTxtEncoding.Utf16Reverse, "Test2", reliabletxt_1.ReliableTxtEncoding.Utf8, "Test1\nTest2"],
        ["Test1", reliabletxt_1.ReliableTxtEncoding.Utf16Reverse, "Test2", reliabletxt_1.ReliableTxtEncoding.Utf16, "Test1\nTest2"],
        ["Test1", reliabletxt_1.ReliableTxtEncoding.Utf16Reverse, "Test2", reliabletxt_1.ReliableTxtEncoding.Utf16Reverse, "Test1\nTest2"],
        ["Test1", reliabletxt_1.ReliableTxtEncoding.Utf16Reverse, "Test2", reliabletxt_1.ReliableTxtEncoding.Utf32, "Test1\nTest2"],
        ["Test1", reliabletxt_1.ReliableTxtEncoding.Utf32, "Test2", reliabletxt_1.ReliableTxtEncoding.Utf8, "Test1\nTest2"],
        ["Test1", reliabletxt_1.ReliableTxtEncoding.Utf32, "Test2", reliabletxt_1.ReliableTxtEncoding.Utf16, "Test1\nTest2"],
        ["Test1", reliabletxt_1.ReliableTxtEncoding.Utf32, "Test2", reliabletxt_1.ReliableTxtEncoding.Utf16Reverse, "Test1\nTest2"],
        ["Test1", reliabletxt_1.ReliableTxtEncoding.Utf32, "Test2", reliabletxt_1.ReliableTxtEncoding.Utf32, "Test1\nTest2"],
        ["Test1", reliabletxt_1.ReliableTxtEncoding.Utf8, "\uFEFFTest2", reliabletxt_1.ReliableTxtEncoding.Utf8, "Test1\n\uFEFFTest2"],
    ])("Given %p, %p, %p and %p returns %p", (input1, encoding1, input2, encoding2, output) => {
        deleteFile(testFilePath);
        const document1 = wsv_1.WsvDocument.parse(input1);
        document1.encoding = encoding1;
        src_1.WsvFile.appendSync(document1, testFilePath);
        let loaded = reliabletxt_io_1.ReliableTxtFile.loadSync(testFilePath);
        expect(loaded.text).toEqual(input1);
        expect(loaded.encoding).toEqual(encoding1);
        const document2 = wsv_1.WsvDocument.parse(input2);
        document2.encoding = encoding2;
        src_1.WsvFile.appendSync(document2, testFilePath);
        loaded = reliabletxt_io_1.ReliableTxtFile.loadSync(testFilePath);
        expect(loaded.text).toEqual(output);
        expect(loaded.encoding).toEqual(encoding1);
    });
});
describe("WsvFile.writeJaggedArraySync + readJaggedArraySync", () => {
    test.each([
        [reliabletxt_1.ReliableTxtEncoding.Utf8],
        [reliabletxt_1.ReliableTxtEncoding.Utf16],
        [reliabletxt_1.ReliableTxtEncoding.Utf16Reverse],
        [reliabletxt_1.ReliableTxtEncoding.Utf32],
    ])("Given %p", (encoding) => {
        const jaggedArray = [["a", "b"], ["c"]];
        src_1.WsvFile.writeJaggedArraySync(jaggedArray, testFilePath, encoding);
        expect(src_1.WsvFile.readJaggedArraySync(testFilePath)).toEqual(jaggedArray);
        expect(src_1.WsvFile.loadSync(testFilePath).toString()).toEqual("a b\nc");
    });
    test("Throws", () => {
        writeBytes(new Uint8Array([]), testFilePath);
        expect(() => src_1.WsvFile.readJaggedArraySync(testFilePath)).toThrowError(reliabletxt_1.NoReliableTxtPreambleError);
    });
    test("Without encoding", () => {
        const jaggedArray = [["a", "b"], ["c"]];
        src_1.WsvFile.writeJaggedArraySync(jaggedArray, testFilePath);
        expect(src_1.WsvFile.loadSync(testFilePath).encoding).toEqual(reliabletxt_1.ReliableTxtEncoding.Utf8);
    });
});
describe("WsvFile.appendJaggedArraySync", () => {
    test.each([
        [reliabletxt_1.ReliableTxtEncoding.Utf8, reliabletxt_1.ReliableTxtEncoding.Utf16],
        [reliabletxt_1.ReliableTxtEncoding.Utf16, reliabletxt_1.ReliableTxtEncoding.Utf8],
        [reliabletxt_1.ReliableTxtEncoding.Utf16Reverse, reliabletxt_1.ReliableTxtEncoding.Utf8],
        [reliabletxt_1.ReliableTxtEncoding.Utf32, reliabletxt_1.ReliableTxtEncoding.Utf8],
    ])("Given %p", (encoding, encoding2) => {
        const jaggedArray = [["a", "b"], ["c"]];
        deleteFile(testFilePath);
        src_1.WsvFile.appendJaggedArraySync(jaggedArray, testFilePath, encoding);
        let loadedDocument = src_1.WsvFile.loadSync(testFilePath);
        expect(loadedDocument.toString()).toEqual("a b\nc");
        expect(loadedDocument.encoding).toEqual(encoding);
        src_1.WsvFile.appendJaggedArraySync(jaggedArray, testFilePath, encoding2);
        loadedDocument = src_1.WsvFile.loadSync(testFilePath);
        expect(loadedDocument.toString()).toEqual("a b\nc\na b\nc");
        expect(loadedDocument.encoding).toEqual(encoding);
    });
    test("Without encoding", () => {
        const jaggedArray = [["a", "b"], ["c"]];
        deleteFile(testFilePath);
        src_1.WsvFile.appendJaggedArraySync(jaggedArray, testFilePath);
        expect(src_1.WsvFile.loadSync(testFilePath).encoding).toEqual(reliabletxt_1.ReliableTxtEncoding.Utf8);
    });
});
describe("WsvFile.appendLineSync", () => {
    test.each([
        [reliabletxt_1.ReliableTxtEncoding.Utf8, reliabletxt_1.ReliableTxtEncoding.Utf16],
        [reliabletxt_1.ReliableTxtEncoding.Utf16, reliabletxt_1.ReliableTxtEncoding.Utf8],
        [reliabletxt_1.ReliableTxtEncoding.Utf16Reverse, reliabletxt_1.ReliableTxtEncoding.Utf8],
        [reliabletxt_1.ReliableTxtEncoding.Utf32, reliabletxt_1.ReliableTxtEncoding.Utf8],
    ])("Given %p", (encoding, encoding2) => {
        deleteFile(testFilePath);
        src_1.WsvFile.appendLineSync(wsv_1.WsvLine.parse("a  b  #c"), testFilePath, encoding);
        let loadedDocument = src_1.WsvFile.loadSync(testFilePath);
        expect(loadedDocument.toString()).toEqual("a  b  #c");
        expect(loadedDocument.encoding).toEqual(encoding);
        src_1.WsvFile.appendLineSync(wsv_1.WsvLine.parse("a  b  #c"), testFilePath, encoding2, false);
        loadedDocument = src_1.WsvFile.loadSync(testFilePath);
        expect(loadedDocument.toString()).toEqual("a  b  #c\na b");
        expect(loadedDocument.encoding).toEqual(encoding);
    });
    test("Without encoding", () => {
        deleteFile(testFilePath);
        src_1.WsvFile.appendLineSync(wsv_1.WsvLine.parse("a b #c"), testFilePath);
        const loadedDocument = src_1.WsvFile.loadSync(testFilePath);
        expect(loadedDocument.toString()).toEqual("a b #c");
        expect(loadedDocument.encoding).toEqual(reliabletxt_1.ReliableTxtEncoding.Utf8);
    });
});
describe("WsvFile.appendLineValuesSync", () => {
    test.each([
        [reliabletxt_1.ReliableTxtEncoding.Utf8, reliabletxt_1.ReliableTxtEncoding.Utf16],
        [reliabletxt_1.ReliableTxtEncoding.Utf16, reliabletxt_1.ReliableTxtEncoding.Utf8],
        [reliabletxt_1.ReliableTxtEncoding.Utf16Reverse, reliabletxt_1.ReliableTxtEncoding.Utf8],
        [reliabletxt_1.ReliableTxtEncoding.Utf32, reliabletxt_1.ReliableTxtEncoding.Utf8],
    ])("Given %p", (encoding, encoding2) => {
        deleteFile(testFilePath);
        src_1.WsvFile.appendLineValuesSync(["a", "b"], testFilePath, encoding);
        let loadedDocument = src_1.WsvFile.loadSync(testFilePath);
        expect(loadedDocument.toString()).toEqual("a b");
        expect(loadedDocument.encoding).toEqual(encoding);
        src_1.WsvFile.appendLineValuesSync(["c"], testFilePath, encoding2);
        loadedDocument = src_1.WsvFile.loadSync(testFilePath);
        expect(loadedDocument.toString()).toEqual("a b\nc");
        expect(loadedDocument.encoding).toEqual(encoding);
    });
    test("Without encoding", () => {
        deleteFile(testFilePath);
        src_1.WsvFile.appendLineValuesSync(["a", "b"], testFilePath);
        const loadedDocument = src_1.WsvFile.loadSync(testFilePath);
        expect(loadedDocument.toString()).toEqual("a b");
        expect(loadedDocument.encoding).toEqual(reliabletxt_1.ReliableTxtEncoding.Utf8);
    });
});
// ----------------------------------------------------------------------
describe("SyncWsvStreamWriter Constructor", () => {
    test.each([
        [reliabletxt_1.ReliableTxtEncoding.Utf8],
        [reliabletxt_1.ReliableTxtEncoding.Utf16],
        [reliabletxt_1.ReliableTxtEncoding.Utf16Reverse],
        [reliabletxt_1.ReliableTxtEncoding.Utf32],
    ])("Given %p", (encoding) => {
        const writer = new src_1.SyncWsvStreamWriter(testFilePath, encoding);
        writer.close();
        const loaded = reliabletxt_io_1.ReliableTxtFile.loadSync(testFilePath);
        expect(loaded.text).toEqual("");
        expect(loaded.encoding).toEqual(encoding);
    });
    test("Without encoding", () => {
        const writer = new src_1.SyncWsvStreamWriter(testFilePath);
        writer.close();
        const loaded = reliabletxt_io_1.ReliableTxtFile.loadSync(testFilePath);
        expect(loaded.text).toEqual("");
        expect(loaded.encoding).toEqual(reliabletxt_1.ReliableTxtEncoding.Utf8);
    });
});
describe("SyncWsvStreamWriter Constructor Append", () => {
    test.each([
        [reliabletxt_1.ReliableTxtEncoding.Utf8, reliabletxt_1.ReliableTxtEncoding.Utf8],
        [reliabletxt_1.ReliableTxtEncoding.Utf8, reliabletxt_1.ReliableTxtEncoding.Utf16],
        [reliabletxt_1.ReliableTxtEncoding.Utf8, reliabletxt_1.ReliableTxtEncoding.Utf16Reverse],
        [reliabletxt_1.ReliableTxtEncoding.Utf8, reliabletxt_1.ReliableTxtEncoding.Utf32],
    ])("Given %p", (encoding1, encoding2) => {
        reliabletxt_io_1.ReliableTxtFile.writeAllTextSync("Test1", testFilePath, encoding1);
        const writer = new src_1.SyncWsvStreamWriter(testFilePath, encoding2, true);
        expect(writer.encoding).toEqual(encoding1);
        writer.writeLine(wsv_1.WsvLine.parse("Test2"));
        writer.close();
        const loaded = reliabletxt_io_1.ReliableTxtFile.loadSync(testFilePath);
        expect(loaded.text).toEqual("Test1\nTest2");
        expect(loaded.encoding).toEqual(encoding1);
    });
});
test("SyncWsvStreamWriter.isClosed", () => {
    const writer = new src_1.SyncWsvStreamWriter(testFilePath);
    expect(writer.isClosed).toEqual(false);
    writer.close();
    expect(writer.isClosed).toEqual(true);
});
test("SyncWsvStreamWriter.writeDocument", () => {
    const writer = new src_1.SyncWsvStreamWriter(testFilePath);
    writer.writeDocument(wsv_1.WsvDocument.parse("a  b#\nc"));
    writer.close();
    expect(reliabletxt_io_1.ReliableTxtFile.readAllTextSync(testFilePath)).toEqual("a  b#\nc");
});
test("SyncWsvStreamWriter.writeLines", () => {
    const writer = new src_1.SyncWsvStreamWriter(testFilePath);
    writer.writeLines([wsv_1.WsvLine.parse("a  b"), wsv_1.WsvLine.parse("c")]);
    writer.close();
    expect(reliabletxt_io_1.ReliableTxtFile.readAllTextSync(testFilePath)).toEqual("a  b\nc");
});
test("SyncWsvStreamWriter.writeLineValues", () => {
    const writer = new src_1.SyncWsvStreamWriter(testFilePath);
    writer.writeLineValues(["a", "b"]);
    writer.writeLineValues(["c"]);
    writer.close();
    expect(reliabletxt_io_1.ReliableTxtFile.readAllTextSync(testFilePath)).toEqual("a b\nc");
});
// ----------------------------------------------------------------------
describe("SyncWsvStreamReader Constructor", () => {
    test.each([
        [reliabletxt_1.ReliableTxtEncoding.Utf8],
    ])("Given %p", (encoding) => {
        reliabletxt_io_1.ReliableTxtFile.writeAllTextSync("Test", testFilePath, encoding);
        const reader = new src_1.SyncWsvStreamReader(testFilePath);
        expect(reader.encoding).toEqual(encoding);
        reader.close();
    });
    test.each([
        [reliabletxt_1.ReliableTxtEncoding.Utf16],
        [reliabletxt_1.ReliableTxtEncoding.Utf16Reverse],
        [reliabletxt_1.ReliableTxtEncoding.Utf32],
    ])("Given %p throws", (encoding) => {
        reliabletxt_io_1.ReliableTxtFile.writeAllTextSync("Test", testFilePath, encoding);
        expect(() => new src_1.SyncWsvStreamReader(testFilePath)).toThrowError();
    });
    test("Chunk size", () => {
        reliabletxt_io_1.ReliableTxtFile.writeAllTextSync("Test", testFilePath, reliabletxt_1.ReliableTxtEncoding.Utf8);
        expect(() => new src_1.SyncWsvStreamReader(testFilePath, true, 1)).toThrowError("Chunk size too small");
    });
});
test("SyncWsvStreamReader.isClosed", () => {
    reliabletxt_io_1.ReliableTxtFile.writeAllTextSync("Test", testFilePath, reliabletxt_1.ReliableTxtEncoding.Utf8);
    const writer = new src_1.SyncWsvStreamReader(testFilePath);
    expect(writer.isClosed).toEqual(false);
    writer.close();
    expect(writer.isClosed).toEqual(true);
});
describe("SyncWsvStreamReader.readLine", () => {
    test("Null", () => {
        reliabletxt_io_1.ReliableTxtFile.writeAllTextSync("Line1\nLine2", testFilePath);
        const reader = new src_1.SyncWsvStreamReader(testFilePath);
        const line1 = reader.readLine();
        if (line1 === null) {
            throw Error();
        }
        expect(line1.toString()).toEqual("Line1");
        const line2 = reader.readLine();
        if (line2 === null) {
            throw Error();
        }
        expect(line2.toString()).toEqual("Line2");
        expect(reader.readLine()).toEqual(null);
        reader.close();
    });
    test("Closed", () => {
        reliabletxt_io_1.ReliableTxtFile.writeAllTextSync("Line1\nLine2", testFilePath);
        const reader = new src_1.SyncWsvStreamReader(testFilePath);
        reader.close();
        expect(() => reader.readLine()).toThrowError();
    });
});
test("SyncWsvStreamReader.readLineValues", () => {
    reliabletxt_io_1.ReliableTxtFile.writeAllTextSync("a  b #c", testFilePath);
    const reader = new src_1.SyncWsvStreamReader(testFilePath);
    const values1 = reader.readLineValues();
    if (values1 === null) {
        throw Error();
    }
    expect(values1).toEqual(["a", "b"]);
    expect(reader.readLineValues()).toEqual(null);
    reader.close();
});
//# sourceMappingURL=wsv-io.test.js.map
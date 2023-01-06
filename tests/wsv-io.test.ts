import { NoReliableTxtPreambleError, ReliableTxtEncoding } from "@stenway/reliabletxt"
import { WsvDocument, WsvLine } from "@stenway/wsv"
import { SyncWsvStreamReader, SyncWsvStreamWriter, WsvFile } from "../src"
import * as fs from 'fs'
import { ReliableTxtFile } from "@stenway/reliabletxt-io"

function getFilePath(name: string): string {
	return "test_files/"+name
}

const testFilePath: string = getFilePath("Test.wsv")

function writeBytes(bytes: Uint8Array, filePath: string) {
	fs.writeFileSync(filePath, bytes)
}

function deleteFile(filePath: string): boolean {
	try {
		fs.unlinkSync(filePath)
	} catch {
		return false
	}
	return true
}

// ----------------------------------------------------------------------

describe("WsvFile.saveSync + loadSync", () => {
	test.each([
		[ReliableTxtEncoding.Utf8],
		[ReliableTxtEncoding.Utf16],
		[ReliableTxtEncoding.Utf16Reverse],
		[ReliableTxtEncoding.Utf32],
	])(
		"Given %p",
		(encoding) => {
			const document = WsvDocument.parse("a b #comment\n  c  ")
			document.encoding = encoding
			WsvFile.saveSync(document, testFilePath)
			let loadedDocument = WsvFile.loadSync(testFilePath)
			expect(loadedDocument.toString()).toEqual(document.toString())
			expect(loadedDocument.encoding).toEqual(document.encoding)

			loadedDocument = WsvFile.loadSync(testFilePath, false)
			expect(loadedDocument.toString()).toEqual("a b\nc")
			expect(loadedDocument.encoding).toEqual(document.encoding)

			WsvFile.saveSync(document, testFilePath, false)
			loadedDocument = WsvFile.loadSync(testFilePath, true)
			expect(loadedDocument.toString()).toEqual("a b\nc")
			expect(loadedDocument.encoding).toEqual(document.encoding)
		}
	)

	test("Throws", () => {
		writeBytes(new Uint8Array([]), testFilePath)
		expect(() => WsvFile.loadSync(testFilePath)).toThrowError(NoReliableTxtPreambleError)
	})
})

describe("WsvFile.appendSync", () => {
	test.each([
		["", ReliableTxtEncoding.Utf8, "", ReliableTxtEncoding.Utf8, ""],
		["Test1", ReliableTxtEncoding.Utf8, "", ReliableTxtEncoding.Utf8, "Test1\n"],
		["", ReliableTxtEncoding.Utf8, "Test2", ReliableTxtEncoding.Utf8, "Test2"],
		["Test1", ReliableTxtEncoding.Utf8, "Test2", ReliableTxtEncoding.Utf8, "Test1\nTest2"],
		["Test1", ReliableTxtEncoding.Utf8, "Test2", ReliableTxtEncoding.Utf16, "Test1\nTest2"],
		["Test1", ReliableTxtEncoding.Utf8, "Test2", ReliableTxtEncoding.Utf16Reverse, "Test1\nTest2"],
		["Test1", ReliableTxtEncoding.Utf8, "Test2", ReliableTxtEncoding.Utf32, "Test1\nTest2"],
		["Test1", ReliableTxtEncoding.Utf16, "Test2", ReliableTxtEncoding.Utf8, "Test1\nTest2"],
		["Test1", ReliableTxtEncoding.Utf16, "Test2", ReliableTxtEncoding.Utf16, "Test1\nTest2"],
		["Test1", ReliableTxtEncoding.Utf16, "Test2", ReliableTxtEncoding.Utf16Reverse, "Test1\nTest2"],
		["Test1", ReliableTxtEncoding.Utf16, "Test2", ReliableTxtEncoding.Utf32, "Test1\nTest2"],
		["Test1", ReliableTxtEncoding.Utf16Reverse, "Test2", ReliableTxtEncoding.Utf8, "Test1\nTest2"],
		["Test1", ReliableTxtEncoding.Utf16Reverse, "Test2", ReliableTxtEncoding.Utf16, "Test1\nTest2"],
		["Test1", ReliableTxtEncoding.Utf16Reverse, "Test2", ReliableTxtEncoding.Utf16Reverse, "Test1\nTest2"],
		["Test1", ReliableTxtEncoding.Utf16Reverse, "Test2", ReliableTxtEncoding.Utf32, "Test1\nTest2"],
		["Test1", ReliableTxtEncoding.Utf32, "Test2", ReliableTxtEncoding.Utf8, "Test1\nTest2"],
		["Test1", ReliableTxtEncoding.Utf32, "Test2", ReliableTxtEncoding.Utf16, "Test1\nTest2"],
		["Test1", ReliableTxtEncoding.Utf32, "Test2", ReliableTxtEncoding.Utf16Reverse, "Test1\nTest2"],
		["Test1", ReliableTxtEncoding.Utf32, "Test2", ReliableTxtEncoding.Utf32, "Test1\nTest2"],
		["Test1", ReliableTxtEncoding.Utf8, "\uFEFFTest2", ReliableTxtEncoding.Utf8, "Test1\n\uFEFFTest2"],
	])(
		"Given %p, %p, %p and %p returns %p",
		(input1, encoding1, input2, encoding2, output) => {
			deleteFile(testFilePath)
			const document1 = WsvDocument.parse(input1)
			document1.encoding = encoding1
			WsvFile.appendSync(document1, testFilePath)
			let loaded = ReliableTxtFile.loadSync(testFilePath)
			expect(loaded.text).toEqual(input1)
			expect(loaded.encoding).toEqual(encoding1)

			const document2 = WsvDocument.parse(input2)
			document2.encoding = encoding2
			WsvFile.appendSync(document2, testFilePath)
			loaded = ReliableTxtFile.loadSync(testFilePath)
			expect(loaded.text).toEqual(output)
			expect(loaded.encoding).toEqual(encoding1)
		}
	)
})

describe("WsvFile.writeJaggedArraySync + readJaggedArraySync", () => {
	test.each([
		[ReliableTxtEncoding.Utf8],
		[ReliableTxtEncoding.Utf16],
		[ReliableTxtEncoding.Utf16Reverse],
		[ReliableTxtEncoding.Utf32],
	])(
		"Given %p",
		(encoding) => {
			const jaggedArray = [["a", "b"], ["c"]]
			WsvFile.writeJaggedArraySync(jaggedArray, testFilePath, encoding)
			expect(WsvFile.readJaggedArraySync(testFilePath)).toEqual(jaggedArray)
			expect(WsvFile.loadSync(testFilePath).toString()).toEqual("a b\nc")
		}
	)

	test("Throws", () => {
		writeBytes(new Uint8Array([]), testFilePath)
		expect(() => WsvFile.readJaggedArraySync(testFilePath)).toThrowError(NoReliableTxtPreambleError)
	})

	test("Without encoding", () => {
		const jaggedArray = [["a", "b"], ["c"]]
		WsvFile.writeJaggedArraySync(jaggedArray, testFilePath)
		expect(WsvFile.loadSync(testFilePath).encoding).toEqual(ReliableTxtEncoding.Utf8)
	})
})

describe("WsvFile.appendJaggedArraySync", () => {
	test.each([
		[ReliableTxtEncoding.Utf8, ReliableTxtEncoding.Utf16],
		[ReliableTxtEncoding.Utf16, ReliableTxtEncoding.Utf8],
		[ReliableTxtEncoding.Utf16Reverse, ReliableTxtEncoding.Utf8],
		[ReliableTxtEncoding.Utf32, ReliableTxtEncoding.Utf8],
	])(
		"Given %p",
		(encoding, encoding2) => {
			const jaggedArray = [["a", "b"], ["c"]]
			deleteFile(testFilePath)
			WsvFile.appendJaggedArraySync(jaggedArray, testFilePath, encoding)
			let loadedDocument = WsvFile.loadSync(testFilePath)
			expect(loadedDocument.toString()).toEqual("a b\nc")
			expect(loadedDocument.encoding).toEqual(encoding)

			WsvFile.appendJaggedArraySync(jaggedArray, testFilePath, encoding2)
			loadedDocument = WsvFile.loadSync(testFilePath)
			expect(loadedDocument.toString()).toEqual("a b\nc\na b\nc")
			expect(loadedDocument.encoding).toEqual(encoding)
		}
	)

	test("Without encoding", () => {
		const jaggedArray = [["a", "b"], ["c"]]
		deleteFile(testFilePath)
		WsvFile.appendJaggedArraySync(jaggedArray, testFilePath)
		expect(WsvFile.loadSync(testFilePath).encoding).toEqual(ReliableTxtEncoding.Utf8)
	})
})

describe("WsvFile.appendLineSync", () => {
	test.each([
		[ReliableTxtEncoding.Utf8, ReliableTxtEncoding.Utf16],
		[ReliableTxtEncoding.Utf16, ReliableTxtEncoding.Utf8],
		[ReliableTxtEncoding.Utf16Reverse, ReliableTxtEncoding.Utf8],
		[ReliableTxtEncoding.Utf32, ReliableTxtEncoding.Utf8],
	])(
		"Given %p",
		(encoding, encoding2) => {
			deleteFile(testFilePath)
			WsvFile.appendLineSync(WsvLine.parse("a  b  #c"), testFilePath, encoding)
			let loadedDocument = WsvFile.loadSync(testFilePath)
			expect(loadedDocument.toString()).toEqual("a  b  #c")
			expect(loadedDocument.encoding).toEqual(encoding)

			WsvFile.appendLineSync(WsvLine.parse("a  b  #c"), testFilePath, encoding2, false)
			loadedDocument = WsvFile.loadSync(testFilePath)
			expect(loadedDocument.toString()).toEqual("a  b  #c\na b")
			expect(loadedDocument.encoding).toEqual(encoding)
		}
	)

	test("Without encoding", () => {
		deleteFile(testFilePath)
		WsvFile.appendLineSync(WsvLine.parse("a b #c"), testFilePath)
		const loadedDocument = WsvFile.loadSync(testFilePath)
		expect(loadedDocument.toString()).toEqual("a b #c")
		expect(loadedDocument.encoding).toEqual(ReliableTxtEncoding.Utf8)
	})
})

describe("WsvFile.appendLineValuesSync", () => {
	test.each([
		[ReliableTxtEncoding.Utf8, ReliableTxtEncoding.Utf16],
		[ReliableTxtEncoding.Utf16, ReliableTxtEncoding.Utf8],
		[ReliableTxtEncoding.Utf16Reverse, ReliableTxtEncoding.Utf8],
		[ReliableTxtEncoding.Utf32, ReliableTxtEncoding.Utf8],
	])(
		"Given %p",
		(encoding, encoding2) => {
			deleteFile(testFilePath)
			WsvFile.appendLineValuesSync(["a", "b"], testFilePath, encoding)
			let loadedDocument = WsvFile.loadSync(testFilePath)
			expect(loadedDocument.toString()).toEqual("a b")
			expect(loadedDocument.encoding).toEqual(encoding)

			WsvFile.appendLineValuesSync(["c"], testFilePath, encoding2)
			loadedDocument = WsvFile.loadSync(testFilePath)
			expect(loadedDocument.toString()).toEqual("a b\nc")
			expect(loadedDocument.encoding).toEqual(encoding)
		}
	)

	test("Without encoding", () => {
		deleteFile(testFilePath)
		WsvFile.appendLineValuesSync(["a", "b"], testFilePath)
		const loadedDocument = WsvFile.loadSync(testFilePath)
		expect(loadedDocument.toString()).toEqual("a b")
		expect(loadedDocument.encoding).toEqual(ReliableTxtEncoding.Utf8)
	})
})

// ----------------------------------------------------------------------

describe("SyncWsvStreamWriter Constructor", () => {
	test.each([
		[ReliableTxtEncoding.Utf8],
		[ReliableTxtEncoding.Utf16],
		[ReliableTxtEncoding.Utf16Reverse],
		[ReliableTxtEncoding.Utf32],
	])(
		"Given %p",
		(encoding) => {
			const writer = new SyncWsvStreamWriter(testFilePath, encoding)
			writer.close()
			const loaded = ReliableTxtFile.loadSync(testFilePath)
			expect(loaded.text).toEqual("")
			expect(loaded.encoding).toEqual(encoding)
		}
	)

	test("Without encoding", () => {
		const writer = new SyncWsvStreamWriter(testFilePath)
		writer.close()
		const loaded = ReliableTxtFile.loadSync(testFilePath)
		expect(loaded.text).toEqual("")
		expect(loaded.encoding).toEqual(ReliableTxtEncoding.Utf8)
	})
})

describe("SyncWsvStreamWriter Constructor Append", () => {
	test.each([
		[ReliableTxtEncoding.Utf8, ReliableTxtEncoding.Utf8],
		[ReliableTxtEncoding.Utf8, ReliableTxtEncoding.Utf16],
		[ReliableTxtEncoding.Utf8, ReliableTxtEncoding.Utf16Reverse],
		[ReliableTxtEncoding.Utf8, ReliableTxtEncoding.Utf32],
	])(
		"Given %p",
		(encoding1, encoding2) => {
			ReliableTxtFile.writeAllTextSync("Test1", testFilePath, encoding1)
			const writer = new SyncWsvStreamWriter(testFilePath, encoding2, true)
			expect(writer.encoding).toEqual(encoding1)
			writer.writeLine(WsvLine.parse("Test2"))
			writer.close()
			const loaded = ReliableTxtFile.loadSync(testFilePath)
			expect(loaded.text).toEqual("Test1\nTest2")
			expect(loaded.encoding).toEqual(encoding1)
		}
	)
})

test("SyncWsvStreamWriter.isClosed", () => {
	const writer = new SyncWsvStreamWriter(testFilePath)
	expect(writer.isClosed).toEqual(false)
	writer.close()
	expect(writer.isClosed).toEqual(true)
})

test("SyncWsvStreamWriter.writeDocument", () => {
	const writer = new SyncWsvStreamWriter(testFilePath)
	writer.writeDocument(WsvDocument.parse("a  b#\nc"))
	writer.close()
	expect(ReliableTxtFile.readAllTextSync(testFilePath)).toEqual("a  b#\nc")
})

test("SyncWsvStreamWriter.writeLines", () => {
	const writer = new SyncWsvStreamWriter(testFilePath)
	writer.writeLines([WsvLine.parse("a  b"), WsvLine.parse("c")])
	writer.close()
	expect(ReliableTxtFile.readAllTextSync(testFilePath)).toEqual("a  b\nc")
})

test("SyncWsvStreamWriter.writeLineValues", () => {
	const writer = new SyncWsvStreamWriter(testFilePath)
	writer.writeLineValues(["a", "b"])
	writer.writeLineValues(["c"])
	writer.close()
	expect(ReliableTxtFile.readAllTextSync(testFilePath)).toEqual("a b\nc")
})

// ----------------------------------------------------------------------

describe("SyncWsvStreamReader Constructor", () => {
	test.each([
		[ReliableTxtEncoding.Utf8],
	])(
		"Given %p",
		(encoding) => {
			ReliableTxtFile.writeAllTextSync("Test", testFilePath, encoding)
			const reader = new SyncWsvStreamReader(testFilePath)
			expect(reader.encoding).toEqual(encoding)
			reader.close()
		}
	)

	test.each([
		[ReliableTxtEncoding.Utf16],
		[ReliableTxtEncoding.Utf16Reverse],
		[ReliableTxtEncoding.Utf32],
	])(
		"Given %p throws",
		(encoding) => {
			ReliableTxtFile.writeAllTextSync("Test", testFilePath, encoding)
			expect(() => new SyncWsvStreamReader(testFilePath)).toThrowError()
		}
	)

	test("Chunk size", () => {
		ReliableTxtFile.writeAllTextSync("Test", testFilePath, ReliableTxtEncoding.Utf8)
		expect(() => new SyncWsvStreamReader(testFilePath, true, 1)).toThrowError("Chunk size too small")
	})
})

test("SyncWsvStreamReader.isClosed", () => {
	ReliableTxtFile.writeAllTextSync("Test", testFilePath, ReliableTxtEncoding.Utf8)
	const writer = new SyncWsvStreamReader(testFilePath)
	expect(writer.isClosed).toEqual(false)
	writer.close()
	expect(writer.isClosed).toEqual(true)
})

describe("SyncWsvStreamReader.readLine", () => {
	test("Null", () => {
		ReliableTxtFile.writeAllTextSync("Line1\nLine2", testFilePath)
		const reader = new SyncWsvStreamReader(testFilePath)
		const line1 = reader.readLine()
		if (line1 === null) { throw Error() }
		expect(line1.toString()).toEqual("Line1")
		const line2 = reader.readLine()
		if (line2 === null) { throw Error() }
		expect(line2.toString()).toEqual("Line2")
		expect(reader.readLine()).toEqual(null)
		reader.close()
	})

	test("Closed", () => {
		ReliableTxtFile.writeAllTextSync("Line1\nLine2", testFilePath)
		const reader = new SyncWsvStreamReader(testFilePath)
		reader.close()
		expect(() => reader.readLine()).toThrowError()
	})
})

test("SyncWsvStreamReader.readLineValues", () => {
	ReliableTxtFile.writeAllTextSync("a  b #c", testFilePath)
	const reader = new SyncWsvStreamReader(testFilePath)
	const values1 = reader.readLineValues()
	if (values1 === null) { throw Error() }
	expect(values1).toEqual(["a", "b"])
	expect(reader.readLineValues()).toEqual(null)
	reader.close()
})

/* (C) Stefan John / Stenway / WhitespaceSV.com / 2022 */

import { ReliableTxtDocument, ReliableTxtLines, ReliableTxtEncoding } from "@stenway/reliabletxt"
import { ReliableTxtFile, SyncReliableTxtStreamReader, SyncReliableTxtStreamWriter } from "@stenway/reliabletxt-io"
import { WsvDocument, WsvLine } from "@stenway/wsv"

// ----------------------------------------------------------------------

export abstract class WsvFile {
	static loadSync(filePath: string, preserveWhitespacesAndComments: boolean = true): WsvDocument {
		const reliableTxtDocument: ReliableTxtDocument = ReliableTxtFile.loadSync(filePath)
		const wsvDocument: WsvDocument = WsvDocument.parse(reliableTxtDocument.text, preserveWhitespacesAndComments)
		wsvDocument.encoding = reliableTxtDocument.encoding
		return wsvDocument
	}

	static saveSync(document: WsvDocument, filePath: string, preserveWhitespacesAndComments: boolean = true) {
		const text: string = document.toString(preserveWhitespacesAndComments)
		ReliableTxtFile.writeAllTextSync(text, filePath, document.encoding)
	}

	static readJaggedArraySync(filePath: string): (string | null)[][] {
		const document = WsvFile.loadSync(filePath, false)
		return document.toJaggedArray()
	}

	static writeJaggedArraySync(jaggedArray: (string | null)[][], filePath: string, encoding: ReliableTxtEncoding = ReliableTxtEncoding.Utf8) {
		const document = WsvDocument.fromJaggedArray(jaggedArray, encoding)
		WsvFile.saveSync(document, filePath, false)
	}

	static appendSync(document: WsvDocument, filePath: string, preserveWhitespacesAndComments: boolean = true) {
		const text: string = document.toString(preserveWhitespacesAndComments)
		const lines: string[] = ReliableTxtLines.split(text)
		ReliableTxtFile.appendAllLinesSync(lines, filePath, document.encoding)
	}

	static appendJaggedArraySync(jaggedArray: (string | null)[][], filePath: string, createWithEncoding: ReliableTxtEncoding = ReliableTxtEncoding.Utf8) {
		const document = WsvDocument.fromJaggedArray(jaggedArray, createWithEncoding)
		WsvFile.appendSync(document, filePath, false)
	}

	static appendLineSync(line: WsvLine, filePath: string, createWithEncoding: ReliableTxtEncoding = ReliableTxtEncoding.Utf8, preserveWhitespacesAndComments: boolean = true) {
		ReliableTxtFile.appendAllLinesSync([line.toString(preserveWhitespacesAndComments)], filePath, createWithEncoding)
	}

	static appendLineValuesSync(values: (string | null)[], filePath: string, createWithEncoding: ReliableTxtEncoding = ReliableTxtEncoding.Utf8) {
		ReliableTxtFile.appendAllLinesSync([WsvLine.serialize(values)], filePath, createWithEncoding)
	}
}

// ----------------------------------------------------------------------

export class SyncWsvStreamReader {
	private reader: SyncReliableTxtStreamReader
	private preserveWhitespacesAndComments: boolean

	get encoding(): ReliableTxtEncoding {
		return this.reader.encoding
	}

	get isClosed(): boolean {
		return this.reader.isClosed
	}

	constructor(filePath: string, preserveWhitespacesAndComments: boolean = true, chunkSize: number = 4096) {
		this.preserveWhitespacesAndComments = preserveWhitespacesAndComments
		this.reader = new SyncReliableTxtStreamReader(filePath, chunkSize)
	}

	readLine(): WsvLine | null {
		const lineStr: string | null = this.reader.readLine()
		if (lineStr === null) { return null }
		return WsvLine.parse(lineStr, this.preserveWhitespacesAndComments)
	}

	readLineValues(): (string | null)[] | null {
		const lineStr: string | null = this.reader.readLine()
		if (lineStr === null) { return null }
		return WsvLine.parseAsArray(lineStr)
	}

	close() {
		this.reader.close()
	}
}

// ----------------------------------------------------------------------

export class SyncWsvStreamWriter {
	private writer: SyncReliableTxtStreamWriter
	private preserveWhitespacesAndComments: boolean

	get encoding(): ReliableTxtEncoding {
		return this.writer.encoding
	}

	get isClosed(): boolean {
		return this.writer.isClosed
	}

	constructor(filePath: string, createWithEncoding: ReliableTxtEncoding = ReliableTxtEncoding.Utf8, append: boolean = false, preserveWhitespacesAndComments: boolean = true) {
		this.preserveWhitespacesAndComments = preserveWhitespacesAndComments
		this.writer = new SyncReliableTxtStreamWriter(filePath, createWithEncoding, append)
	}

	writeLineValues(values: (string | null)[]) {
		const lineStr: string = WsvLine.serialize(values)
		this.writer.writeLine(lineStr)
	}

	writeLine(line: WsvLine) {
		const lineStr: string = line.toString(this.preserveWhitespacesAndComments)
		this.writer.writeLine(lineStr)
	}

	writeLines(lines: WsvLine[]) {
		this.writeDocument(new WsvDocument(lines))
	}

	writeDocument(document: WsvDocument) {
		const content: string = document.toString(this.preserveWhitespacesAndComments)
		this.writer.writeLine(content)
	}

	close() {
		this.writer.close()
	}
}
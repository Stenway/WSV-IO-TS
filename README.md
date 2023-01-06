# WSV-IO

## About

[WSV Documentation/Specification](https://www.whitespacesv.com)

## Installation

Using NPM:
```
npm install @stenway/wsv-io
```

## Getting started

```ts
import { WsvDocument } from '@stenway/wsv'
import { WsvFile } from '@stenway/wsv-io'

let filePath = "Test.wsv"
WsvFile.saveSync(WsvDocument.parse("Value11 Value12\nValue21"), filePath)
console.log(WsvFile.loadSync(filePath))
```

## Videos
* [Package Usage](https://www.youtube.com/watch?v=RZB0EMhk8hc)
* [Why I like the UTF-8 Byte Order Mark (BOM)](https://www.youtube.com/watch?v=VgVkod9HQTo)
* [Stop Using Windows Line Breaks (CRLF)](https://www.youtube.com/watch?v=YPtMCiHj7F8)

## Examples

```ts
import { ReliableTxtEncoding } from "@stenway/reliabletxt"
import { WsvDocument } from "@stenway/wsv"
import { WsvFile } from "@stenway/wsv-io"

// saving

let document = WsvDocument.parse("a b\nc d #My comment")

WsvFile.saveSync(document, "Test.wsv")

document.encoding = ReliableTxtEncoding.Utf16
WsvFile.saveSync(document, "TestUtf16.wsv")

WsvFile.saveSync(document, "TestWithoutComment.wsv", false)

// loading

let loadedDocument = WsvFile.loadSync("Test.wsv")
let loadedDocumentStr = loadedDocument.toString()

let loadedDocumentUtf16 = WsvFile.loadSync("TestUtf16.wsv")
let loadedDocumentUtf16Str = loadedDocumentUtf16.toString()

let loadedDocumentWithoutComment = WsvFile.loadSync("Test.wsv", false)
let loadedDocumentWithoutCommentStr = loadedDocumentWithoutComment.toString()

// appending

WsvFile.appendSync(loadedDocument, "Append.wsv")
WsvFile.appendSync(loadedDocumentUtf16, "Append.wsv")

console.log("WSV-IO usage")
```

```ts
import { SyncWsvStreamReader, SyncWsvStreamWriter } from "@stenway/wsv-io/dist/wsv-io"
import { WsvLine } from "@stenway/wsv/dist/wsv"

// write

let writer = new SyncWsvStreamWriter("Stream.wsv")
for (let i=0; i<100; i++) {
	writer.writeLine(new WsvLine([i.toString(), "a", "b", "c"]))
}
writer.close()

// read

let reader = new SyncWsvStreamReader("Stream.wsv")
let count  = 0
while (true) {
	let line = reader.readLine()
	if (line === null) { break }
	count++
}
reader.close()
console.log(`Count: ${count}`)

console.log("WSV-IO usage")
```
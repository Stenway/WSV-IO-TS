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
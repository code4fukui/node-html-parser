# node-html-parser
English README is here: [README.md](README.md)

高速なHTMLパーサーです。簡略化されたDOMツリーと要素クエリをサポートします。

## 機能

- 高速なHTMLパース
- 要素クエリサポート
- 不適切なHTMLもある程度修正

## 使い方

```ts
import { HTMLParser } from 'https://code4fukui.github.io/node-html-parser/HTMLParser.js';

const root = HTMLParser.parse('<ul id="list"><li>Hello World</li></ul>');

console.log(root.firstChild.structure);
console.log(root.querySelector('#list'));
console.log(root.toString());
```

## ビルド方法

```sh
npm i
deno bundle dist/index.ts > bundle.js
```

## パフォーマンス

2022年8月10日の計測結果では、node-html-parserは高速なパース速度を実現しています。

## ライセンス
このプロジェクトは [MIT License](LICENSE) のもとで公開されています。

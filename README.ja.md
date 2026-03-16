# 高速HTMLパーサー

English README is here: [README.md](README.md)

日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

高速HTMLパーサーは_非常に高速_なHTMLパーサーです。これは、要素クエリサポート付きの簡略化されたDOMツリーを生成します。

設計方針に従えば、低価格で大規模なHTMLファイルを解析することを目的としています。したがって、パフォーマンスが最優先事項です。そのため、一部の書式の間違ったHTMLが正しく解析されない可能性がありますが、ほとんどの一般的なエラー(例えば、HTML4スタイルの`<td>`の閉じタグなし等)は対処されています。

## 使用法

```ts
import { HTMLParser } from 'https://code4fukui.github.io/node-html-parser/HTMLParser.js';

const root = HTMLParser.parse('<ul id="list"><li>Hello World</li></ul>');

console.log(root.firstChild.structure);
// ul#list
//   li
//     #text

console.log(root.querySelector('#list'));
// { tagName: 'ul',
//   rawAttrs: 'id="list"',
//   childNodes:
//    [ { tagName: 'li',
//        rawAttrs: '',
//        childNodes: [Object],
//        classNames: [] } ],
//   id: 'list',
//   classNames: [] }
console.log(root.toString());
// <ul id="list"><li>Hello World</li></ul>
root.set_content('<li>Hello World</li>');
root.toString();	// <li>Hello World</li>
```

## ビルド方法

```sh
npm i
deno bundle dist/index.ts > bundle.js
```

## パフォーマンス

-- 2022-08-10

```shell
html-parser     :24.1595 ms/file ± 18.7667
htmljs-parser   :4.72064 ms/file ± 5.67689
html-dom-parser :2.18055 ms/file ± 2.96136
html5parser     :1.69639 ms/file ± 2.17111
cheerio         :12.2122 ms/file ± 8.10916
parse5          :6.50626 ms/file ± 4.02352
htmlparser2     :2.38179 ms/file ± 3.42389
htmlparser      :17.4820 ms/file ± 128.041
high5           :3.95188 ms/file ± 2.52313
node-html-parser:2.04288 ms/file ± 1.25203
node-html-parser (last release):2.00527 ms/file ± 1.21317
```

[htmlparser-benchmark](https://github.com/AndreasMadsen/htmlparser-benchmark)を使ってテストしました。

## グローバルメソッド

### parse(データ[, オプション])

提供されたデータを解析し、生成されたDOMのルートを返します。

- **データ**, 解析するデータ
- **オプション**, 解析オプション

  ```js
  {
    lowerCaseTagName: false,		// タグ名を小文字に変換する (パフォーマンスに大きな影響を与える)
    comment: false,           		// コメントを取得する (パフォーマンスにわずかな影響を与える)
    fixNestedATags: false,    		// 無効な入れ子の <a> HTML タグを修正する
    parseNoneClosedTags: false, 	// 閉じられていないHTMLタグを削除せずに閉じる
    voidTag: {
      tags: ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'],	// オプションで大文字小文字は区別しない, デフォルト値は ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']
      closingSlash: true	// オプション, デフォルト false. void タグのシリアル化, 最終スラッシュを追加する <br/>
    },
    blockTextElements: {
      script: true,		// パース時にテキストコンテンツを保持する
      noscript: true,		// パース時にテキストコンテンツを保持する
      style: true,		// パース時にテキストコンテンツを保持する
      pre: true			// パース時にテキストコンテンツを保持する
    }
  }
  ```

### valid(データ[, オプション])

提供されたデータを解析し、与えられたデータが有効であれば true を、そうでなければ false を返します。

## クラス

```mermaid
classDiagram
direction TB
class HTMLElement{
	this trimRight()
	this removeWhitespace()
	Node[] querySelectorAll(string selector)
	Node querySelector(string selector)
	HTMLElement[] getElementsByTagName(string tagName)
	Node closest(string selector)
	Node appendChild(Node node)
	this insertAdjacentHTML('beforebegin' | 'afterbegin' | 'beforeend' | 'afterend' where, string html)
	this setAttribute(string key, string value)
	this setAttributes(Record string, string attrs)
	this removeAttribute(string key)
	string getAttribute(string key)
	this exchangeChild(Node oldNode, Node newNode)
	this removeChild(Node node)
	string toString()
	this set_content(string content)
	this set_content(Node content)
	this set_content(Node[] content)
	this remove()
	this replaceWith((string | Node)[] ...nodes)
	ClassList classList
	HTMLElement clone()
	HTMLElement getElementById(string id)
	string text
	string rawText
	string tagName
	string structuredText
	string structure
	Node firstChild
	Node lastChild
	Node nextSibling
	HTMLElement nextElementSibling
	Node previousSibling
	HTMLElement previousElementSibling
	string innerHTML
	string outerHTML
	string textContent
	Record<string, string> attributes
	[number, number] range
}
class Node{
	<<abstract>>
	string toString()
	Node clone()
	this remove()
	number nodeType
	string innerText
	string textContent
}
class ClassList{
	add(string c)
	replace(string c1, string c2)
	remove(string c)
	toggle(string c)
	boolean contains(string c)
	number length
	string[] value
	string toString()
}
class CommentNode{
	CommentNode clone()
	string toString()
}
class TextNode{
	TextNode clone()
	string toString()
	string rawText
	string trimmedRawText
	string trimmedText
	string text
	boolean isWhitespace
}
Node --|> HTMLElement
Node --|> CommentNode
Node --|> TextNode
Node ..> ClassList
```

## HTMLElement メソッド

### trimRight()

TextNode 内のパターンを見つけた後、要素を右（ブロック内）からトリムします。

### removeWhitespace()

このサブツリー内の空白を削除します。

### querySelectorAll(selector)

CSSセレクターを使用して一致するノードを検索します。

注: v3.0.0以降、CSS3セレクターの完全なレンジがサポートされています。

### querySelector(selector)

CSSセレクターを使用して一致するノードを検索します。見つからない場合は `null` を返します。

### getElementsByTagName(tagName)

指定のタグ名を持つすべての要素を取得します。

注: すべての要素を取得するには `*` を使います。

### closest(selector)

CSSセレクターで最も近い要素を検索します。見つからない場合は `null` を返します。

### before(...nodesOrStrings)

現在の要素の前に1つ以上のノードまたはテキストを挿入します。ルート要素では動作しません。

### after(...nodesOrStrings)

現在の要素の後に1つ以上のノードまたはテキストを挿入します。ルート要素では動作しません。

### prepend(...nodesOrStrings)

要素の子ノードの先頭に1つ以上のノードまたはテキストを挿入します。

### append(...nodesOrStrings)

要素の子ノードの最後に1つ以上のノードまたはテキストを挿入します。
これは `appendChild` と似ていますが、複数のノードを受け入れ、文字列をテキストノードに変換します。

### appendChild(node)

ノードを要素の子ノードに追加します。

### insertAdjacentHTML(where, html)

指定されたテキストをHTMLとして解析し、DOM ツリーの指定された位置に挿入します。

### setAttribute(key: string, value: string)

属性 `key` に `value` を設定します。

### setAttributes(attrs: Record<string, string>)

要素の属性を設定します。

### removeAttribute(key: string)

属性 `key` を削除します。

### getAttribute(key: string)

属性 `key` の値を取得します。設定されていない場合は `undefined` を返します。

### exchangeChild(oldNode: Node, newNode: Node)

指定された子ノードを新しい子ノードと交換します。

### removeChild(node: Node)

子ノードを削除します。

### toString()

[outerHTML](#htmlelementouterhtml) と同じです。

### set_content(content: string | Node | Node[])

コンテンツを設定します。**注意**: **ルート** ノードのコンテンツは設定しないでください。

### remove()

現在の要素を削除します。

### replaceWith(...nodes: (string | Node)[])

現在の要素を他のノード(複数可)に置き換えます。

### classList

#### classList.add

クラス名を追加します。

#### classList.replace(old: string, new: string)

クラス名を別のものに置き換えます。

#### classList.remove()

クラス名を削除します。

#### classList.toggle(className: string):void

クラスをトグルします。すでに含まれている場合は削除し、そうでない場合は追加します。

#### classList.contains(className: string): boolean

指定のクラス名がすでにclistに含まれている場合にtrueを返します。

#### classList.value

クラス名を取得します。

#### clone()

ノードをクローンします。

#### getElementById(id: string): HTMLElement | null

IDでエレメントを取得します。

## HTMLElement プロパティ

### text

現在のノードとその子ノードのエスケープされていない文字列を取得します。`innerText`のようなものです。
(初回は遅いです)

### rawText

現在のノードとその子ノードのエスケープされた(そのまま)の文字列を取得します。`&amp;`が含まれる可能性があります。(高速)

### tagName

HTMLElementのタグ名を取得または設定します。返される値は大文字の文字列であることに注意してください。

### structuredText

構造化されたテキストを取得します。

### structure

DOMの構造を取得します。

### childNodes

すべての子ノードを取得します。子ノードにはTextNode、CommentNode、HTMLElementがあります。

### children

すべての子要素を取得します。つまり、HTMLElementタイプの子ノードです。

### firstChild

最初の子ノードを取得します。ノードに子がない場合は`undefined`になります。

### lastChild

最後の子ノードを取得します。ノードに子がない場合は`undefined`になります。

### firstElementChild

最初のHTMLElement型の子を取得します。存在しない場合は`undefined`になります。

### lastElementChild

最後のHTMLElement型の子を取得します。存在しない場合は`undefined`になります。

### childElementCount

HTMLElement型の子の数を取得します。

### innerHTML

innerHTML を設定または取得します。

### outerHTML

outerHTMLを取得します。

### nextSibling

現在の要素の親の次の子ノードへの参照を返します。見つからない場合は`null`になります。

### nextElementSibling

現在の要素の親の次の子要素への参照を返します。見つからない場合は`null`になります。

### previousSibling

現在の要素の親の前の子ノードへの参照を返します。見つからない場合は`null`になります。

### previousElementSibling

現在の要素の親の前の子要素への参照を返します。見つからない場合は`null`になります。

### textContent

現在の要素のtextContentを取得または設定します。[set_content](#htmlelementset_contentcontent-string--node--node)より効率的です。

### attributes

現在の要素のすべての属性を取得します。**注意: 返された値を変更しないでください。**

### range

対応するソースコードの開始インデックスと終了インデックスを返します(例: [0, 40])。

以下の README マークダウンのチャンクを英語から日本語に翻訳します。

ルール:
- マークダウンの構造、見出しレベル、リスト、セクションの順序を保持する。
- すべてのリンクとURLを正確に保持する。
- コードブロックを正確に保持する (コードは翻訳しない)。
- 文章を削除しない。
- マークダウンのみを出力する。

日本語マークダウンチャンク:

## ライセンス
このプロジェクトは [MIT License](LICENSE) のもとで公開されています。

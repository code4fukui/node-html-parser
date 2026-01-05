import { HTMLParser } from "./HTMLParser.js";

const html = `<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="icon" href="data:">
<title>test</title>
<style>body { font-family: sans-serif; }</style>
</head><body>
test <a href=test.html>link</a> test<br>
test <a href=test2.html>link</a> test<br>
</body>
</html>`;

const root = HTMLParser.parse(html);
console.log(root.toString());
const body = root.querySelector('body');
console.log(body.innerHTML);
console.log(body.querySelectorAll("a").map(i => i.getAttribute("href")));

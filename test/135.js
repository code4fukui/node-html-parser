const { parse, TextNode, HTMLElement } = require('../dist');

describe('pr 135', function () {
	it('shoud not decode text', function () {
		const content = `&lt;p&gt; Not a p tag &lt;br /&gt; at all`;
		const root = parse(`<div>${content}</div>`);
		const div = root.firstChild;
		div.innerHTML.should.eql(content);
		div.textContent.should.eql('<p> Not a p tag <br /> at all');
		// div.innerText.should.eql('<p> Not a p tag <br /> at all');

		// const textNode = div.firstChild;
		// textNode.rawText.should.eql(content);
		// textNode.toString().should.eql('aaa')
	});

	it('should not decode text from parseHTML()', function () {
		const content = `&lt;p&gt; Not a p tag &lt;br /&gt; at all`;
		const root = parse(`<div>${content}</div>`);
		root.childNodes.should.have.length(1);

		const divNode = root.firstChild;
		divNode.childNodes.should.have.length(1);

		const textNode = divNode.firstChild;
		textNode.rawText.should.eql(content);
	});

	it(`should decode for node text property`, function () {
		const encodedText = `My&gt;text`;
		const decodedText = `My>text`;
		const root = parse(`<p>${encodedText}</p>`);

		const pNode = root.firstChild;
		pNode.innerHTML.should.eql(encodedText);
		pNode.textContent.should.eql(decodedText);

		const textNode = pNode.firstChild;
		textNode.textContent.should.eql(decodedText);
	});

	it('should remove whitespaces while preserving nodes with content', function () {
		const root = parse('<p> \r \n  \t <h5>  123&nbsp;  </h5></p>');

		const textNode = new TextNode('  123&nbsp;  ');
		textNode.rawText = textNode.trimmedText;
		textNode.rawText.should.eql(' 123&nbsp; ');

		const p = new HTMLElement('p', {}, '', root);
		p
			.appendChild(new HTMLElement('h5', {}, ''))
			.appendChild(textNode);

		p.toString().should.eql('<p><h5> 123&nbsp; </h5></p>');
		root.firstChild.removeWhitespace().toString().should.eql('<p><h5> 123&nbsp; </h5></p>');
		root.firstChild.removeWhitespace().should.eql(p);
	})
});
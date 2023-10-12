export function parts(...partsArray: string[]) {
	let htmlString = `<div class="parts grid">\n`;
	partsArray.forEach((part, i) => {
		htmlString += `\t<div class="part-label">(${String.fromCharCode(97 + i)})</div>\n`;
		htmlString += `\t<div class="part-content">${part}</div>\n`;
	});
	htmlString += `</div>`;
	return htmlString;
}

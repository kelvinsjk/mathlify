export const numberLayer = {
	fraction: {
		rows: [
			[
				{ latex: '7' },
				{ class: 'separator w5' },
				{ latex: '8' },
				{ class: 'separator w5' },
				{ latex: '9' },
				{ class: 'separator w5' },
				{
					class: 'action font-glyph font-bigger',
					command: ['deleteBackward'],
					label: '&#x232b;',
				},
				{
					class: 'action font-glyph font-bigger font-bold',
					command: ['deleteForward'],
					label: 'del',
				},
				{
					class: 'action font-glyph font-bigger font-bold font-red',
					command: ['deleteAll'],
					label: '&#8557;',
				},
			],
			[
				{ latex: '4' },
				{ class: 'separator w5' },
				{ latex: '5' },
				{ class: 'separator w5' },
				{ latex: '6' },
				{ class: 'separator w5' },
				{ class: 'separator' },
				{ class: 'separator' },
				{
					class: 'separator',
				},
			],
			[
				{ latex: '1' },
				{ class: 'separator w5' },
				{ latex: '2' },
				{ class: 'separator w5' },
				{ latex: '3' },
				{ class: 'separator w5' },
				{ class: 'separator' },
				{
					class: 'action font-bigger',
					command: ['moveUp'],
					label: '&#9650;',
				},
				{ class: 'separator' },
			],
			[
				{ latex: '0' },
				{ class: 'separator w5' },
				{ class: 'separator' },
				{ class: 'separator w5' },
				{
					class: 'font-normal',
					command: ['insert', '-'],
					latex: '(-)',
				},
				{ class: 'separator w5' },
				{
					class: 'action font-bigger',
					command: ['moveToPreviousChar'],
					label: '&#9664;',
				},
				{
					class: 'action font-bigger',
					command: ['moveDown'],
					label: '&#9660;',
				},
				{
					class: 'action font-bigger',
					command: ['moveToNextChar'],
					label: '&#9654;',
				},
			],
		],
	},
};

export const fractionKeyboard = {
	'fraction-keyboard': {
		label: 'Fraction', // Label displayed in the Virtual Keyboard Switcher
		tooltip: 'Fraction', // Tooltip when hovering over the label
		layer: 'fraction',
	},
};

export const keyboardOptions = {
	plonkSound: 'null',
	keypressSound: 'null',
	customVirtualKeyboards: fractionKeyboard,
	virtualKeyboardToolbar: 'none',
	virtualKeyboards: 'fraction-keyboard',
	virtualKeyboardMode: 'onfocus', // 'onfocus',
	onBlur: checkForBlank,
};

function checkForBlank(mathfield) {
	if (mathfield.getValue() === '') {
		mathfield.setValue('\\bigstar');
	}
}

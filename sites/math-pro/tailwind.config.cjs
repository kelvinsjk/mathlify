const typography = require('@tailwindcss/typography');
//const forms = require('@tailwindcss/forms');
const colors = require('tailwindcss/colors');
const daisyui = require('daisyui');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {},
		colors: {
			goldenrod: '#c9e8d0',
			'goldenrod-light': '#edf7ef',
			'goldenrod-300': '#e0f2e4',
			midnightblue: '#191970',
			'midnightblue-dark': '#00003D',
			red: colors.red,
			zinc: colors.stone,
			black: colors.black,
			white: colors.white,
			yellow: colors.yellow,
		},
	},
	daisyui: {
		themes: [
			{
				'math-repo': {
					primary: '#191970',
					secondary: '#c9e8d0', //'#a5d9b1', //'#fedb8b',
					accent: '#d9a5cd', //'#37CDBE',
					neutral: '#57534e',
					'base-100': '#f3f4f6',
					info: '#38bdf8',
					success: '#4ade80',
					warning: '#b91c1c', //'#fb923c',
					error: '#f87171',
				},
			},
		],
	},

	plugins: [
		//forms,
		typography,
		daisyui,
	],
};

module.exports = config;

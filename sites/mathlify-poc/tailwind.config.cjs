const typography = require('@tailwindcss/typography');
const daisyui = require('daisyui');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {},
		colors: {
			goldenrod: '#fedb8b',
			'goldenrod-light': '#fffff1',
			'goldenrod-dark': '#fdc23d',
			'goldenrod-300': '#fff1d1',
			midnightblue: '#191970',
			'midnightblue-dark': '#00003D',
			red: colors.red,
			zinc: colors.stone,
			black: colors.black,
			white: colors.white,
			'pastel-blue': '#00d9ff',
			'pastel-green': '6fab82',
			'pastel-yellow': '#fedb8b',
			'pastel-pink': 'ff95c1'
		},
	},
	daisyui: {
		themes: [
			{
				'math-repo': {
					primary: '#191970',
					secondary: '#fedb8b',
					accent: '#37CDBE',
					neutral: '#57534e',
					'base-100': '#f3f4f6',
					info: '#38bdf8',
					success: '#4ade80',
					warning: '#fb923c',
					error: '#f87171',
				},
			},
		],
	},

	plugins: [typography, daisyui],
};

module.exports = config;
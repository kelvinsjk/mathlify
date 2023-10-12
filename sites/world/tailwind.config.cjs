/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {},
	},

	plugins: [require('daisyui'), require('@tailwindcss/typography')],
	daisyui: {
		themes: ['cupcake'],
	},
};

module.exports = config;

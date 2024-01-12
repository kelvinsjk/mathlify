/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [require('daisyui'), require('@tailwindcss/typography')],

	daisyui: {
		themes: ['cupcake', 'dark'],
		darkTheme: 'dark'
	}
};

module.exports = config;

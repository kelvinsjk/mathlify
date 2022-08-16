import { type PlaywrightTestConfig, devices } from '@playwright/test';
const config: PlaywrightTestConfig = {
	projects: [
		{
			name: 'Pixel 4',
			use: { browserName: 'chromium', ...devices['Pixel 4'] },
		},
		{
			name: 'webkit-mobile',
			use: { ...devices['iPhone X'] },
		},
		{
			name: 'firefox',
			use: { ...devices['Firefox'], viewport: { width: 1920, height: 1080 } },
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
		},
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } },
		},
	],
	workers: 4,
};
export default config;

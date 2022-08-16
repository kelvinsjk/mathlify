import { test, expect } from '@playwright/test';

test('13 vectors ii screenshot', async ({ page, browserName }) => {
	await page.goto('http://localhost:3000/questions/13/test');
	await expect(page.locator('h1').first()).toHaveText('Vectors II Test Page');
	if (browserName !== 'webkit' && page.viewportSize().width !== 375) {
		const buffer = await page.screenshot({
			fullPage: true,
		});
		expect(buffer).toMatchSnapshot({ name: '13-vectors-ii.png', maxDiffPixelRatio: 0.02 });
	}
});

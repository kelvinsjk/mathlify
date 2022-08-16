import { test, expect } from '@playwright/test';

test('12 vectors i screenshot', async ({ page, browserName }) => {
	await page.goto('http://localhost:3000/questions/12/test');
	await expect(page.locator('h1').first()).toHaveText('Vectors I Test Page');
	if (browserName !== 'webkit' && page.viewportSize().width !== 375) {
		const buffer = await page.screenshot({
			fullPage: true,
		});
		expect(buffer).toMatchSnapshot({ name: '12-vectors-i.png' });
	}
});

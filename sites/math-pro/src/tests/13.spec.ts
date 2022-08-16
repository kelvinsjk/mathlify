import { test, expect } from '@playwright/test';

test('13: Vectors II navigate', async ({ page }) => {
	// home page
	await page.goto('http://localhost:3000');
	let title = page.locator('h1');
	await expect(title).toHaveText('Math Pro');

	// navigate to Questions
	const questionsLink = page.locator('nav a', { hasText: 'questions' });
	await questionsLink.click();
	title = page.locator('h1');
	await expect(title).toHaveText('Questions');

	// navigate to Vectors I: Magnitude
	const vectorsButton = page.locator('button', { hasText: '13: Vectors II' });
	await vectorsButton.click();
	const angleLink = page.locator('a', { hasText: 'Angle I' }).first();
	await angleLink.click();
	title = page.locator('h1');
	await expect(title).toHaveText('Question 1302a');

	// input answer (square root)
	const svg = page.locator('data-test-id=tick');
	expect(svg).toBeHidden();
	const answer = page.locator('math-field');
	await answer.focus();
	const number2 = page.locator('.keycap', { hasText: '2' });
	await expect(number2).toBeVisible();
	await number2.click();
	const submitButton = page.locator('button', { hasText: 'Submit' });
	await submitButton.click();
	await expect(svg).toBeVisible();
});

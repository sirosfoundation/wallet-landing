import { expect, test } from '@playwright/test';

test.describe('no cached users', () => {
	test('shows the welcome view', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Welcome to');
		await expect(page.getByRole('heading', { name: 'Create a wallet account' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'About the SIROS ID Wallet' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Develop with the SIROS ID Platform' })).toBeVisible();
	});

	test('shows 404 for unknown paths', async ({ page }) => {
		await page.goto('/some-unknown-path');
		await expect(page.getByRole('heading', { level: 1 })).toContainText('404');
		await expect(page.getByText('does not exist')).toBeVisible();
	});
});

test.describe('one cached user', () => {
	test('redirects to the tenant path', async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem(
				'cachedUsers',
				JSON.stringify([{ tenant: { id: 'acme', displayName: 'Acme Corp' } }]),
			);
		});

		await page.goto('/');
		await page.waitForURL('/id/acme/');
	});
});

test.describe('multiple cached users', () => {
	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem(
				'cachedUsers',
				JSON.stringify([
					{ tenant: { id: 'acme', displayName: 'Acme Corp' } },
					{ tenant: { id: 'globex', displayName: 'Globex Inc' } },
				]),
			);
		});
	});

	test('shows the tenant selection view', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Please select your wallet to continue')).toBeVisible();
		await expect(page.getByText('Acme Corp')).toBeVisible();
		await expect(page.getByText('Globex Inc')).toBeVisible();
	});

	test('tenant links point to correct paths', async ({ page }) => {
		await page.goto('/');
		const acmeLink = page.getByRole('link').filter({ hasText: 'Acme Corp' });
		await expect(acmeLink).toHaveAttribute('href', '/id/acme/');
		const globexLink = page.getByRole('link').filter({ hasText: 'Globex Inc' });
		await expect(globexLink).toHaveAttribute('href', '/id/globex/');
	});

	test('shows "Log in to other tenant" when default is not in list', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Log in to another wallet')).toBeVisible();
	});

	test('redirects to first tenant when user appears logged in', async ({ page }) => {
		await page.addInitScript(() => {
			sessionStorage.setItem('userHandle', 'alice');
			sessionStorage.setItem('sessionState', 'active');
		});

		await page.goto('/');
		await page.waitForURL('/id/acme/');
	});
});

test.describe('cached user includes default tenant', () => {
	test('hides "Log in to other tenant" link', async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem(
				'cachedUsers',
				JSON.stringify([
					{ tenant: { id: 'default', displayName: 'Default Tenant' } },
					{ tenant: { id: 'acme', displayName: 'Acme Corp' } },
				]),
			);
		});

		await page.goto('/');
		await expect(page.getByText('Log in to other tenant')).not.toBeVisible();
	});
});

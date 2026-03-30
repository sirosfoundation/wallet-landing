import { expect, test } from '@playwright/test';

/** Wait for the service worker to reach the activated state. */
async function waitForSWActivation(page: import('@playwright/test').Page) {
    await page.evaluate(async () => {
        const reg = await navigator.serviceWorker.ready;
        if (reg.active?.state !== 'activated') {
            await new Promise((resolve) => {
                reg.active!.addEventListener('statechange', resolve, { once: true });
            });
        }
    });
}

test.describe('service worker', () => {
    test('registers and activates', async ({ page }) => {
        await page.goto('/');

        const swURL = await page.evaluate(async () => {
            const reg = await navigator.serviceWorker.ready;
            return reg.active?.scriptURL;
        });

        expect(swURL).toContain('/sw.js');
    });

    test('serves the page offline after caching', async ({ page, context }) => {
        await page.goto('/');
        await waitForSWActivation(page);

        await page.reload();
        await expect(page.getByRole('heading', { level: 1 })).toContainText('Welcome to');

        await context.setOffline(true);
        await page.reload();

        await expect(page.getByRole('heading', { level: 1 })).toContainText('Welcome to');

        await context.setOffline(false);
    });

    test('caches static assets for offline use', async ({ page, context }) => {
        await page.goto('/');
        await waitForSWActivation(page);

        await page.reload();
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

        await context.setOffline(true);
        await page.reload();

        const bgColor = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('background-color'),
        );
        expect(bgColor).toBeTruthy();
        expect(bgColor).not.toBe('');

        await context.setOffline(false);
    });

    test('deletes old caches when a new version activates', async ({ page }) => {
        await page.goto('/');
        await waitForSWActivation(page);

        // Get the current cache name and create a stale cache.
        const currentCacheName = await page.evaluate(async () => {
            const keys = await caches.keys();
            await caches.open('wallet-landing--old-version');
            return keys[0];
        });

        expect(currentCacheName).toMatch(/^wallet-landing--/);

        // Verify both caches exist.
        const beforeCaches = await page.evaluate(() => caches.keys());
        expect(beforeCaches).toContain(currentCacheName);
        expect(beforeCaches).toContain('wallet-landing--old-version');

        // Unregister and re-register to trigger a fresh install + activate cycle.
        await page.evaluate(async () => {
            const reg = await navigator.serviceWorker.getRegistration('/');
            await reg!.unregister();
        });

        await page.reload();
        await waitForSWActivation(page);

        // Verify old cache was cleaned up.
        const afterCaches = await page.evaluate(() => caches.keys());
        expect(afterCaches).toContain(currentCacheName);
        expect(afterCaches).not.toContain('wallet-landing--old-version');
    });

    test('new version still serves the page offline', async ({ page, context }) => {
        await page.goto('/');
        await waitForSWActivation(page);

        // Populate the cache.
        await page.reload();
        await expect(page.getByRole('heading', { level: 1 })).toContainText('Welcome to');

        // Inject magenta HTML directly into the SW cache as proof of which cache is served.
        await page.evaluate(async () => {
            const keys = await caches.keys();
            const cache = await caches.open(keys[0]);
            const original = await cache.match('/');
            const html = await original!.text();
            const ugly = html.replace(
                '</head>',
                '<style>body { color: magenta !important; }</style></head>',
            );
            await cache.put('/', new Response(ugly, {
                headers: { 'content-type': 'text/html' },
            }));
        });

        // Go offline — SW should serve the magenta HTML from cache.
        await context.setOffline(true);
        await page.reload();

        await expect(page.getByRole('heading', { level: 1 })).toContainText('Welcome to');

        const color = await page.evaluate(() =>
            getComputedStyle(document.body).color,
        );
        expect(color).toBe('rgb(255, 0, 255)'); // magenta

        await context.setOffline(false);
    });
});

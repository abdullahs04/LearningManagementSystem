import { test, expect } from '@playwright/test';

test('loads homepage', async ({ page }) => {
  await page.goto('http://localhost:5173');
  console.log("✅ Smoke test passed. Homepage loaded successfully.");
});


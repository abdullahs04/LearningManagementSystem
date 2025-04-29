# Test info

- Name: loads homepage
- Location: /home/skinnyytallboy/vault/01-uni/sem4/softwareEng/project/LearningManagementSystem/frontend/tests/smoke.spec.ts:3:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

    at /home/skinnyytallboy/vault/01-uni/sem4/softwareEng/project/LearningManagementSystem/frontend/tests/smoke.spec.ts:4:14
```

# Test source

```ts
  1 | import { test, expect } from '@playwright/test';
  2 |
  3 | test('loads homepage', async ({ page }) => {
> 4 |   await page.goto('http://localhost:5173');
    |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/
  5 |   console.log("✅ Smoke test passed. Homepage loaded successfully.");
  6 | });
  7 |
  8 |
```
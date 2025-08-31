import { test, expect } from '@playwright/test'
import tags from '../test-data/tags.json'

test.beforeEach(async ({page}) => {
  // API - Mock Popular Tags section
  // Intercept Request and provide own Response
  await page.route('*/**/api/tags', async route => {
    await route.fulfill({
      body: JSON.stringify(tags)
    })
  })

  await page.goto('https://conduit.bondaracademy.com/')
})

test('Verify Popular Tags section', async ({ page }) => {
  const tagList = page.getByText('Popular Tags').locator('..').locator('.tag-list')
  const tagValues = tags.tags.join(' ');
  await expect(tagList).toHaveText(tagValues)
})

import { test, expect } from '@playwright/test'

test.beforeEach(async ({page}) => {
  // API - Modify API Response
  await page.route('*/**/api/articles*', async route => {
    const response = await route.fetch()
    const responseBody = await response.json()
    responseBody.articles[0].title = 'Test Article Title'
    responseBody.articles[0].description = 'Test Article Description'

    await route.fulfill({
        body: JSON.stringify(responseBody)
    })
    
  })
  
  await page.goto('https://conduit.bondaracademy.com/')
})

test('Verify first Test Article details', async ({ page }) => {
    const articleList = page.locator('app-article-list')
    const firstArticleTitle = articleList.locator('h1').first()
    const firstArticleDescription = articleList.locator('p').first()
    await expect(firstArticleTitle).toHaveText('Test Article Title')
    await expect(firstArticleDescription).toHaveText('Test Article Description')
});
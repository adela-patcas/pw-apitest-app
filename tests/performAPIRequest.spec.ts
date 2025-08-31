import { test, expect, request } from '@playwright/test'

test.beforeEach(async ({page, request}) => {
    // Get auth token
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user": {"email": "pw@automation.com", "password": "Playwright01"}
        }
    })
    const responseBody = await response.json()
    const authToken = responseBody.user.token

    // Create new article
    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
            "article": {"title": "Test Article Title", "description": "Test Article Description", "body": "Test Article Body", "tagList": []}
        },
        headers: {
            Authorization: `Token ${authToken}`
        }
    })
    expect(articleResponse.status()).toBe(201)

    await page.goto('https://conduit.bondaracademy.com/')

    // Perform UI login
    await page.getByText('Sign in').click()
    await page.getByPlaceholder('Email').fill('pw@automation.com')
    await page.getByPlaceholder('Password').fill('Playwright01')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page.getByText('Your Feed')).toBeVisible()
})

test('Delete Test Article', async ({ page }) => {
    await page.getByText('Global Feed').click()
    const articleList = page.locator('app-article-list')
    const firstArticleTitle = articleList.locator('h1').first()
    await firstArticleTitle.click()

    const deleteButton = page.locator('button').filter({ hasText: 'Delete Article' }).first()
    await deleteButton.click()

    await expect(page.getByText('Global Feed')).toBeVisible()
    await expect(firstArticleTitle).not.toHaveText('Test Article Title')
});
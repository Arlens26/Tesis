import { test, expect }  from '@playwright/test'

test.describe('CourseForm', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/course/')
    })

    test('Should create a new course', async ({ page }) =>{
        await page.fill('input[name="name"]', 'Curso de prueba')
        await page.fill('input[name="code"]', '751644')
        await page.fill('textarea[name="description"]', 'Descripción del curso de prueba')
        await page.fill('input[name="credit"]', '3')

        await page.click('button[type="submit"]')
        await expect(page).toHaveURL('/course/')
    })

    test('Should update an existing course', async ({ page }) =>{
        await page.goto('/course/1/', { state: { courseData: { 
            name: 'Curso de prueba',
            code: '751644',
            description: 'Descripción del curso de prueba',
            credit: '3'
        }}})

        await page.fill('input[name="name"]', 'Curso actualizado')

        await page.click('button[type="submit"]')
        await expect(page).toHaveURL('/course/1/')
    })
})
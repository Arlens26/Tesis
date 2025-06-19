import { test, expect } from '@playwright/test'

test.describe('Scheduled Course Form', () => {

    const token = 'fb49c1715e4bb2a078201c27f558583658980f08'

    /*test.beforeAll(async ({ request }) => {
        const response = await request.post('/login/', {
            data: {
                username: 'UserD',
                password: 'userD'
            }
        })
        const data = await response.json()
        token = data.token 
    })*/

    test.beforeEach(async ({ page }) => {
        // Configurar el token en localStorage
        await page.addInitScript(token => {
            window.localStorage.setItem('token', token)
        }, token)

        await page.goto('/scheduled-course')
        
        // Simular el estado directamente en el componente (si es necesario)
        await page.evaluate(() => {
            window.history.replaceState({ course_id: '126', version_id: '30' }, '', '/scheduled-course')
        })
    })

    test('should load the course details and submit the form', async ({ page }) => {
        await page.waitForSelector('h1')
        await expect(page.locator('h1')).toHaveText('Programación curso')

        // Verificar que los campos están deshabilitados inicialmente
        await expect(page.locator('input[name="version"]')).toBeDisabled()
        await expect(page.locator('input[name="name_course"]')).toBeDisabled()
        await expect(page.locator('input[name="code_course"]')).toBeDisabled()

        // Seleccionar un periodo académico
        await page.selectOption('select[name="period"]', '2024-1') 

        // Completar el campo de grupo y seleccionar un profesor
        await page.fill('input[name="group"]', 'Grupo A')
        await page.selectOption('select[name="professor_id"]', '1') 

        await page.click('button[type="submit"]')

        await expect(page.locator('.toast-success')).toHaveText('Se creo el curso programado de manera correcta')
        
        await expect(page).toHaveURL('/course-list')
    })

    test('should show error message on incomplete form submission', async ({ page }) => {

        await page.click('button[type="submit"]')

        await expect(page.locator('.toast-error')).toHaveText('Por favor, completa todos los campos requeridos')
    })
})
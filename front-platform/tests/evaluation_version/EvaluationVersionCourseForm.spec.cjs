import { test, expect }  from '@playwright/test'

test.describe('Evaluation Version Course Form', () => {
    test.beforeEach(async ({ page }) => {
        // Navegar a la página del formulario
        await page.goto('/evaluation-version-course') // Cambia esto a la ruta real
    })

    test('Should render evaluation version course form', async ({ page }) => {
        // Verificar que los campos del formulario están presentes
        await expect(page.locator('h1')).toHaveText('Creación evaluación versión curso')
        await expect(page.locator('input[name="name"]')).toBeDisabled()
        await expect(page.locator('input[name="code"]')).toBeDisabled()
        await expect(page.locator('textarea[name="description"]')).toBeDisabled()
        await expect(page.locator('input[name="credit"]')).toBeDisabled()
    })

    test('Should validate and add learning outcomes', async ({ page }) => {
        // Agregar el primer RA
        await page.fill('input[type="number"]', '20') // Establecer porcentaje
        await page.click('button:has-text("Agregar RA")') // Hacer clic en "Agregar RA"
        
        // Editar descripción del primer RA
        const raRow1 = page.locator('table tbody tr').nth(0)
        await raRow1.locator('input[name="description_learning"]').fill('RA1')

        // Agregar el segundo RA
        await page.fill('input[type="number"]', '80') // Establecer porcentaje
        await page.click('button:has-text("Agregar RA")') // Hacer clic en "Agregar RA"

        // Editar descripción del segundo RA
        const raRow2 = page.locator('table tbody tr').nth(1)
        await raRow2.locator('input[name="description_learning"]').fill('RA2')

        // Completar campos del formulario (suponiendo que no están deshabilitados)
        /*await page.fill('input[name="name"]', 'Curso de Prueba')
        await page.fill('input[name="code"]', 'C123')
        await page.fill('textarea[name="description"]', 'Descripción del curso')
        await page.fill('input[name="credit"]', '3')*/

        // Enviar el formulario
        await page.click('button:has-text("Guardar")')

        // Verificar que se ha enviado el objeto correcto (esto puede depender de cómo manejes las solicitudes en tu aplicación)
        
        // Aquí puedes usar un interceptor para verificar la solicitud enviada, si es necesario.
        /*const [request] = await Promise.all([
            page.waitForRequest(request => request.method() === 'POST' && request.url().includes('/ruta-de-envio')), // Cambia esto a la URL real
            page.click('button:has-text("Guardar")')
        ])

        const requestBody = JSON.parse(request.postData())
        
        expect(requestBody).toEqual({
            course: {
                id: 126,
            },
            learning_outcome: [
                {
                    code: "R.A.1",
                    description: "RA1",
                    percentage: "20%"
                },
                {
                    code: "R.A.2",
                    description: "RA2",
                    percentage: "80%"
                }
            ],
        })*/

        // Verificar redirección o mensaje de éxito (ajusta según tu aplicación)
        //await expect(page).toHaveURL('/course-list') // Cambia esto a la URL esperada después del envío
    })
})
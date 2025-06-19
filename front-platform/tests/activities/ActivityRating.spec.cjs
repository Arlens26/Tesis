import { test, expect } from '@playwright/test'

test.describe('Activity Rating Component', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/ruta-donde-se-encuentra-el-componente')
    })

    test('debería mostrar el título de Calificaciones', async ({ page }) => {
        const title = await page.locator('span:has-text("Calificicaciones")')
        await expect(title).toBeVisible()
    })

    test('debería mostrar un mensaje si no hay actividades programadas', async ({ page }) => {
        // Simula un estado donde no hay actividades
        await page.evaluate(() => {
            window.localStorage.setItem('estado', JSON.stringify({ actividades: [] }))
        })
        
        await page.reload()
        
        const message = await page.locator('div:has-text("Aún no hay actividades programadas para este curso")')
        await expect(message).toBeVisible()
    })

    test('debería mostrar las actividades en el combo box', async ({ page }) => {
        // Simula un estado con actividades
        await page.evaluate(() => {
            window.localStorage.setItem('estado', JSON.stringify({
                actividades: [
                    { id: 1, name: 'Actividad 1' },
                    { id: 2, name: 'Actividad 2' }
                ]
            }))
        })

        await page.reload()

        const select = await page.locator('#activity_course')
        await expect(select).toBeVisible()
        
        const options = await select.locator('option')
        const optionCount = await options.count()
        
        expect(optionCount).toBe(2)
        
        const firstOption = await options.nth(0).innerText()
        expect(firstOption).toContain('Actividad 1')
        
        const secondOption = await options.nth(1).innerText()
        expect(secondOption).toContain('Actividad 2')
    })

    test('debería actualizar la nota al cambiar el valor del input', async ({ page }) => {
        // Simula un estado con estudiantes y notas
        await page.evaluate(() => {
            window.localStorage.setItem('estado', JSON.stringify({
                estudiantes: [
                    { id: 1, name: 'Estudiante 1', nota: 3 },
                    { id: 2, name: 'Estudiante 2', nota: 4 }
                ]
            }))
        })

        await page.reload()

        const input = await page.locator('input[type="number"]:nth-of-type(1)')
        
        // Cambia la nota
        await input.fill('4')
        
        // Verifica que la nota se haya actualizado
        const updatedNote = await input.inputValue()
        expect(updatedNote).toBe('4')
    })
})
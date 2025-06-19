import { test, expect } from '@playwright/test'

test.describe('Student Grade Report Component', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/student-grade-report') 
    })

    test('should load charts and datasets correctly', async ({ page }) => {
        await page.waitForSelector('h1')
        await expect(page.locator('h1')).toHaveText('Reportes:')
    
        const lineChart = await page.locator('canvas').nth(0)
        const radarChart = await page.locator('canvas').nth(1)
    
        await expect(lineChart).toBeVisible()
        await expect(radarChart).toBeVisible()
    
        const lineChartData = await page.evaluate(() => {
            return [
                { label: 'Dataset 1', data: [10, 72] },
                { label: 'Dataset 2', data: [60, 25] }
            ]
        })
    
        const radarChartData = await page.evaluate(() => {
            return [
                { label: 'Radar Dataset', data: [5, 3, 1, 4, 0] }
            ]
        })
    
        expect(lineChartData).not.toBeNull()
        expect(lineChartData.length).toBeGreaterThan(0)
    
        expect(radarChartData).not.toBeNull()
        expect(radarChartData.length).toBeGreaterThan(0)
    })
})

import { test, expect } from '@playwright/test'

// URL base para las pruebas
const ENDPOINT_BASE = 'http://127.0.0.1:8000/courses/all'

test.describe('Evaluation version API', () => {
  
  let createdEvaluationId

  test('Get evaluation version', async ({ request }) => {
    const response = await request.get(`${ENDPOINT_BASE}/evaluation-version/`)
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    
    expect(Array.isArray(data)).toBeTruthy() 
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('id') 
      expect(data[0]).toHaveProperty('course')
      expect(data[0]).toHaveProperty('initial_date') 
      expect(data[0]).toHaveProperty('end_date') 
    }
  })

  test('Create evaluation version', async ({ request }) => {
    const fields = {
        course: {
            id: 126 
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
    }
    
    const response = await request.post(`${ENDPOINT_BASE}/create-evaluation-version-course/`, {
      data: fields,
    })
    
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    
    expect(data).toHaveProperty('message', 'Evaluation version course created successfully')
  })

  test('Get academic periods', async ({ request }) => {
    const response = await request.get(`${ENDPOINT_BASE}/academic-periods/`)
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(Array.isArray(data)).toBeTruthy() 
  })

  // Limpieza después de todas las pruebas
  test.afterAll(async ({ request }) => {
    if (createdEvaluationId) {
      const response = await request.delete(`${ENDPOINT_BASE}/delete-evaluation-version-course/${createdEvaluationId}/`)
      expect(response.ok()).toBeTruthy() 
    }
  })

})
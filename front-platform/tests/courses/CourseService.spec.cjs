import { test, expect }  from '@playwright/test'

const COURSE_ENDPOINT = `http://127.0.0.1:8000/courses/all/courses/`

let courseId

test.describe('Course API CRUD', () =>{

    test.beforeAll('Create course', async ({ request }) =>{
        const response = await request.post(COURSE_ENDPOINT, {
            data: {
                name: 'Curso de prueba',
                code: '751175',
                description: 'Descripción del curso de prueba',
                credit: '2',
            }
        })

        expect(response.ok()).toBeTruthy()
        if (!response.ok()) {
            //console.error('Error al crear curso:', response.status(), await response.text())
            throw new Error('Error al crear curso')
        }
        const data = await response.json()
        if (!data.id) {
            throw new Error('El curso no fue creado correctamente o no se devolvió el ID')
        }
        courseId = data.id
        expect(data.name).toBe('Curso de prueba')
    })

    test('Update course', async ({ request }) => {
        expect(courseId).toBeDefined()
        const response = await request.put(`${COURSE_ENDPOINT}${courseId}/`, {
          data: {
            name: 'Curso actualizado',
            code: '751188',
            description: 'Descripción actualizada',
            credit: '4',
          }
        })
        
        expect(response.ok()).toBeTruthy()
        const updatedData = await response.json()
        expect(updatedData.name).toBe('Curso actualizado')
    })

    test('Get course', async ({ request }) => {
        expect(courseId).toBeDefined()
        const response = await request.get(`${COURSE_ENDPOINT}${courseId}/`)

        expect(response.ok()).toBeTruthy()
        const data = await response.json()
        //console.log('Response get: ', data)
        expect(data.id).toBe(courseId)
    })

    test('Delete course', async ({ request }) => {
        expect(courseId).toBeDefined()
        const response = await request.delete(`${COURSE_ENDPOINT}${courseId}/`)

        expect(response.ok()).toBeTruthy()
        
        // Verificar que el curso ya no existe
        const getResponse = await request.get(`${COURSE_ENDPOINT}${courseId}/`)
        expect(getResponse.status()).toBe(404) // Devuelve 404 si no se encuentra
    })

})
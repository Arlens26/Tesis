import { test, expect } from '@playwright/test'

const PROFESSORS_ENDPOINT = 'http://127.0.0.1:8000/authentication/professors/'
const CREATE_SCHEDULED_COURSE_ENDPOINT = 'http://localhost:8000/courses/all/create-scheduled-course/'
const SCHEDULED_COURSE = 'http://127.0.0.1:8000/courses/all/scheduled-course/'
const EVALUATION_VERSION_DETAIL_ENDPOINT = 'http://localhost:8000/courses/all/scheduled-course-detail/get_details_by_evaluation_version/?evaluation_version_ids='

test.describe('API Service Tests', () => {
    test('Get professors', async ({ request }) => {
        const response = await request.get(PROFESSORS_ENDPOINT)
        expect(response.ok()).toBeTruthy()
        const data = await response.json()
        expect(Array.isArray(data)).toBeTruthy()
    })

    test('All scheduled courses', async ({ request }) => {
        const token = 'fb49c1715e4bb2a078201c27f558583658980f08' 
        const response = await request.get(SCHEDULED_COURSE, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
        expect(response.ok()).toBeTruthy()
        const data = await response.json()
        expect(Array.isArray(data)).toBeTruthy()
    })

    test('Create scheduled course', async ({ request }) => {
        
        const fields = {
            academic_period: {
                semester:'2', 
                year:'2024'
            },
            period: '2024-2',
            professor_id: '2',
            version_id: 30,
            group: 'P07'
        }
        const token = 'fb49c1715e4bb2a078201c27f558583658980f08'
        const response = await request.post(CREATE_SCHEDULED_COURSE_ENDPOINT, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            data: fields
        })
        expect(response.ok()).toBeTruthy()
        //const data = await response.json()
        //expect(data).toHaveProperty('id') 
    })

    test('Get evaluation version detail by version ids', async ({ request }) => {
        const versionIds = '3,4' 
        const token = 'fb49c1715e4bb2a078201c27f558583658980f08' 
        const response = await request.get(`${EVALUATION_VERSION_DETAIL_ENDPOINT}${versionIds}`, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
        expect(response.ok()).toBeTruthy()
        const data = await response.json()
        // verificar que scheduled course sea un array
        expect(Array.isArray(data.scheduled_courses)).toBeTruthy()
        // Al menos un curso programado
        expect(data.scheduled_courses.length).toBeGreaterThan(0)
    })
})
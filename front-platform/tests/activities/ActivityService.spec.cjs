import { test, expect }  from '@playwright/test'

const ACTIVITY_ENDPOINT = 'http://localhost:8000/activities/all/activities/'
const ACTIVITY_DETAIL_ENDPOINT = 'http://localhost:8000/activities/all/activity-evaluation-detail/'
const ACTIVITY_EVALUATION_VERSION_DETAIL_ENDPOINT = 'http://127.0.0.1:8000/activities/all/activity-version-detail/get_details_by_evaluation_version_detail/?evaluation_version_detail_ids='
const ACTIVITY_SETTING_ENDPOINT = 'http://127.0.0.1:8000/activities/all/activity-setting/save_activities/'

test.describe('Activity Setting Tests', () => {

    test('Create or update activities and activity evaluation details', async ({ request }) => {
        const activitiesData = [
            {
                activities: {
                    name: 'Taller 2',
                    description: 'Segundo taller',
                    scheduled_course: 3
                },
                activity_evaluation_detail: {
                    activity_id: 2,
                    version_evaluation_detail_id: 10,
                    percentage: 15
                }
            },
            {
                activities: {
                    name: 'Parcial 1',
                    description: 'Primer parcial',
                    scheduled_course: 4
                },
                activity_evaluation_detail: {
                    version_evaluation_detail_id: 10,
                    percentage: 35
                }
            },
            {
                activities: {
                    name: 'Parcial 2',
                    description: 'Segundo parcial',
                    scheduled_course: 4
                },
                activity_evaluation_detail: {
                    version_evaluation_detail_id: 11,
                    percentage: 45
                }
            }
        ]

        const response = await request.post(ACTIVITY_SETTING_ENDPOINT, {
            data: activitiesData,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        expect(response.ok()).toBeTruthy()
        const responseData = await response.json()
        expect(responseData).toBeDefined()
    })

})

test.describe('API Tests', () => {

    test('Fetch activities', async ({ request }) => {
        const response = await request.get(ACTIVITY_ENDPOINT)
        expect(response.ok()).toBeTruthy()
        const data = await response.json()
        expect(data).toBeDefined()
    })

    test('Fetch activity detail', async ({ request }) => {
        const response = await request.get(ACTIVITY_DETAIL_ENDPOINT)
        expect(response.ok()).toBeTruthy()
        const data = await response.json()
        expect(data).toBeDefined()
    })

    /*test('Create activity', async ({ request }) => {
        const newActivity = { name: 'Actividad de prueba', description: 'Descripción de prueba' }
        const response = await request.post(ACTIVITY_ENDPOINT, {
            data: newActivity,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        expect(response.ok()).toBeTruthy()
        //const data = await response.json()
        //expect(data).toHaveProperty('id') 
    })*/

    test('Fetch activity evaluation version detail', async ({ request }) => {
        const versionDetailIds = [1, 2] 
        const token = '9bbba2ccc9c5da33caf49cbe6920fdff05369bd3' 
        const response = await request.get(`${ACTIVITY_EVALUATION_VERSION_DETAIL_ENDPOINT}${versionDetailIds.join(',')}`, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
        expect(response.ok()).toBeTruthy()
        const data = await response.json()
        expect(data).toBeDefined()
    })

})
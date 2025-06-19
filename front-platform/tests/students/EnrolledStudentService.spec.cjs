import { test, expect } from '@playwright/test'

const GRADE_DETAIL_LEARNING_OUTCOME = 'http://localhost:8000/activities/all/grade-detail-learning-outcome/'
const STUDENT_ENROLLED_COURSE = 'http://127.0.0.1:8000/courses/all/student-enrolled-course/'
const UPDATE_STATUS_STUDENT_ENROLLED_COURSE = 'http://127.0.0.1:8000/courses/all/student-enrolled-course/update-status/'
const CREATE_STUDENT_ENROLLED_COURSE = 'http://127.0.0.1:8000/courses/all/create-student-enrolled-course/'
const STUDENT_GRADE_REPORT = 'http://127.0.0.1:8000/courses/all/student-report/'

test.describe('Enrolled Student API Service Tests', () => {
    test('Get student enrolled courses', async ({ request }) => {
        const response = await request.get(STUDENT_ENROLLED_COURSE)
        expect(response.ok()).toBeTruthy()
        const data = await response.json()
        expect(Array.isArray(data)).toBeTruthy()
    })

    test('Update student enrolled status', async ({ request }) => {
        const data = {
            student_id: 8,
            scheduled_course_id: 43,
            status: true
        }
        const response = await request.put(UPDATE_STATUS_STUDENT_ENROLLED_COURSE, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        })
        expect(response.ok()).toBeTruthy()
    })

    test('Get grade detail', async ({ request }) => {
        const response = await request.get(GRADE_DETAIL_LEARNING_OUTCOME)
        expect(response.ok()).toBeTruthy()
        const data = await response.json()
        expect(Array.isArray(data)).toBeTruthy()
    })

    test('Update grade detail', async ({ request }) => {
        const gradeId = 1 
        const data = {
            grade: 2
        }
        const response = await request.put(`${GRADE_DETAIL_LEARNING_OUTCOME}${gradeId}/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        })
        expect(response.ok()).toBeTruthy()
    })

    test('Create student enrolled course', async ({ request }) => {
        const selectedScheduledCourseId = 43 
        const students = [
            {
                first_name: 'John',
                last_name: 'Daves',
                email: 'john.daves@example.com',
                code_schedule: 'P101',
                code: '1834585',
                password: 'password123'
            },
            {
                first_name: 'Jane',
                last_name: 'Smith',
                email: 'jane.smith@example.com',
                code_schedule: 'P102',
                code: '1989012',
                password: 'password456'
            }
        ]
    
        const studentEnrolledData = {
            scheduled_course_id: selectedScheduledCourseId,
            students: students
        }
    
        const response = await request.post(CREATE_STUDENT_ENROLLED_COURSE, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: studentEnrolledData
        })
    
        expect(response.ok()).toBeTruthy()
    })

    test('Get student grade report', async ({ request }) => {
        const response = await request.get(STUDENT_GRADE_REPORT)
        expect(response.ok()).toBeTruthy()
        const data = await response.json()
        expect(Array.isArray(data)).toBeTruthy()
    })
})

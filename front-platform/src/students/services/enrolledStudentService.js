const GRADE_DETAIL_LEARNING_OUTCOME = `http://localhost:8000/activities/all/grade-detail-learning-outcome/`
const STUDENT_ENROLLED_COURSE = `http://127.0.0.1:8000/courses/all/student-enrolled-course/`
const UPDATE_STATUS_STUDENT_ENROLLED_COURSE = `http://127.0.0.1:8000/courses/all/student-enrolled-course/update-status/`
const CREATE_STUDENT_ENROLLED_COURSE = `http://127.0.0.1:8000/courses/all/create-student-enrolled-course/`
const STUDENT_GRADE_REPORT = `http://127.0.0.1:8000/courses/all/student-report/`

export const getStudentEnrolledCourseFetch = () => {
    return fetch(STUDENT_ENROLLED_COURSE)
        .then(res => {
            if (!res.ok) {
                throw new Error('Error fetching student enrolled courses')
            }
            return res.json()
        })
}

export const updateStudentEnrolledStatusFetch = (data) => {
    return fetch(UPDATE_STATUS_STUDENT_ENROLLED_COURSE, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el estado del estudiante')
        }
    })
}

export const getGradeDetailFetch = (token) => {
    return fetch(GRADE_DETAIL_LEARNING_OUTCOME, {
            method: 'GET',
            headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json' 
            },
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Error fetching grade detail')
            }
            return res.json()
        })
}

export const updateGradeDetailFetch = (gradeId, data) => {
    return fetch(`${GRADE_DETAIL_LEARNING_OUTCOME}${gradeId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar la calificación')
        }
    })
}

export const createStudentEnrolledCourseFetch = (fields) => {
    return fetch(CREATE_STUDENT_ENROLLED_COURSE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fields)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar los datos')
        }
        return response.json()
    })
}

export const getStudentGradeReportFetch = () => {
    return fetch(STUDENT_GRADE_REPORT)
        .then(res => {
            if (!res.ok) {
                throw new Error('Error fetching student grade report')
            }
            return res.json()
        })
}
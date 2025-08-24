const BASE_URL = import.meta.env.VITE_API_BASE_URL

const PROFESSORS_ENDPOINT = `${BASE_URL}/authentication/professors/`
const CREATE_SCHEDULED_COURSE_ENDPOINT = `${BASE_URL}/courses/all/create-scheduled-course/`
const SCHEDULED_COURSE = `${BASE_URL}/courses/all/scheduled-course/`
const EVALUATION_VERSION_DETAIL_ENDPOINT = `${BASE_URL}/courses/all/scheduled-course-detail/get_details_by_evaluation_version/?evaluation_version_ids=`

export const professorsFetch = () => {
    return fetch(PROFESSORS_ENDPOINT)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching professors')
            }
            return response.json()
        })
}

export const allScheduledCourseFetch = (token) => {
    return fetch(SCHEDULED_COURSE, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json' 
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error fetching scheduled courses')
        }
        return response.json()
    })
}

export const createScheduledCourseFetch = (fields) => {
    return fetch(CREATE_SCHEDULED_COURSE_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fields)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Error creating scheduled course')
        }
        return res.json()
    })
}

export const evaluationVersionDetailFetch = (versionIds, token) => {
    return fetch(`${EVALUATION_VERSION_DETAIL_ENDPOINT}${versionIds}`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        },
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Error fetching evaluation version detail`)
        }
        return res.json()
    })
}
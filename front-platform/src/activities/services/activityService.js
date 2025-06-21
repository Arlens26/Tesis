const ACTIVITY_ENDPOINT = `http://localhost:8000/activities/all/activities/`
const ACTIVITY_DETAIL_ENDPOINT = `http://localhost:8000/activities/all/activity-evaluation-detail/`
const ACTIVITY_EVALUATION_VERSION_DETAIL_ENDPOINT = `http://127.0.0.1:8000/activities/all/activity-version-detail/get_details_by_evaluation_version_detail/?evaluation_version_detail_ids=`
const SETTING_ACTIVITY_ENDPOINT = `http://127.0.0.1:8000/activities/all/activity-setting/save_activities/`
const DELETE_SETTINGACTIVITY_ENDOPOINT = `http://127.0.0.1:8000/activities/all/activity-evaluation-detail/delete_by_activity_and_versions/`

export const activityFetch = () => {
    return fetch(ACTIVITY_ENDPOINT)
    .then(response => {
        if(!response.ok){
            throw new Error('Actividad no obtenida')
        }
        return response.json()
    })
}

export const settingActivityFetch = (fields) => {
    return fetch(SETTING_ACTIVITY_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(fields)
    })
    .then(response => {
        if(!response.ok){
            throw new Error('Configuración de actividad no obtenida')
        }
    })
}

export const deleteSettingActivityFetch = (activity_id, version_evaluation_detail_ids, token) => {
    return fetch(DELETE_SETTINGACTIVITY_ENDOPOINT, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            activity_id,
            version_evaluation_detail_ids
        })
    })
    .then(response => {
        if(!response.ok){
            throw new Error('La actividad no pudo ser eliminada de la configuración')
        }
    })
}

export const activityDetailFetch = () => {
    return fetch(ACTIVITY_DETAIL_ENDPOINT)
    .then(response => {
        if(!response.ok){
            throw new Error('Detalle de actividad no obtenida')
        }
        return response.json()
    })
}

export const createActivityFetch = (fields) => {
    return fetch(ACTIVITY_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(fields)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar los datos de la actividad')
        }
        return response.json()
    })
}

export const activityEvaluationVersionDetailFetch = (versionDetailIds, token) => {
    const idsString = versionDetailIds.join(',')
    return fetch(`${ACTIVITY_EVALUATION_VERSION_DETAIL_ENDPOINT}${idsString}`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
    })
}
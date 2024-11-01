import { useContext, useState } from "react"
import { AuthContext } from "../context/user"

export function useActivities(){
    const ACTIVITY_ENDPOINT = `http://localhost:8000/activities/all/activities/`
    const ACTIVITY_DETAIL_ENDPOINT = `http://localhost:8000/activities/all/activity-evaluation-detail/`
    const ACTIVITY_EVALUATION_VERSION_DETAIL_ENDPOINT = `http://127.0.0.1:8000/activities/all/activity-version-detail/get_details_by_evaluation_version_detail/?evaluation_version_detail_ids=`
    const [activities, setActivities] = useState({})
    const [activityDetail, setActivityDetail] = useState({})

    const { user } = useContext(AuthContext)
    const [activityEvaluationDetail, setActivityEvaluationDetail] = useState({})
    console.log('Activity evaluation detail: ', activityEvaluationDetail)

    const getActivities = () => {
        fetch(ACTIVITY_ENDPOINT)
        .then(res => res.json())
        .then(json => {
            console.log(json)
            setActivities(json)
        })
    }

    const getActivityDetail = () => {
        fetch(ACTIVITY_DETAIL_ENDPOINT)
        .then(res => res.json())
        .then(json => {
            console.log(json)
            setActivityDetail(json)
        })
    }

    const createActivity = (fields) => {
        return fetch(ACTIVITY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(fields)
        })
        .then(response => {
            if(!response.ok){
                throw new Error('Error al enviar los datos de la actividad')
            }
            return response.json()
        })
        .then(data => {
            console.log('Datos enviados exitosamente', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    const getActivityEvaluationVersionDetail = (versionDetailIds) => {
        const idsString = versionDetailIds.join(',')
        return fetch(`${ACTIVITY_EVALUATION_VERSION_DETAIL_ENDPOINT}${idsString}`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${user.token}`,
            'Content-Type': 'application/json' 
          },
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
          return response.json()
        })
        .then(json => {
          console.log('Preview json activity detail:',json)
          const { activity_evaluation_detail } = json
          console.log('New activity evaluation version detail: ', activity_evaluation_detail)
          setActivityEvaluationDetail(activity_evaluation_detail)
        })
        .catch(error => {
          console.error("Error fetching evaluation version detail:", error)
          throw error
        })
      }

    return { getActivities, activities, createActivity, 
             getActivityDetail, activityDetail, getActivityEvaluationVersionDetail, activityEvaluationDetail }
}
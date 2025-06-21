import { useContext, useState } from "react"
import { AuthContext } from "../../auth/context/user"
import { activityFetch, settingActivityFetch, deleteSettingActivityFetch,
         activityDetailFetch, createActivityFetch, 
         activityEvaluationVersionDetailFetch } from '../services/activityService'

export function useActivities(){
    
    const [activities, setActivities] = useState({})
    const [activityDetail, setActivityDetail] = useState({})

    const { user } = useContext(AuthContext)
    const [activityEvaluationDetail, setActivityEvaluationDetail] = useState({})
    console.log('Activity evaluation detail: ', activityEvaluationDetail)

    const getActivities = () => {
        activityFetch()
          .then(json => {
            setActivities(json)
          })
          .catch(error => {
            throw new Error('Error al obtener los datos de los actividades', error)
          })
    }

    const getActivityDetail = () => {
        activityDetailFetch()
          .then(json => {
            setActivityDetail(json)
          })
          .catch(error => {
            throw new Error('Error al obtener los datos de detalle de actividades', error)
          })
    }

    const createActivity = (fields) => {
      return createActivityFetch(fields)
          .then(data => {
              console.log('Datos enviados exitosamente', data)
          })
          .catch(error => {
            throw new Error('Error al crear la actividad', error)
          })
    }

    const settingActivity = (fields) => {
      return settingActivityFetch(fields)
          .then(data => {
              console.log('Datos enviados exitosamente', data)
          })
          .catch(error => {
            throw new Error('Error al configurar la actividad', error)
          })
    }

    const deleteSettingActivity = (activityId, versionEvaluationDetailIds) => {
      return deleteSettingActivityFetch(activityId, versionEvaluationDetailIds, user.token)
      .then(data => {
        console.log('Datos eliminados exitosamente', data)
      })
      .catch(error => {
        throw new Error('Error al eliminar una actividad de la configuración', error)
      })
    }

    const getActivityEvaluationVersionDetail = (versionDetailIds) => {
        activityEvaluationVersionDetailFetch(versionDetailIds, user.token)
        .then(json => {
          console.log('Preview json activity detail:', json)
          const { activity_evaluation_detail } = json
          console.log('New activity evaluation version detail: ', activity_evaluation_detail)
          setActivityEvaluationDetail(activity_evaluation_detail)
        })
        .catch(error => {
          throw new Error('Error al obtener el detalle de la versión de evaluación', error)
        })
    }

    return { getActivities, activities, createActivity, settingActivity, deleteSettingActivity,
             getActivityDetail, activityDetail, getActivityEvaluationVersionDetail, activityEvaluationDetail }
}
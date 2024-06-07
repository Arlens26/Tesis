import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useScheduledCourse } from "../hooks/useSheduledCourse"
import { useEvaluationVersionCourse } from "../hooks/useEvaluationVersionCourse"
import { useActivities } from "../hooks/useActivities"
import { ActivityForm } from "./ActivityForm"

export function Activity() {

    const { getEvaluationVersionDetail, learningOutComes, percentages, scheduledCourse, evaluationVersionDetail } = useScheduledCourse()   
    const { getActivities, activities } = useActivities()
    console.log(activities)
    const location = useLocation()
    
    const { evaluationVersion } = useEvaluationVersionCourse()
    //const [totalPercentage, setTotalPercentage] = useState(0)
    const [activityDetailList, setActivityDetailList] = useState([])
    //console.log(evaluationVersionDetail)
    //console.log(learningOutComes)
    //console.log(percentages)
    const [newActivities, setNewActivities] = useState([])
    //const [activityList, setActivityList] = useState([])
    
    useEffect(() =>{
        getActivities()
        const course_id = location.state.course_id
        console.log(course_id)
        //console.log(evaluationVersion)
        if (course_id) {
            getEvaluationVersionDetail(course_id)
        } else {
            console.error("No se proporcionó un course_id en el estado de la ubicación.")
        }
    }, [location.state?.course_id, evaluationVersion])

    const handleSubmit = (event) => {
      event.preventDefault()

    const buildActivityDetailList = () => {
      return activityDetailList.map((detail, index) => (console.log(detail) ,{
        version_detail_id: evaluationVersionDetail[index]?.id, 
        activity_id: activities[index]?.id,
        percentage: detail.percentages
      }))
    }

      const buildActivity = () => {
        return newActivities.map(activity => ({
          name: activity.name,
          description: activity.description
        }))
      }

      const activity = {
        activity: buildActivity()
      }
      console.log(activity)

      // Json para detalle de activides de evaluación
      const activityDetail = {
        activity_detail: buildActivityDetailList()
      }
      console.log(activityDetail)

      
    }

    const handleActivity = () => {
      setNewActivities([...newActivities, { name: '', description: '', percentages: [] }])
      console.log(newActivities)
    }

    const handlePercentage = (activityIndex, learningOutComeIndex, newPercentage, isNewActivity = false) => {
      console.log(activityIndex, learningOutComeIndex)
      const learningOutcomeId = Object.keys(learningOutComes)[learningOutComeIndex]
      const percentageLearningOutCome = parseInt(percentages[learningOutcomeId]?.percentage)
  
      const updatedDetailList = [...activityDetailList]
      const updatedNewActivities = [...newActivities]

      if (isNewActivity) {
        if (!updatedNewActivities[activityIndex]) {
            updatedNewActivities[activityIndex] = { percentages: [] }
        }
      } else {
          if (!updatedDetailList[activityIndex]) {
              updatedDetailList[activityIndex] = { percentages: [] }
          }
      }
  
      const allActivities = [...updatedDetailList, ...updatedNewActivities]
      //const totalActivitiesCount = updatedDetailList.length + updatedNewActivities.length
  
      const actualActivityIndex = isNewActivity ? updatedDetailList.length + activityIndex : activityIndex

      if (!allActivities[actualActivityIndex]) {
          allActivities[actualActivityIndex] = { percentages: [] }
      }
  
      const updatedMatrix = allActivities.map(detail => [...(detail.percentages || [])])
      //console.log(updatedMatrix)
  
      if (!isNaN(newPercentage) && newPercentage >= 0 && newPercentage <= percentageLearningOutCome) {
          const columnSum = updatedMatrix.reduce((acc, row) => acc + parseInt(row[learningOutComeIndex] || 0), 0)
          //console.log(columnSum)
          //console.log(percentageLearningOutCome)
          
          if (columnSum - (updatedMatrix[actualActivityIndex][learningOutComeIndex] || 0) + parseInt(newPercentage) <= percentageLearningOutCome) {
              if (isNewActivity) {
                  updatedNewActivities[activityIndex].percentages[learningOutComeIndex] = newPercentage
                  setNewActivities(updatedNewActivities)
                  console.log(updatedNewActivities)
              } else {
                  updatedDetailList[activityIndex].percentages[learningOutComeIndex] = newPercentage
                  setActivityDetailList(updatedDetailList)
                  console.log(updatedDetailList)
              }
          } else {
              console.log(`El porcentaje total para el RA ${learningOutComes[learningOutcomeId]?.code} no puede exceder ${percentageLearningOutCome}%`)
          }
      }
  }

    const calculateTotalPercentage = (percentages) => {
      return percentages.reduce((acc, percentage) => acc + parseInt(percentage || 0), 0)
    }

    const scheduledCourseIds = scheduledCourse.map(scheduled_course => scheduled_course.id)
    //console.log(scheduledCourseIds)

    return(
      <div className="flex flex-col gap-4">
        <span>Configuración evaluación</span>
        <ActivityForm/>
        <form className='form flex flex-col gap-4' onSubmit={handleSubmit}>
          <button 
            className='bg-btn-create opacity-80 px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'
            onClick={handleActivity}
            type="button"
            >
            <svg xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>
            <span>Crear actividad</span>
          </button>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Actividad
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Descripción
                                    </th>
                                    {
                                      Object.keys(learningOutComes).map(id => (
                                        <th key={id} scope="col" className="px-6 py-3">
                                          {learningOutComes[id]?.code || 'Cargando...'}
                                        </th>
                                      ))
                                    }
                                    <th scope="col" className="px-6 py-3">
                                        Porcentaje
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                              {
                               Object.keys(activities).filter(id => scheduledCourseIds.includes(activities[id].scheduled_course)).map((id, activityIndex )=> (
                                  <tr 
                                  key={activities[id].id} 
                                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td name='name' scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                      <input type="text" value={activities[id].name} placeholder='Nombre de la actividad' name='name' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>                               
                                    </td>
                                    <td name='description' scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                      <textarea value={activities[id].description} placeholder='Descripción' name='description' rows="1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>           
                                    </td>
                                    {Object.entries(learningOutComes).map((learningOutcomeId, learningOutComeIndex) => (
                                        <td key={learningOutcomeId} className="px-6 py-4">
                                            <input
                                                name={`learning_percentage${learningOutComeIndex}_${learningOutcomeId}`}
                                                type="text"
                                                value={activityDetailList[activityIndex]?.percentages[learningOutComeIndex] || ''}
                                                onChange={(e) => handlePercentage(activityIndex, learningOutComeIndex, e.target.value)}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                        </td>
                                    ))}
                                    <td className="px-6 py-4">
                                        {calculateTotalPercentage(activityDetailList[activityIndex]?.percentages || [])}%
                                    </td>
                                    <td key={id} className="px-6 py-4">
                                          
                                    </td>
                                  </tr>
                                ))
                              }
                              {newActivities.map((activity, activityIndex) => (
                                <tr key={`newActivity_${activityIndex}`} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <input type="text" value={activity.name} placeholder='Nombre de la actividad' name={`new_name_${activityIndex}`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => {
                                            const updatedActivities = [...newActivities];
                                            updatedActivities[activityIndex].name = e.target.value;
                                            setNewActivities(updatedActivities);
                                        }} />
                                    </td>
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <textarea value={activity.description} placeholder='Descripción' name={`new_description_${activityIndex}`} rows="1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => {
                                            const updatedActivities = [...newActivities];
                                            updatedActivities[activityIndex].description = e.target.value;
                                            setNewActivities(updatedActivities);
                                        }} />
                                    </td>
                                    {Object.entries(learningOutComes).map((learningOutcomeId, learningOutComeIndex) => (
                                        <td key={learningOutcomeId} className="px-6 py-4">
                                            <input
                                                name={`new_learning_percentage${learningOutComeIndex}_${learningOutcomeId}`}
                                                type="text"
                                                value={activity.percentages[learningOutComeIndex] || ''}
                                                onChange={(e) => {
                                                    const updatedActivities = [...newActivities];
                                                    if (!updatedActivities[activityIndex].percentages) {
                                                        updatedActivities[activityIndex].percentages = []
                                                    }
                                                    updatedActivities[activityIndex].percentages[learningOutComeIndex] = e.target.value
                                                    setNewActivities(updatedActivities)
                                                    handlePercentage(activityIndex, learningOutComeIndex, e.target.value, true)
                                                }}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            />
                                        </td>
                                    ))}
                                    <td className="px-6 py-4">
                                        {calculateTotalPercentage(activity.percentages || [])}%
                                    </td>
                                    <td className="px-6 py-4">

                                    </td>
                                </tr>
                            ))}
                              <tr key={`totalPercentageRa`} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        PORCENTAJE
                                    </th>
                                    <td className="px-6 py-4">
                                      
                                    </td>
                                    {
                                      Object.keys(percentages).map(id => (
                                      <td key={id} className="px-6 py-4">
                                        {parseFloat(percentages[id]?.percentage).toFixed(0)}%
                                      </td>
                                    ))
                                  }
                                    <td className="px-6 py-4">
                                        100%
                                    </td>
                                    <td className="px-6 py-4">
                                        
                                    </td>
                                  </tr>
                            </tbody>
            </table>  
            <button type='submit' className='bg-btn-create opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100'>Configurar Actividad</button>                      
        </form>
      </div>
    )
  }
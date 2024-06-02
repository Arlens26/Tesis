import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useScheduledCourse } from "../hooks/useSheduledCourse"
import { useEvaluationVersionCourse } from "../hooks/useEvaluationVersionCourse"
import { useActivities } from "../hooks/useActivities"
import { ActivityForm } from "./ActivityForm"

export function Activity() {

    const { getEvaluationVersionDetail, learningOutComes, percentages, scheduledCourse, evaluationVersionDetail } = useScheduledCourse()   
    const { getActivities, activities } = useActivities()
    
    const location = useLocation()
    
    const { evaluationVersion } = useEvaluationVersionCourse()
    //const [totalPercentage, setTotalPercentage] = useState(0)
    const [activityDetailList, setActivityDetailList] = useState([])
    console.log(evaluationVersionDetail)
    console.log(learningOutComes)
    console.log(percentages)
    
    useEffect(() =>{
        getActivities()
        const course_id = location.state.course_id
        console.log(course_id)
        console.log(evaluationVersion)
        if (course_id) {
            getEvaluationVersionDetail(course_id)
        } else {
            console.error("No se proporcionó un course_id en el estado de la ubicación.")
        }
    }, [location.state?.course_id, evaluationVersion])

    const handleSubmit = (event) => {
      event.preventDefault()
      const fields = Object.fromEntries(new window.FormData(event.target))
      console.log(fields)

      const buildActivityDetailList = () => {
        return activityDetailList.map((detail, index) => (console.log(detail) ,{
          version_detail_id: evaluationVersionDetail[index]?.id, 
          activity_id: activities[index]?.id,
          percentage: calculateTotalPercentage(detail.percentages)
        }))
      }

      // Json para detalle de activides de evaluación
      const activityDetail = {
        activity_detail: buildActivityDetailList()
      }
      console.log(activityDetail)

      
    }

    const handlePercentage = (activityIndex, learningOutComeIndex, newPercentage) => {
      console.log(activityIndex, learningOutComeIndex);
      const learningOutcomeId = Object.keys(learningOutComes)[learningOutComeIndex];
      const percentageLearningOutCome = parseInt(percentages[learningOutcomeId]?.percentage);
    
      const updatedDetailList = [...activityDetailList]
      if (!updatedDetailList[activityIndex]) {
        updatedDetailList[activityIndex] = { percentages: [] };
      }
      const updatedMatrix = updatedDetailList.map(detail => [...(detail.percentages || [])])
    
      if (!isNaN(newPercentage) && newPercentage >= 0 && newPercentage <= percentageLearningOutCome) {
        // Calcular la suma actual de la columna correspondiente
        const columnSum = updatedMatrix.reduce((acc, row) => acc + parseInt(row[learningOutComeIndex] || 0), 0)
        // Verificar que la suma no exceda el percentageLearningOutCome
        if (columnSum - (updatedMatrix[activityIndex][learningOutComeIndex] || 0) + parseInt(newPercentage) <= percentageLearningOutCome) {
          if (!updatedDetailList[activityIndex]) {
            updatedDetailList[activityIndex] = { percentages: [] };
          }
          updatedDetailList[activityIndex].percentages[learningOutComeIndex] = newPercentage
          setActivityDetailList(updatedDetailList);
          console.log(activityDetailList);
        } else {
          console.log(`El porcentaje total para el RA ${learningOutComes[learningOutcomeId]?.code} no puede exceder ${percentageLearningOutCome}%`)
          //alert(`El porcentaje total para el RA ${learningOutComes[learningOutcomeId]?.code} no puede exceder ${percentageLearningOutCome}%`)
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
                                      {activities[id].name}
                                    </td>
                                    <td name='description' scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                      {activities[id].description}
                                    </td>
                                    {Object.entries(learningOutComes).map((learningOutcomeId, learningOutComeindex) => (
                                        <td key={learningOutcomeId} className="px-6 py-4">
                                            <input
                                                name={`learning_percentage${learningOutComeindex}_${learningOutcomeId}`}
                                                type="text"
                                                value={activityDetailList[activityIndex]?.percentages[learningOutComeindex] || ''}
                                                onChange={(e) => handlePercentage(activityIndex, learningOutComeindex, e.target.value)}
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
                              <tr key={`totalPercentageRa`} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Porcentaje
                                    </th>
                                    <td className="px-6 py-4">
                                      
                                    </td>
                                    {
                                      Object.keys(percentages).map(id => (
                                      <td key={id} className="px-6 py-4">
                                        {percentages[id]?.percentage}
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
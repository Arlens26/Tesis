import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useScheduledCourse } from "../../scheduled_course/hooks/useSheduledCourse"
import { useActivities } from "../hooks/useActivities"
import { CreateIcon, DeleteIcon, SettingsCheckIcon } from "../../components/Icons"
import { toast } from "sonner"
import { GoBackButton } from "../../components/GoBackButton"

export function Activity() {

    const { getEvaluationVersionDetail,
      evaluationVersionDetail, newScheduledCourse, getAllScheduledCourse } = useScheduledCourse()
    const { getActivityEvaluationVersionDetail, activityEvaluationDetail } = useActivities()
    console.log('Activity evaluation detail: ', activityEvaluationDetail)
    console.log('New scheduled course estado: ', newScheduledCourse)
    console.log('Evaluation version detail: ', evaluationVersionDetail) 
    const location = useLocation()
    const [newActivities, setNewActivities] = useState([])
    console.log('New activities estado: ', newActivities)

    const [selectedScheduledId, setSelectedScheduledId] = useState(null)
    console.log('Selected scheduled id: ', selectedScheduledId)
    const [selectedVersionId, setSelectedVersionId] = useState(null)
    console.log('Selected version id: ', selectedVersionId)
    const groupedCourse = location.state?.course || []
    console.log('Grouped course: ', groupedCourse) 
    const [evaluationDetailIds, setEvaluationDetailIds] = useState([])
    console.log('Ids evaluation version detail: ', evaluationDetailIds)

    const [totalPercentageByActivity, setTotalPercentageByActivity] = useState(0)
    const [totalPercentageByLearningOutCome, setTotalPercentageByLearningOutCome] = useState({})
    console.log('Total percentage by learning outcome: ', totalPercentageByLearningOutCome)
    const [totalPercentage, setTotalPercentage] = useState(0)

    
    const [filteredPercentages, setFilteredPercentages] = useState([])
    console.log('Filtered percentages: ', filteredPercentages)

    const filteredDetails = Object.values(evaluationVersionDetail).filter(detail => detail.evaluation_version_id === selectedVersionId)
    console.log('Filtered Details: ', filteredDetails)

    // Calcular la suma de los porcentajes
    /*useEffect(() => {
      const total = filteredDetails.reduce((acc, detail) => {
          const detailId = detail.id
          const detailPercentage = parseFloat(detail.percentage.percentage) || 0
          return acc + (totalPercentageByLearningOutCome[detailId] || 0) + detailPercentage
      }, 0)
      setTotalPercentage(total)
    }, [filteredDetails, totalPercentageByLearningOutCome])*/

    useEffect(() =>{
        getAllScheduledCourse()
        const evaluationVersionIds = groupedCourse.flatMap(course => 
            course.details.map(detail => detail.evaluation_version_id)
        )
        const filteredEvaluationVersionIds = evaluationVersionIds.filter(id => id !== undefined)
        console.log('Filtered evaluation version ids: ', filteredEvaluationVersionIds)
        console.log('course period', groupedCourse[0].period)
        getEvaluationVersionDetail(filteredEvaluationVersionIds, groupedCourse[0].period)
        getActivityEvaluationVersionDetail(evaluationDetailIds)
    }, [selectedScheduledId])

    useEffect(() => {
      if(newScheduledCourse && newScheduledCourse.length > 0 && selectedScheduledId == null){
        setSelectedScheduledId(newScheduledCourse[0].id)
        console.log('Scheduled course ID seleccionado:', selectedScheduledId)
      }
    }, [newScheduledCourse])

    const handleSelectChange = (e) => {
      const selectedId = e.target.value
      console.log('Selected Id: ', selectedId)
      const selectedDetail = newScheduledCourse.find(detail => detail.id === parseInt(selectedId))
  
      setSelectedScheduledId(selectedId)
  
      if (selectedDetail) {
          setSelectedVersionId(selectedDetail.evaluation_version_id)
          const filteredEvaluationVersionDetailIds = evaluationVersionDetail.map(detail => detail.id)
          setEvaluationDetailIds(filteredEvaluationVersionDetailIds)
      }
    }

    const handleSubmit = (event) => {
      event.preventDefault()

      const buildActivity = () => {
        return newActivities.map(activity => ({
          name: activity.name,
          description: activity.description,
          activity_evaluation_detail: []
        }))
      }

      const activity = {
        activity: buildActivity()
      }
      console.log(activity)
    }

    const handleActivity = () => {
      setNewActivities([...newActivities, { 
        name: '', description: '', scheduled_course_id: selectedScheduledId, 
        activity_evaluation_detail: [] 
      }])
      console.log('New Activities: ', newActivities)
    }

    useEffect(() => {
      if(filteredPercentages){
        const initialTotals = filteredPercentages.reduce((acc, item) => {
          acc[item.activity_id] = (acc[item.activity_id] || 0) + item.percentage
          return acc
        }, {})
        setTotalPercentageByActivity(initialTotals)
      }
    }, [filteredPercentages])

    const handlePercentageChange = (activityId, versionDetailId, value, newPercentage) => {
      const updatedPercentage = parseFloat(value) || 0
      const maxAllowedPercentage = filteredDetails.find(detail => detail.id === versionDetailId)?.percentage || 0
      console.log('Max allowed percentage: ', maxAllowedPercentage)
    
      setFilteredPercentages(prevPercentages => {
        const updatedPercentages = prevPercentages.map(percentage => {
          if (percentage.activity_id === activityId && percentage.version_evaluation_detail_id === versionDetailId) {
            return {
              ...percentage,
              percentage: updatedPercentage,
            }
          }
          return percentage
        })
    
        const totalForLearningOutcome = updatedPercentages
          .filter(item => item.version_evaluation_detail_id === versionDetailId)
          .reduce((sum, item) => sum + item.percentage, 0)
        console.log('Total for learingOutcome: ', totalForLearningOutcome)
        if (totalForLearningOutcome > maxAllowedPercentage.percentage) {
          toast.error(`La suma de los porcentajes para este RA no puede exceder ${maxAllowedPercentage.percentage}%`)
          return prevPercentages // Evita la actualización si la suma excede el límite
        }
    
        setTotalPercentageByLearningOutCome(prevState => ({
          ...prevState,
          [versionDetailId]: totalForLearningOutcome,
        }))
    
        setTotalPercentageByActivity(prevState => ({
          ...prevState,
          [activityId]: (prevState[activityId] || 0) - newPercentage + updatedPercentage,
        }))
    
        return updatedPercentages
      })
    }
    

   /* const calculateTotalPercentage = (percentages) => {
      return percentages.reduce((acc, percentage) => acc + parseInt(percentage || 0), 0)
    }*/
    const calculateTotalPercentage = (percentages) => {
        return Object.values(percentages).reduce((acc, curr) => acc + curr, 0)
    }
    //const totalPercentage = calculateTotalPercentage(totalPercentageByLearningOutCome)
    //const total = calculateTotalPercentage(totalPercentageByLearningOutCome)
    //setTotalPercentage(total)

// Inicializar el estado
const [activities, setActivities] = useState([])
console.log('Activities: ', activities)
const filteredActivityEvaluationDetail = Object.values(activityEvaluationDetail).filter(detail => 
  detail.activity.scheduled_course_id === Number(selectedScheduledId))
console.log('Filtered Activity evaluation detail: ', filteredActivityEvaluationDetail)

const uniqueActivities = Array.from(
    new Set(filteredActivityEvaluationDetail.map((detail) => detail.activity.id))
  ).map((id) => {
    return filteredActivityEvaluationDetail.find((detail) => detail.activity.id === id)
})
console.log('Unique Activities: ', uniqueActivities)


const generateFilteredPercentages = () => {
  const percentages = filteredActivityEvaluationDetail.filter(detail => 
    filteredDetails.some(filteredDetail => filteredDetail.id === detail.version_evaluation_detail_id)
  ).map(detail => ({
    activity_id: detail.activity.id || null,
    version_evaluation_detail_id: detail.version_evaluation_detail_id, 
    percentage: parseFloat(detail.percentage) || 0
  }))

  setFilteredPercentages(percentages)
}

useEffect(() => {
  generateFilteredPercentages()
}, [selectedScheduledId])

  // Handle input changes
  const handleInputChange = (activityId, field, value) => {
    setActivities(prevActivities => prevActivities.map(activity =>
      activity.id === activityId ? { ...activity, [field]: value } : activity
    ))
  }

  const handleDeleteActivity = (index) => {
      // Crear una copia del estado actual de newActivities
      const updatedActivities = [...newActivities]
      
      // Eliminar la actividad en el índice especificado
      updatedActivities.splice(index, 1)
      
      // Actualizar el estado con las actividades restantes
      setNewActivities(updatedActivities)
  }

  // Render table headers
  const renderTableHeaders = () => (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-6 py-3">Actividad</th>
        <th scope="col" className="px-6 py-3">Descripción</th>
        {filteredDetails.map((detail) =>(
          <th key={detail.learning_outcome.id} scope="col" className="px-6 py-3">{detail.learning_outcome.code || 'Cargando...'}</th>
        ))}
        <th scope="col" className="px-6 py-3">Porcentaje</th>
        <th scope="col" className="px-6 py-3">Acciones</th>
      </tr>
    </thead>
  )

  // Render table rows
  const renderTableRows = () => (
    <tbody>
      {uniqueActivities.map((activityDetail) => (
        <tr key={activityDetail.activity.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <input
              type="text"
              value={activityDetail.activity.name}
              onChange={(e) => handleInputChange(activityDetail.activity.id, 'name', e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </td>
          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <textarea
              value={activityDetail.activity.description}
              onChange={(e) => handleInputChange(activityDetail.activity.id, 'description', e.target.value)}
              rows="1"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </td>
          {Object.values(filteredDetails).map((detail) => {
          // Buscar el porcentaje correspondiente en filteredPercentages
          const matchingPercentage = filteredPercentages.find(
            (percentage) => percentage.version_evaluation_detail_id === detail.id &&
            percentage.activity_id === activityDetail.activity.id
          )
          // Obtener el valor del porcentaje o establecer un valor por defecto
          const percentageValue = matchingPercentage ? parseFloat(matchingPercentage.percentage).toFixed(0) : ''

            return (
              <td key={detail.id} className="px-6 py-4">
                <input
                  type="number"
                  value={percentageValue}
                  onChange={(e) => handlePercentageChange(activityDetail.activity.id, detail.id, e.target.value, percentageValue)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </td>
            )
          })}
          <td className="px-6 py-4">
            {/*calculatePercentageActivity(activity)*/}{totalPercentageByActivity[activityDetail.activity.id] || 0}%
          </td>
          <td className="px-6 py-4">
            <button type='button'
              className='bg-primary opacity-80 rounded-sm py-1 px-1 hover:opacity-100'>
              <DeleteIcon/>
            </button>
          </td>
        </tr>
      ))}
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
                                            const updatedActivities = [...newActivities]
                                            updatedActivities[activityIndex].description = e.target.value
                                            setNewActivities(updatedActivities)
                                        }} />
                                    </td>
                                    {/*Object.entries(learningOutComes).map((learningOutcomeId, learningOutComeIndex) => (
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
                                    ))*/}
                                    <td className="px-6 py-4">
                                        {calculateTotalPercentage(activity.percentages || [])}%
                                    </td>
                                    <td className="px-6 py-4">
                                      <button 
                                        type='button'
                                        onClick={ () => handleDeleteActivity(activityIndex)}
                                        className='bg-primary opacity-80 rounded-sm py-1 px-1 hover:opacity-100'>
                                        <DeleteIcon/>
                                      </button>
                                    </td>
                                </tr>
      ))}
                              <tr key={`totalPercentageRa`} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        PORCENTAJE
                                    </th>
                                    <td className="px-6 py-4">
                                      
                                    </td>
                                    {filteredDetails.map((detail) => {
                                      const detailId = detail.id
                                      const detailPercentage = parseFloat(detail.percentage.percentage).toFixed(0)
                                      const totalPercentage = totalPercentageByLearningOutCome[detailId]
                                      //setTotalPercentage(totalPercentage)
                                      return (
                                          <td key={detailId} className="px-6 py-4">
                                              <span style={{ color: totalPercentage < detailPercentage ? 'red' : 'inherit' }}>
                                                  {detailPercentage}%
                                              </span>
                                          </td>
                                      )
                                    })}
                                    {/*filteredDetails.map((detail) =>(
                                        <td key={detail.percentage.id} className="px-6 py-4">
                                        {parseFloat(detail.percentage.percentage).toFixed(0)}%
                                        </td>
                                    ))*/}
                                    <td className="px-6 py-4">
                                      <span style={{color: totalPercentage < 100 ? 'red' : 'inherit'}}>
                                        {totalPercentage}%
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                    
                                    </td>
                                  </tr>
    </tbody>
  )

    return(
      <div className="flex flex-col gap-4">
        <span>Configuración evaluación del curso {groupedCourse[0].name}</span>
        <label className="text-sm">Grupos:</label>
        <select 
          id="scheduled_course" 
          name='scheduled_course' 
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={handleSelectChange}
        >
                    <option disabled>Grupos</option>
                    {newScheduledCourse && newScheduledCourse.map(detail => (
                          <option key={`set_activity_${detail.id}`} value={detail.id}>
                             {`${detail.group}`}
                          </option>
                    ))}
        </select>
        <form className='form flex flex-col gap-4' onSubmit={handleSubmit}>
          <button 
            className='bg-btn-create opacity-80 w-fit px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'
            onClick={handleActivity}
            type="button"
            disabled={totalPercentage === 100}
            >
            <CreateIcon/>
            <span className="ml-1">Crear actividad</span>
          </button>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            {renderTableHeaders()}
            {renderTableRows()}
          </table> 
          <div className="flex justify-end gap-2">
            <button type='submit' className='bg-btn-create opacity-80 w-fit px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'>
              <SettingsCheckIcon/>
              <span className="ml-1">Configurar Actividad</span>
            </button>                      
            <GoBackButton label='Volver' route='/course-list/'/>          
          </div>     
        </form>
      </div>
    )
  }
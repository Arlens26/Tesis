import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useScheduledCourse } from "../hooks/useSheduledCourse"
import { useEvaluationVersionCourse } from "../hooks/useEvaluationVersionCourse"
import { useActivities } from "../hooks/useActivities"
//import { ActivityForm } from "./ActivityForm"
import { useCourses } from "../hooks/useCourses"
import { DeleteIcon } from "./Icons"
import { toast } from "sonner"

export function Activity() {

    const { getEvaluationVersionDetail, learningOutComes, percentages, scheduledCourse, evaluationVersionDetail } = useScheduledCourse()   
    //console.log(scheduledCourse)
    //console.log(percentages)
    console.log(evaluationVersionDetail)
    const { getActivityDetail, activityDetail } = useActivities()
    //console.log(activities)
    console.log(activityDetail)
    const { getCourse } = useCourses()
    const location = useLocation()
    
    const { evaluationVersion } = useEvaluationVersionCourse()
    const [activityDetailList, setActivityDetailList] = useState([])
    console.log(activityDetailList)
    const [newActivities, setNewActivities] = useState([])
    console.log(newActivities)
    const [raSums, setRaSums] = useState({})

    const [selectedScheduledId, setSelectedScheduledId] = useState(null)
    console.log(selectedScheduledId)
    
    useEffect(() =>{
        getActivityDetail()
        const course_id = location.state.course_id
        console.log(course_id)
        const course = getCourse(course_id)
        course.then(course => {
          const newRoute = `/${course.name}/activity/`
          history.pushState({}, '', newRoute)
          console.log(newRoute)
        })
        //console.log(evaluationVersion)
        if (course_id) {
            getEvaluationVersionDetail(course_id)
        } else {
            console.error("No se proporcionó un course_id en el estado de la ubicación.")
        }
        if(scheduledCourse && scheduledCourse.length > 0){
          setSelectedScheduledId(scheduledCourse[0].id)
          console.log('Scheduled ID seleccionado:', selectedScheduledId)
        }
    }, [location.state?.course_id, evaluationVersion])

    const handleSubmit = (event) => {
      event.preventDefault()

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
    }

    const handleActivity = () => {
      setNewActivities([...newActivities, { name: '', description: '', percentages: [] }])
      console.log(newActivities)
    }

    const handlePercentage = (activityIndex, learningOutComeIndex, newPercentage, isNewActivity = false) => {
      const learningOutcomeId = Object.keys(learningOutComes)[learningOutComeIndex];
      const maxPercentage = parseInt(percentages[learningOutcomeId]?.percentage);
      
      // Obtener la suma actual del RA desde raSums (actividades existentes)
      const existingSum = raSums[learningOutcomeId] || 0;
  
      // Sumar todos los porcentajes de las nuevas actividades para este RA
      const sumNewActivities = newActivities.reduce((sum, activity) => {
        const currentPercentage = parseInt(activity.percentages[learningOutComeIndex]) || 0;
        return sum + currentPercentage;
    }, 0);
  
      // Calcular la suma total con la nueva entrada
      const currentActivityPercentage = isNewActivity
          ? parseInt(newActivities[activityIndex]?.percentages[learningOutComeIndex] || 0)
          : 0;
  
      const newSum = existingSum + sumNewActivities - currentActivityPercentage + parseInt(newPercentage)
      console.log(newSum)
      /*console.log(sumNewActivities)
      console.log(existingSum)
      console.log(newSum)
      console.log(maxPercentage)*/
      if (newSum <= maxPercentage) {
        //console.log('se ejecuta')
          if (isNewActivity) {
              const updatedNewActivities = [...newActivities];
              if (!updatedNewActivities[activityIndex].percentages) {
                  updatedNewActivities[activityIndex].percentages = [];
              }
              updatedNewActivities[activityIndex].percentages[learningOutComeIndex] = newPercentage;
              setNewActivities(updatedNewActivities);
          }
  
          // Actualizar la suma en el estado `raSums`
          setRaSums(prevSums => ({
              ...prevSums,
              [learningOutcomeId]: newSum
          }));
      } else {
          toast.info(`La suma de los porcentajes para el RA ${learningOutcomeId} no puede exceder ${maxPercentage}%`)
          console.log(`El porcentaje total para el RA ${learningOutComes[learningOutcomeId]?.code} no puede exceder ${maxPercentage}%.`);
      }
  };
  
  
  
  


  const handlePercentageChange = (activityId, versionId, value) => {
    const newPercentage = parseFloat(value) || 0
    const learningOutcomeId = versionId // Mapea correctamente el RA
    const currentSum = raSums[learningOutcomeId] || 0
    const maxPercentage = parseFloat(percentages[learningOutcomeId]?.percentage)

    // Busca la actividad actual
    const activity = activities.find(activity => activity.id === activityId)
    const currentActivityPercentage = parseFloat(activity.percentages[versionId]) || 0
    
    // Calcula la nueva suma potencial
    const newSum = currentSum - currentActivityPercentage + newPercentage
    console.log(newSum)

    if (newSum <= maxPercentage) {
        setActivities(prevActivities => 
            prevActivities.map(activity =>
                activity.id === activityId ? { 
                    ...activity, 
                    percentages: { ...activity.percentages, [versionId]: value } 
                } : activity
            )
        );
        setRaSums(prevSums => ({
            ...prevSums,
            [learningOutcomeId]: newSum
        }));
    } else {
        toast.info(`La suma de los porcentajes para el RA ${learningOutcomeId} no puede exceder ${maxPercentage}%`)
        console.log(`La suma de los porcentajes para el RA ${learningOutcomeId} no puede exceder ${maxPercentage}%`)
    }
}

    const calculateTotalPercentage = (percentages) => {
      return percentages.reduce((acc, percentage) => acc + parseInt(percentage || 0), 0)
    }

// Inicializar el estado
const [activities, setActivities] = useState([])
const filteredActivities = activities.filter(activity => activity.scheduled_course_id === Number(selectedScheduledId))
console.log(filteredActivities)
//const [totalPercentage, setTotalPercentage] = useState(0)

const calculatePercentageActivity = (activity) => {
  return Object.values(activity.percentages).reduce((sum, val) => sum + parseFloat(val || 0), 0)
}

// Asegurarse que activityDetail sea una matriz y agrupar las actividades
useEffect(() => {
  if (Array.isArray(activityDetail)) {
      const groupedActivities = activityDetail.reduce((acc, detail) => {
          const { activity } = detail;
          if (!acc[activity.id]) {
              acc[activity.id] = {
                  ...activity,
                  percentages: {},
              };
          }
          acc[activity.id].percentages[detail.version_evaluation_detail_id] = detail.percentage;
          return acc;
      }, {});
      
      setActivities(Object.values(groupedActivities));

      // Inicializa raSums con los porcentajes existentes en activityDetail
      const initialRaSums = activityDetail.reduce((acc, detail) => {
          const learningOutcomeId = detail.version_evaluation_detail_id;
          acc[learningOutcomeId] = (acc[learningOutcomeId] || 0) + parseInt(detail.percentage || 0);
          return acc;
      }, {});
      
      setRaSums(initialRaSums);
  } else {
      console.error('ActivityDetail is not an array:', activityDetail);
  }
}, [activityDetail]);

  if (!Array.isArray(activityDetail)) {
    console.error('ActivityDetail is not an array:', activityDetail)
    return null 
  }

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
        {Object.keys(learningOutComes).map(id => (
          <th key={id} scope="col" className="px-6 py-3">{learningOutComes[id]?.code || 'Cargando...'}</th>
        ))}
        <th scope="col" className="px-6 py-3">Porcentaje</th>
        <th scope="col" className="px-6 py-3">Acciones</th>
      </tr>
    </thead>
  )

  // Render table rows
  const renderTableRows = () => (
    <tbody>
      {filteredActivities.map((activity) => (
        <tr key={activity.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <input
              type="text"
              value={activity.name}
              onChange={(e) => handleInputChange(activity.id, 'name', e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </td>
          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <textarea
              value={activity.description}
              onChange={(e) => handleInputChange(activity.id, 'description', e.target.value)}
              rows="1"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </td>
          {Object.keys(learningOutComes).map(id => (
            <td key={id} className="px-6 py-4">
              <input
                type="text"
                value={parseFloat(activity.percentages[id]).toFixed(0) || ''}
                onChange={(e) => handlePercentageChange(activity.id, id, e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </td>
          ))}
          <td className="px-6 py-4">
            {calculatePercentageActivity(activity)}%
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
  )

    return(
      <div className="flex flex-col gap-4">
        <span>Configuración evaluación</span>
        <label className="text-sm">Grupos:</label>
        <select 
          id="scheduled_course" 
          name='scheduled_course' 
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(e) => setSelectedScheduledId(e.target.value)}
        >
                    <option disabled>Grupos</option>
                    {scheduledCourse && scheduledCourse.map(scheduled => (
                          <option key={`set_activity_${scheduled.id}`} value={scheduled.id}>
                             {`${scheduled.group}`}
                          </option>
                    ))}
        </select>
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
            {renderTableHeaders()}
            {renderTableRows()}
          </table>      
          <button type='submit' className='bg-btn-create opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100'>Configurar Actividad</button>                      
        </form>
      </div>
    )
  }
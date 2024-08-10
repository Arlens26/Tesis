import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useScheduledCourse } from "../hooks/useSheduledCourse"
import { useEvaluationVersionCourse } from "../hooks/useEvaluationVersionCourse"
import { useActivities } from "../hooks/useActivities"
//import { ActivityForm } from "./ActivityForm"
import { useCourses } from "../hooks/useCourses"
import { DeleteIcon } from "./Icons"

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
    //const [totalPercentage, setTotalPercentage] = useState(0)
    const [activityDetailList, setActivityDetailList] = useState([])
    //console.log(evaluationVersionDetail)
    //console.log(learningOutComes)
    //console.log(percentages)
    const [newActivities, setNewActivities] = useState([])
    //const [newDetailActivity, setNewDetailActivity] = useState([])
    //console.log(newActivities)
    //const [activityList, setActivityList] = useState([])
    
    /*const [filteredActivities, setFilteredActivities] = useState([])
    console.log(filteredActivities)*/

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

    //useEffect(() => {
      //const scheduledCourseIds = scheduledCourse.map(scheduled_course => scheduled_course.id)
      //console.log(scheduledCourseIds)
      //const filtered = Object.keys(activities).filter(id => scheduledCourseIds.includes(activities[id].scheduled_course))
      //const filtered = Object.keys(activities).filter(id => selectedScheduledId === activities[id].scheduled_course)
      /*const filtered = Object.keys(activityDetail).filter(id => selectedScheduledId === activityDetail[id].activity.scheduled_course_id)
      console.log(filtered)
      const filteredActivities = [...new Set(Object.keys(activityDetail).filter(id => activityDetail[id].activity.scheduled_course_id === selectedScheduledId))]
      console.log(filteredActivities)*/
      /*const versionEvaluationDetailIds = evaluationVersionDetail.map(details => details.id)
      console.log(versionEvaluationDetailIds)
      const filteredActivities = Object.values(activityDetail)
                          .filter(activity => versionEvaluationDetailIds.includes(activity.version_evaluation_detail_id))
                          .map(activity => activity.activity)
      console.log(filteredActivities)*/
      //setFilteredActivities(filteredActivities)

    //}, [scheduledCourse, selectedScheduledId])

    const handleSubmit = (event) => {
      event.preventDefault()

      /*const buildActivityDetailList = () => {
        return activityDetailList.map((detail, index) => {
          const activityId = filteredActivities[index]
          return (console.log(detail) ,{
          version_detail_id: evaluationVersionDetail[index]?.id, 
          activity_id: activities[activityId].id,
          percentage: detail.percentages
          })
        })
      }*/

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
      /*const activityDetail = {
        activity_detail: buildActivityDetailList()
      }
      console.log(activityDetail)*/

      
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

    //const scheduledCourseIds = scheduledCourse.map(scheduled_course => scheduled_course.id)
    //console.log(scheduledCourseIds)
    // Ensure activityDetail is an array
// Inicializar el estado
const [activities, setActivities] = useState([])
const filteredActivities = activities.filter(activity => activity.scheduled_course_id === selectedScheduledId)
console.log(filteredActivities)
//const [totalPercentage, setTotalPercentage] = useState(0)

const calculatePercentageActivity = (activity) => {
  return Object.values(activity.percentages).reduce((sum, val) => sum + parseFloat(val || 0), 0)
}

// Asegurarse que activityDetail sea una matriz y agrupar las actividades
useEffect(() => {
  if (Array.isArray(activityDetail)) {
    const groupedActivities = activityDetail.reduce((acc, detail) => {
      const { activity } = detail
      if (!acc[activity.id]) {
        acc[activity.id] = {
          ...activity,
          percentages: {},
        };
      }
      acc[activity.id].percentages[detail.version_evaluation_detail_id] = detail.percentage
      return acc
    }, {})
    setActivities(Object.values(groupedActivities))
  } else {
    console.error('ActivityDetail is not an array:', activityDetail)
  }
}, [activityDetail])

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

  const handlePercentageChange = (activityId, versionId, value) => {
    setActivities(prevActivities => prevActivities.map(activity =>
      activity.id === activityId ? {
        ...activity,
        percentages: { ...activity.percentages, [versionId]: value }
      } : activity
    ))
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
        {/*<ActivityForm/>*/}
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
          {/*<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                              {/*
                               filteredActivities.map((id, activityIndex )=> (
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
                              */}
                               {/*
                                          Object.keys(activityDetail).map((key, index) => {
                                            const detailAd = activityDetail[key]
                                            console.log(`detailAd ${index}:`, detailAd)
                                            return (
                                              <>
                                                <div className="flex flex-col" key={index}>
                                                  <h2>Detail {index}</h2>
                                                  <p>Id: {detailAd.id}</p>
                                                  <p>Percentage: {detailAd.percentage}</p>
                                                  <p>Activity Name: {detailAd.activity.name}</p>
                                                </div>
                                                <tr 
                                  key={detailAd.activity.id} 
                                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td name='name' scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                      <input type="text" value={detailAd.activity.name} placeholder='Nombre de la actividad' name='name' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>                               
                                    </td>
                                    <td name='description' scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                      <textarea value={detailAd.activity.description} placeholder='Descripción' name='description' rows="1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>           
                                    </td>
                                    {Object.entries(learningOutComes).map((learningOutcomeId, learningOutComeIndex) => (
                                        <td key={learningOutcomeId} className="px-6 py-4">
                                            <input
                                                name={`learning_percentage${learningOutComeIndex}_${learningOutcomeId}`}
                                                type="text"
                                                value={detailAd.percentage || ''}
                                                onChange={(e) => handlePercentage(index, learningOutComeIndex, e.target.value)}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                        </td>
                                    ))}
                                    <td className="px-6 py-4">
                                        {calculateTotalPercentage(activityDetailList[index]?.percentages || [])}%
                                    </td>
                                    <td key={key} className="px-6 py-4">
                                          
                                    </td>
                                  </tr>
                                              </>
                                            )
                                        })

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
                                </table> */} 
            <button type='submit' className='bg-btn-create opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100'>Configurar Actividad</button>                      
        </form>
      </div>
    )
  }
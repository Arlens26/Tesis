import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { useScheduledCourse } from "../../scheduled_course/hooks/useSheduledCourse"
import { useActivities } from "../hooks/useActivities"
import { CreateIcon, DeleteIcon, SettingsCheckIcon } from "../../components/Icons"
import { toast } from "sonner"
import { GoBackButton } from "../../components/GoBackButton"
import { useActivityPercentage } from "../hooks/useActivityPercentage"

export function Activity() {

    const { getEvaluationVersionDetail,
      evaluationVersionDetail, newScheduledCourse, getAllScheduledCourse } = useScheduledCourse()
    const { getActivityEvaluationVersionDetail, activityEvaluationDetail, settingActivity, deleteSettingActivity } = useActivities()
    console.log('Activity evaluation detail: ', activityEvaluationDetail)

    console.log('New scheduled course estado: ', newScheduledCourse)
    console.log('Evaluation version detail: ', evaluationVersionDetail) 
    const location = useLocation()
    
    const [selectedScheduledId, setSelectedScheduledId] = useState(null)
    const [selectedVersionId, setSelectedVersionId] = useState(null)
    const groupedCourse = location.state?.course || []
    console.log('Grouped course: ', groupedCourse) 
    const [evaluationDetailIds, setEvaluationDetailIds] = useState([])
    console.log('Ids evaluation version detail: ', evaluationDetailIds)
    const [activitiesData, setActivitiesData] = useState([])
    console.log('activities data: ', activitiesData)

    const selectedDetail = newScheduledCourse?.find(item => item.id === selectedScheduledId)
    console.log('selected detail: ', selectedDetail)

    const filteredActivityEvaluationDetail = useMemo(() => 
      Object.values(activityEvaluationDetail).filter(d => 
        d.activity.scheduled_course_id === Number(selectedScheduledId)
      ), 
      [activityEvaluationDetail, selectedScheduledId]
    )
    console.log('Filtered Activity evaluation detail: ', filteredActivityEvaluationDetail)


    const filteredDetails = useMemo(() => 
      Object.values(evaluationVersionDetail).filter(d => 
        d.evaluation_version_id === selectedVersionId
      ), 
      [evaluationVersionDetail, selectedVersionId]
    )
    console.log('Filtered Details: ', filteredDetails)

    const {  
      handlePercentageChange,
      filteredPercentages,
      //totalPercentageByActivity,
      totalPercentageByLearningOutCome
    } = useActivityPercentage(filteredDetails, filteredActivityEvaluationDetail, activitiesData)
    console.log('Activty data: ', activitiesData)
    console.log('filtered activity evaluation detail: ', filteredActivityEvaluationDetail)
    console.log('filtered percentages: ', filteredPercentages)


    useEffect(() => {
      
      if(!filteredActivityEvaluationDetail || filteredActivityEvaluationDetail.length === 0){
        setActivitiesData([])
        return
      }

        const serverActivities = filteredActivityEvaluationDetail
          .filter((act, index, self) =>
            self.findIndex(a => a.activity.id === act.activity.id) === index
          )
          .map(activityDetail => {
            if (!activityDetail || !activityDetail.activity) return null
            return {
              id: activityDetail.activity.id,
              name: activityDetail.activity.name,
              description: activityDetail.activity.description,
              percentages: filteredDetails.reduce((acc, detail) => {
                const match = filteredPercentages.find(p => 
                  p.version_evaluation_detail_id === detail.id &&
                  p.activity_id === activityDetail.activity.id
                )
                acc[detail.id] = match ? parseFloat(match.percentage) : 0
                return acc
              }, {})
            }
          })
          .filter(Boolean)

        setActivitiesData(prevLocalActivities => {
          const updatedTempActivities = prevLocalActivities.filter(local => {
            return String(local.id).startsWith('temp-') &&
              !serverActivities.some(server => 
                server.name === local.name && server.description === local.description
              )              
            })
          return [...serverActivities, ...updatedTempActivities]
        }) 

    }, [filteredActivityEvaluationDetail, filteredDetails, filteredPercentages])

    const handleAddActivity = () => {
      const newActivity = {
        id: `temp-${Date.now()}`, 
        name: '',
        description: '',
        percentages: filteredDetails.reduce((acc, detail) => {
          acc[detail.id] = 0
          return acc
        }, {})
      }
    
      setActivitiesData(prev => [...prev, { ...newActivity }])
    }

  // Efecto para carga inicial
  useEffect(() => {
  const loadInitialData = async () => {
    await getAllScheduledCourse()
    
    if (newScheduledCourse?.length > 0) {
      // Busca el curso que ya tenga actividades asociadas
      const courseWithActivities = newScheduledCourse.find(sc => 
        filteredActivityEvaluationDetail.some(act => 
          act.activity.scheduled_course_id === sc.id
        )
      )
      const initialCourse = courseWithActivities || newScheduledCourse[0]
      
      setSelectedScheduledId(initialCourse.id)
      setSelectedVersionId(initialCourse.evaluation_version_id)
    }
  }
  
  loadInitialData()
}, [])

  // Efecto para actualizar detalles de evaluación
  useEffect(() => {
    if (!selectedVersionId || !groupedCourse.length) return
    
    const evaluationVersionIds = groupedCourse[0].details
        .map(detail => detail.evaluation_version_id)
        .filter(Boolean)
    
    getEvaluationVersionDetail(evaluationVersionIds, groupedCourse[0].period)
  }, [selectedVersionId])

  // Efecto para actualizar actividades
  useEffect(() => {
    if (!evaluationVersionDetail || !selectedVersionId) return
    const detailIds = evaluationVersionDetail
      .filter(d => d.evaluation_version_id === selectedVersionId)
      .map(d => d.id)
    setEvaluationDetailIds(detailIds)
    getActivityEvaluationVersionDetail(detailIds) 
  }, [evaluationVersionDetail, selectedVersionId])
    
    // Calcular el total del porcentaje
    const totalPercentage = useMemo(() => {

      if(!Array.isArray(activitiesData)){
        return 0
      }

      return activitiesData
        .filter(activity => activity && activity.percentages)
        .reduce((total, activity) => {
          const activityTotal = Object.values(activity.percentages).reduce(
            (sum, val) => sum + (parseFloat(val) || 0), 
            0
          )
        return total + activityTotal
      }, 0)
    }, [activitiesData])

    useEffect(() => {
      if(newScheduledCourse && newScheduledCourse.length > 0 && selectedScheduledId == null){
        setSelectedScheduledId(newScheduledCourse[0].id)
        console.log('Scheduled course ID seleccionado:', selectedScheduledId)
        const firstScheduledCourse = newScheduledCourse[0]
        console.log('First scheduled course: ', firstScheduledCourse)
        if (selectedVersionId == null) {
            setSelectedVersionId(firstScheduledCourse.evaluation_version_id)
        }
      }
    }, [newScheduledCourse, selectedScheduledId, selectedVersionId])

    // Actualizar el estado del porcentaje total general si es necesario
    /*useEffect(() => {
    const totalActivityPercentage = 
      Object.values(totalPercentageByActivity).reduce((acc, val) => acc + val, 0)
      setTotalPercentage(totalActivityPercentage)
    }, [totalPercentageByActivity])*/

    useEffect(() => {
      getAllScheduledCourse()
      const evaluationVersionIds = groupedCourse.flatMap(course => 
          course.details.map(detail => detail.evaluation_version_id)
      )
      console.log(evaluationVersionIds)
      const filteredEvaluationVersionIds = evaluationVersionIds.filter(id => id !== undefined)
      console.log(filteredActivityEvaluationDetail)
      if (filteredEvaluationVersionIds.length > 0) {
          getEvaluationVersionDetail(filteredEvaluationVersionIds, groupedCourse[0].period)
      }
  }, [selectedScheduledId, groupedCourse])
    
    const handleSelectChange = (e) => {
      const selectedId = Number(e.target.value)
      console.log('Selected Id: ', selectedId)
      const selectedDetail = newScheduledCourse.find(detail => detail.id === parseInt(selectedId))

      setActivitiesData([])
  
      setSelectedScheduledId(selectedId)
      setSelectedVersionId(selectedDetail?.evaluation_version_id || null)
      
      if (selectedDetail) {
        const detailIds = evaluationVersionDetail
          .filter(d => d.evaluation_version_id === selectedDetail.evaluation_version_id)
          .map(d => d.id)
        setEvaluationDetailIds(detailIds)
        getActivityEvaluationVersionDetail(detailIds)
      }
    }

    const handleSubmit = (event) => {
      event.preventDefault()

      for (const activity of activitiesData) {
        if (!activity.name.trim() || !activity.description.trim()) {
          toast.error('Por favor, completa todos los campos requeridos')
          return
        }
      }
    
      const buildActivity = () => {
        return activitiesData.map(activity => {
          // Estructura base para la actividad
          const activityPayload = {
            activities: {
              name: activity.name,
              description: activity.description,
              scheduled_course: selectedScheduledId 
            },
            activity_evaluation_detail: Object.entries(activity.percentages).map(([versionId, percentage]) => ({
              version_evaluation_detail_id: parseInt(versionId),
              percentage: percentage,
              // Solo se incluye activity_id si no es temporal
              ...(activity.id && !activity.id.toString().startsWith('temp-') && { activity_id: activity.id })
            }))
          }
          
          return activityPayload
        })
      }
    
      const finalData = buildActivity()
      console.log('Datos a enviar:', finalData)
      
      settingActivity(finalData)
        .then(() => {
          toast.success('Configuración de la actividad exitosa')
          getActivityEvaluationVersionDetail(evaluationDetailIds)
        })
        .catch(() => {
          toast.error('Error en la configuración de la actividad')
        })
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
      {activitiesData.map((activity, activityIndex) => (
  <tr key={activity.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
      <input
        type="text"
        value={activity.name}
        onChange={(e) => {
          const updated = [...activitiesData];
          updated[activityIndex].name = e.target.value;
          setActivitiesData(updated);
        }}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </td>
    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
      <textarea
        value={activity.description}
        onChange={(e) => {
          const updated = [...activitiesData];
          updated[activityIndex].description = e.target.value;
          setActivitiesData(updated);
        }}
        rows="1"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </td>
    {filteredDetails.map((detail) => {
      // Obtén el valor actual
      const percentageValue = activitiesData[activityIndex].percentages[detail.id] || 0
      return (
        <td key={detail.id} className="px-6 py-4">
          <input
            type="number"
            min={0}
            max={100}
            onWheel={(e) => e.target.blur()}
            value={percentageValue}
            onChange={(e) => {
              const updatedPercentage = parseFloat(e.target.value) || 0
              const previousValue = percentageValue

              const isValid = handlePercentageChange(
                activity.id,
                detail.id,
                updatedPercentage,
                previousValue
              )

              // Actualizar el estado local solo si es válido
              if (isValid) {
                const updatedActivities = [...activitiesData]
                updatedActivities[activityIndex].percentages[detail.id] = updatedPercentage
                setActivitiesData(updatedActivities)
              } else {
                // Revertir el valor del input al anterior
                const updatedActivities = [...activitiesData]
                updatedActivities[activityIndex].percentages[detail.id] = previousValue
                setActivitiesData(updatedActivities)
                //e.target.value = previousValue
              }
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </td>
      )
    })}
    <td className="px-6 py-4">
      {Object.values(activity.percentages).reduce((a, b) => a + parseFloat(b), 0)}%
    </td>
    <td className="px-6 py-4">
      <button type='button' 
      className='bg-primary opacity-80 rounded-sm py-1 px-1 hover:opacity-100'
      onClick={() => {
        const versionEvaluationDetailIds = Object.keys(activity.percentages).map(Number)
        console.log('detail ids: ', versionEvaluationDetailIds)
        console.log('activity id: ', activity, 'type:', typeof activity.id)

        if((typeof activity.id === 'number') || 
           (typeof activity.id === 'string') && !activity.id.startsWith('temp-')){
          deleteSettingActivity(activity.id, versionEvaluationDetailIds)
            .then(() => {
              toast.success('La actividad fue eliminada exitosamente')
              getActivityEvaluationVersionDetail(evaluationDetailIds)
            })
            .catch(() => {
              toast.error('Error al eliminar la actividad')
              setActivitiesData(prev => [...prev, activity])
            })
        }
        else {
          // Función para eliminar la actividad
          setActivitiesData(prev => prev.filter(a => a.id !== activity.id))
        }
      }}>
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
                                      console.log('detail percentage: ', detailPercentage)
                                      const currentTotalPercentage = totalPercentageByLearningOutCome[detailId]
                                      console.log('current total percentage: ', currentTotalPercentage)
                                      return (
                                          <td key={detailId} className="px-6 py-4">
                                              <span style={{ color: currentTotalPercentage < detailPercentage ? 'red' : 'inherit' }}>
                                                  {detailPercentage}%
                                              </span>
                                          </td>
                                      )
                                    })}
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
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Versión de evaluación</label>
              <input 
                type="text" 
                placeholder='' 
                name='name' 
                value={selectedVersionId} 
                //onChange={handleInputChange}
                disabled 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>     
            </div>
            <div>
              <label className="text-sm">Periodo académico</label>
              <input 
                type="text" 
                placeholder='' 
                name='name' 
                value={selectedDetail ? `${selectedDetail.period.year} - ${selectedDetail.period.semester}` : ''} 
                //onChange={handleInputChange}
                disabled 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
            </div>
          </div>
        <form className='form flex flex-col gap-4' onSubmit={handleSubmit}>
          <button 
            className='bg-btn-create opacity-80 w-fit px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'
            onClick={handleAddActivity}
            type="button"
            disabled={totalPercentage >= 100}
            >
            <CreateIcon/>
            <span className="ml-1">Crear actividad</span>
          </button>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              {renderTableHeaders()}
              {renderTableRows()}
            </table> 
          </div>
          <div className="flex justify-end gap-2">
            <button disabled={totalPercentage > 100} type='submit' className='bg-btn-create opacity-80 w-fit px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'>
              <SettingsCheckIcon/>
              <span className="ml-1">Configurar Actividad</span>
            </button>                      
            <GoBackButton label='Volver' route='/course-list/'/>          
          </div>     
        </form>
      </div>
    )
  }
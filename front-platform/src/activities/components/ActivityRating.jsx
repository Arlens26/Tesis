import { useContext, useEffect, useMemo, useState } from "react"
import { useEnrolledStudent } from "../../students/hooks/useEnrolledStudent"
import { toast } from "sonner"
import { useLocation } from "react-router-dom"
import { AuthContext } from "../../auth/context/user"
import { GoBackButton } from "../../components/GoBackButton"

export function ActivityRating() {

    const { user } = useContext(AuthContext)
    const location = useLocation()

    const { getGradeDetail, gradeDetail, updateGradeDetail } = useEnrolledStudent()
    console.log('Grade datail: ', gradeDetail)
    const [selectedScheduledId, setSelectedScheduledId] = useState(null)
    console.log('selected scheduled id: ', selectedScheduledId)
    //const [selectedVersionId, setSelectedVersionId] = useState(null)
    const [selectedActivityId, setSelectedActivityId] = useState(null)

    //const [selectedGroupId, setSelectedGroupId] = useState(null)
    const groupedCourse = location.state?.course || []
    console.log('Grouped course: ', groupedCourse) 

    const versionIds = new Set(
      groupedCourse.flatMap(course => 
        course.details.map(detail => detail.evaluation_version_id)
      )
    )
    console.log('versionIds: ', versionIds)

    const filteredByVersion = gradeDetail
    .filter(detail => 
      versionIds.has(
        detail.activity_evaluation_detail.version_evaluation_detail.evaluation_version
      )
    )
    .filter(detail => 
      detail.enrolled_course.scheduled_course.professor_id === Number(user.id)
    )

    /*const version_id = location.state.version_id
    console.log('Version id: ', version_id)*/

    /*const filteredByVersion = gradeDetail
      .filter(detail => detail.activity_evaluation_detail.version_evaluation_detail.evaluation_version === Number(version_id))
      .filter(detail => detail.enrolled_course.scheduled_course.professor_id === Number(user.id))*/
    console.log('Filtered by evaluation version: ', filteredByVersion)

    const uniqueGroups = Array.from(
      new Set(filteredByVersion.map(detail => detail.enrolled_course.scheduled_course.id))
    ).map(id => {
      return filteredByVersion.find(detail => detail.enrolled_course.scheduled_course.id === id)
    }) 

    console.log('unique groups: ', uniqueGroups)

    const filteredByGroup = useMemo(() => {
      return selectedScheduledId
        ? filteredByVersion.filter(detail => 
            detail.enrolled_course.scheduled_course.id === Number(selectedScheduledId))
        : []
    }, [filteredByVersion, selectedScheduledId])

    console.log('filtered group: ', filteredByGroup)

    useEffect(() => {
          if(uniqueGroups && uniqueGroups.length > 0 && selectedScheduledId == null){
            setSelectedScheduledId(uniqueGroups[0].enrolled_course.scheduled_course.id)
            //console.log('Scheduled course ID seleccionado:', selectedScheduledId)
            /*const firstScheduledCourse = newScheduledCourse[0]
            console.log('First scheduled course: ', firstScheduledCourse)
            if (selectedVersionId == null) {
                setSelectedVersionId(firstScheduledCourse.evaluation_version_id)
            }*/
          }
        }, [uniqueGroups, selectedScheduledId])

    /*useEffect(() => {
      if (filteredByGroup.length > 0 && !selectedActivityId) {
        const firstActivityId = filteredByGroup[0].activity_evaluation_detail.activities.id
        setSelectedActivityId(firstActivityId)
      }
    }, [filteredByGroup, selectedActivityId])

    const uniqueActivitiesGroup = useMemo(() => {
      return Array.from(
        new Set(filteredByGroup.map(detail => detail.activity_evaluation_detail.activities.id))
      ).map(id => {
        return filteredByGroup.find(detail => 
          detail.activity_evaluation_detail.activities.id === id
        )
      })
    }, [filteredByGroup])

    console.log('unique activities group: ', uniqueActivitiesGroup)*/

    const filteredByActivities = filteredByGroup      
      .filter(detail => detail.activity_evaluation_detail.activities.id === Number(selectedActivityId))
    console.log('Filtered by activities: ', filteredByActivities)
    
    // Verificar que las RAs sean únicos
    const uniqueLearningOutComes = Array.from(
      new Set(filteredByActivities.map((detail) => detail.activity_evaluation_detail.version_evaluation_detail.id))
    ).map((id) => {
      return filteredByActivities.find((detail) => detail.activity_evaluation_detail.version_evaluation_detail.id === id)
    })
    console.log('Unique RA: ', uniqueLearningOutComes)

    // Verificar que las estudiantes sean únicos
    const uniqueStudents = Array.from(
      new Set(filteredByActivities.map((detail) => detail.enrolled_course.student.id))
    ).map((id) => {
      return filteredByActivities.find((detail) => detail.enrolled_course.student.id === id)
    })
    console.log('Unique Students: ', uniqueStudents)

    const [max, setMax] = useState(0)
    const [notes, setNotes] = useState([])
    console.log('Notes: ', notes)
    //const [isInitialized, setIsInitialized] = useState(false)

    // Calcular el total de porcentaje y luego hayar el máximo
    useEffect(() => {
      const total = uniqueLearningOutComes.reduce((acc, detail) => {
        return acc + detail.activity_evaluation_detail.percentage
      }, 0)
      const max = (total/100)*5 
      setMax(max)
    }, [uniqueLearningOutComes])

    const learningOutComes = uniqueLearningOutComes.map(detail => {
      return {
        id: detail.activity_evaluation_detail.version_evaluation_detail.learning_outcome,
        version_id: detail.activity_evaluation_detail.version_evaluation_detail.id,
        weight: detail.activity_evaluation_detail.percentage,
        sum: max
      }
    })
    console.log('Learnig outcomes: ', learningOutComes)

    useEffect(() => {
        const course_id = location.state.course_id
        console.log('Course id: ', course_id)
        getGradeDetail()
        /*const filteredByCourse = gradeDetail
        .filter(detail => detail.activity_evaluation_detail.version_evaluation_detail.evaluation_version === Number(version_id))
          console.log('Filtered by course: ', filteredByCourse)*/
    }, [])

      useEffect(() => {
        if (filteredByActivities.length > 0) {
          const initialNotes = uniqueStudents.map((studentDetail) => {
          const studentNotes = {}
          
          // Llenar los RA con los valores de grade desde filteredByActivities
          filteredByActivities.forEach((detail) => {
            if (detail.enrolled_course.student.id === studentDetail.enrolled_course.student.id) {
              const RAId = detail.activity_evaluation_detail.version_evaluation_detail.learning_outcome
              studentNotes[RAId] = parseFloat(detail.grade) // Cargar el grade correspondiente al RA
            }
          })

          // Calcular la nota acumulada basándose en los valores iniciales de filteredByActivities
          const accumulatedNote = learningOutComes.reduce((acc, outcome) => {
            const outcomeId = outcome.id
            const outcomeWeight = outcome.weight
            const studentOutcomeNote = studentNotes[outcomeId] || 0
            return acc + (studentOutcomeNote * outcomeWeight) / 100
          }, 0)
      
            return {
              id: studentDetail.id,
              student_id: studentDetail.enrolled_course.student.id,
              ...studentNotes,  // Agregar las notas iniciales por RA
              accNote: accumulatedNote, // Se calculará después
            }
          })
          setNotes(initialNotes)
          //setIsInitialized(true)
        }
      }, [selectedActivityId])

      // Calcula las notas finales sumando todas las actividades
    const finalGrades = useMemo(() => {
      const grades = {};

      filteredByVersion.forEach((detail) => {
          const studentId = detail.enrolled_course.student.id
          const activityId = detail.activity_evaluation_detail.activities.id
          const percentage = detail.activity_evaluation_detail.percentage
          const grade = parseFloat(detail.grade)

          if (!grades[studentId]) grades[studentId] = {}
          if (!grades[studentId][activityId]) grades[studentId][activityId] = 0

          grades[studentId][activityId] += (grade * percentage) / 100
      })

      const result = {};
        Object.keys(grades).forEach((studentId) => {
            result[studentId] = Object.values(grades[studentId]).reduce((acc, curr) => acc + curr, 0)
        })

        return result
      }, [filteredByVersion])

      useEffect(() => {
        if (filteredByVersion && filteredByVersion.length > 0 && !selectedActivityId) {
          setSelectedActivityId(filteredByVersion[0].activity_evaluation_detail.activities.id)
          console.log("Activity ID seleccionado:", selectedActivityId)
        }
      }, [filteredByVersion, selectedActivityId])

      
      
      // Verificar que las actividades sean unicas en el combo box
      const uniqueActivities = Array.from(
        new Set(filteredByVersion.map((detail) => detail.activity_evaluation_detail.activities.id))
      ).map((id) => {
        return filteredByVersion.find((detail) => detail.activity_evaluation_detail.activities.id === id)
      })
      console.log('Unique Activities: ', uniqueActivities)

      const handleNoteChange = (studentId, RAId, version_id, value) => {
        
        console.log("Student ID:", studentId) // Verificar el ID del estudiante
        console.log("Version evaluation detail ID:", version_id)  // Verificar el ID del version evaluation detail
        //console.log("FilteredByActivities:", filteredByActivities)
        
        // Crear el JSON cuando se modifica la nota
        const updatedGrade = filteredByActivities.find((detail) => {
          return detail.enrolled_course.student.id === studentId &&
                detail.activity_evaluation_detail.version_evaluation_detail.id === version_id
        })
        console.log('Update grade: ', updatedGrade)

        if (updatedGrade) {
          const jsonGradeDetailLearningOutCome = {
            enrolled_course_id: updatedGrade.enrolled_course.id, // Obtener el enrolled_course_id
            activity_evaluation_detail_id: updatedGrade.activity_evaluation_detail.id, // Obtener el activity_evaluation_detail_id
            grade: parseFloat(value) // La nueva nota modificada
          }

          console.log('JSON Grade detail:', jsonGradeDetailLearningOutCome) 
          updateGradeDetail(updatedGrade.id, jsonGradeDetailLearningOutCome)
          .then(() => {
            getGradeDetail()
            const newNotes = notes.map((note) => {
              //console.log('note id:',note.student_id)
              if (note.student_id === studentId) {
                const updatedNote = {
                  ...note,
                  [RAId]: parseFloat(value), // Actualiza la nota para el RA específico
                }
          
                // Calcular la nota acumulada basándose en los pesos de los resultados de aprendizaje
                const accumulatedNote = learningOutComes.reduce((acc, outcome) => {
                  const outcomeId = outcome.id;
                  const outcomeWeight = outcome.weight;
                  const studentOutcomeNote = updatedNote[outcomeId] || 0
                  return acc + (studentOutcomeNote * outcomeWeight) / 100
                }, 0)
          
                updatedNote.accNote = accumulatedNote
          
                return updatedNote
              }
              return note
            })
            setNotes(newNotes)
            toast.success(`Al estudiante ${updatedGrade.enrolled_course.student.name} se le cambió la calificación en el ${updatedGrade.activity_evaluation_detail.version_evaluation_detail.learning_outcome}`)
          })
          .catch(error => {
            console.log('Error al actualizar la nota detalle: ', error)
            toast.error('Error al actualizar la nota detalle: ', error)
          })    
        }

        
      }
      

    // Render table headers
    const renderTableHeaders = () => (
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">Estudiantes</th>
                {learningOutComes.map((outcome) => (
                <th key={outcome.id} scope="col" className="px-6 py-3">
                    {`${outcome.id} - ${outcome.weight}%`}
                </th>
                ))}
                <th scope="col" className="px-6 py-3">Escala</th>
                <th scope="col" className="px-6 py-3">Nota acumulada - Max: {max.toFixed(2)}</th>
                <th scope="col" className="px-6 py-3">Nota Final</th>
            </tr>
        </thead>
    )

    // Render table rows
  const renderTableRows = () => (
    <tbody>
       {uniqueStudents.map((detail) => {
        const studentNote = notes.find((note) => note.id === detail.id)
        if (!studentNote) return null

        const nameStudent = detail.enrolled_course.student.name
        //const grade = detail.grade
        const studentId = detail.enrolled_course.student.id
        const finalGrade = finalGrades[studentId] || 0

        return (
          <tr
            key={detail.id}
            className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
          >
            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <span>{nameStudent}</span>
            </td>
            {learningOutComes.map((outcome) => (
              <td key={outcome.id} className="px-6 py-4">
                <input
                  type="number"
                  min={0}
                  max={5}
                  onWheel={(e) => e.target.blur()}
                  value={notes.find(note => note.id === detail.id)?.[outcome.id] || 0.00}
                  onChange={(e) =>
                    handleNoteChange(detail.enrolled_course.student.id, outcome.id, outcome.version_id, e.target.value)
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                /> 
              </td>
            ))}
            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <input
                type="number"
                value={((studentNote.accNote / max) * 5).toFixed(2)}
                readOnly
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </td>
            <td className="px-6 py-4">
              <input
                type="number"
                value={studentNote.accNote.toFixed(2)}
                readOnly
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </td>
            <td className="px-6 py-4">
                <input
                    type="number"
                    value={finalGrade.toFixed(2)}
                    readOnly
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 />
            </td>
          </tr>
        )
      })}            
    </tbody>
  )

    return(
      <div className="grid gap-2">
        <span>Calificaciones del curso {groupedCourse[0].name}</span>
        {filteredByGroup != 0 ? 
        <div>
        <label className="text-sm">Grupos:</label>
        <select 
          id="activity_course" 
          name='activities' 
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(e) => setSelectedScheduledId(e.target.value)}
        >
                    <option disabled>Grupos</option>
                    {uniqueGroups.map((detail) => (
                      <option
                        key={`group_${detail.enrolled_course.scheduled_course.id}`}
                        value={detail.enrolled_course.scheduled_course.id}
                      >
                        {detail.enrolled_course.scheduled_course.group}
                      </option>
                    ))}
        </select>
        <label className="text-sm">Actividades:</label>
        <select 
          id="activity_course" 
          name='activities' 
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(e) => setSelectedActivityId(e.target.value)}
        >
                    <option disabled>Seleccione una actividad</option>
        {uniqueActivities &&
          uniqueActivities.map((detail) => (
            <option
              key={`set_activity_${detail.activity_evaluation_detail.activities.id}`}
              value={detail.activity_evaluation_detail.activities.id}
            >
              {`${detail.activity_evaluation_detail.activities.name}`}
            </option>
                    ))}
        </select>
        <div>
          {/*filteredByVersion.map((detail) => (
            <div key={`activityGrade_${detail.id}`}>
              <span>Activity selected: {selectedActivityId} - </span>
              <span>{detail.id} - {detail.grade} - {detail.enrolled_course.student.name} - </span>
              <span>{detail.activity_evaluation_detail.activities.name} - {detail.activity_evaluation_detail.percentage}% - </span>
              <span>{detail.activity_evaluation_detail.version_evaluation_detail.learning_outcome} - </span>  
              <span>Versión id: {detail.activity_evaluation_detail.version_evaluation_detail.evaluation_version}</span>      
            </div>
          ))*/}
        </div>
        <form className='form flex flex-col gap-4 mt-4'>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              {renderTableHeaders()}
              {renderTableRows()}
              </table>
        </form>
        </div>
        : <div><span>Aún no hay estudiantes matriculados para este curso</span></div>  
        }
        <div className="flex justify-end gap-2">
          <GoBackButton label='Volver' route='/course-list/'/>
        </div>
      </div>
    )
}
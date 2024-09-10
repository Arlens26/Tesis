import { useEffect, useState } from "react"
import { useEnrolledStudent } from "../hooks/useEnrolledStudent"
import { toast } from "sonner"

export function ActivityRating() {

    const { getGradeDetail, gradeDetail, updateGradeDetail } = useEnrolledStudent()
    const [selectedActivityId, setSelectedActivityId] = useState(null)


    const filteredByActivities = gradeDetail
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
    console.log('Notes: ',notes)
    const [isInitialized, setIsInitialized] = useState(false)

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
        getGradeDetail()
    }, [])

      useEffect(() => {
        if (filteredByActivities.length > 0 && !isInitialized) {
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
          setIsInitialized(true)
        }
      }, [filteredByActivities, uniqueStudents, isInitialized])

      useEffect(() => {
        if (gradeDetail && gradeDetail.length > 0) {
          setSelectedActivityId(gradeDetail[0].activity_evaluation_detail.activities.id)
          console.log("Activity ID seleccionado:", selectedActivityId)
        }
      }, [gradeDetail])

      
      
      // Verificar que las actividades sean unicas en el combo box
      const uniqueActivities = Array.from(
        new Set(gradeDetail.map((detail) => detail.activity_evaluation_detail.activities.id))
      ).map((id) => {
        return gradeDetail.find((detail) => detail.activity_evaluation_detail.activities.id === id)
      })

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
          toast.success(`Al estudiante ${updatedGrade.enrolled_course.student.name} se le cambió la calificación en el ${updatedGrade.activity_evaluation_detail.version_evaluation_detail.learning_outcome}`)
        }

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
                <th scope="col" className="px-6 py-3">Nota acumulada - Max: {max}</th>
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
                  value={notes.find(note => note.id === detail.id)?.[outcome.id] || ""}
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
          </tr>
        )
      })}            
    </tbody>
  )

    return(
      <>
        <span>Calificicaciones</span>
        <div>
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
      {gradeDetail.map((detail) => (
        <div key={`activityGrade_${detail.id}`}>
          <span>Activity selected: {selectedActivityId} - </span>
          <span>{detail.id} - {detail.grade} - {detail.enrolled_course.student.name} - </span>
          <span>{detail.activity_evaluation_detail.activities.name} - {detail.activity_evaluation_detail.percentage}% - </span>
          <span>{detail.activity_evaluation_detail.version_evaluation_detail.learning_outcome} - </span>        
        </div>
      ))}
    </div>
        </div>
        <form className='form flex flex-col gap-4 mt-4'>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            {renderTableHeaders()}
            {renderTableRows()}
            </table>
        </form>
      </>
    )
}
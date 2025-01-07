import { useEffect, useState } from "react"
import { useEnrolledStudent } from "../hooks/useEnrolledStudent"
import LineChart from "./LineChart"

export function StudentGradeReport() {
    const { getStudentGradeReport, studentGradeReport } = useEnrolledStudent()
    console.log('Student grade report: ', studentGradeReport)
    const [selectedPeriodId, setSelectedPeriodId] = useState(null)
    console.log('Select period id: ', selectedPeriodId)
    const [selectedScheduledCourseId, setSelectedScheduledCourseId] = useState(null)
    console.log('Select scheduled course id: ', selectedScheduledCourseId)
    //const scores = [20, 40, 80, 10]
    const [selectedStudentId, setSelectedStudentId] = useState(null)
    console.log('student id: ', selectedStudentId)
    
    useEffect(() => {
        getStudentGradeReport()
    }, [])

    const filteredByAcademicPeriod = studentGradeReport
        .filter(detail => detail.student_enrolled_course.scheduled_course.academic_period.id === Number(selectedPeriodId))
    console.log('Filtered by Academic Period: ', filteredByAcademicPeriod)

    const filteredByScheduledCourse = filteredByAcademicPeriod
        .filter(detail => detail.student_enrolled_course.scheduled_course.id === Number(selectedScheduledCourseId))
    console.log('Filtered by Scheduled course: ', filteredByScheduledCourse)

    const uniqueScheduledCourses = Array.from(
        new Set(filteredByScheduledCourse.map(detail => 
            detail.student_enrolled_course.scheduled_course.id
        ))
    ).map(id => {
        const courseDetail = filteredByScheduledCourse.find(
            detail => detail.student_enrolled_course.scheduled_course.id === id
        )
        return {
            id: courseDetail.student_enrolled_course.scheduled_course.id,
            group: courseDetail.student_enrolled_course.scheduled_course.group,
            courseName: courseDetail.student_enrolled_course.scheduled_course.evaluation_version.course.name
        }
    })
    console.log('Unique scheduled course: ', uniqueScheduledCourses)

    const uniqueStudents = filteredByScheduledCourse.map(detail => ({
        id: detail.student_enrolled_course.student.id,
        firstName: detail.student_enrolled_course.student.first_name,
        lastName: detail.student_enrolled_course.student.last_name
    }))
    console.log('Unique students: ', uniqueStudents)
    /*const filteredByStudents = filteredByAcademicPeriod
        .filter(detail => detail.student_enrolled_course.scheduled_course.id === Number(selectedScheduledCourseId))
    console.log('filtered students: ', filteredByStudents)*/

    useEffect(() => {
        if (filteredByAcademicPeriod.length > 0 && !selectedScheduledCourseId) {
            setSelectedScheduledCourseId(filteredByAcademicPeriod[0].id)
        }
    }, [filteredByAcademicPeriod])

    useEffect(() => {
        if (filteredByAcademicPeriod.length > 0 && !selectedScheduledCourseId) {
            setSelectedScheduledCourseId(filteredByAcademicPeriod[0].student_enrolled_course.scheduled_course.id)
        }
    }, [filteredByAcademicPeriod])

    // Filtrar los cursos por periodo académico seleccionado
    const uniqueAcademicPeriod = Array.from(
        new Set(studentGradeReport.map((detail) => detail.student_enrolled_course.scheduled_course.academic_period.id))
    ).map((id) => {
        return studentGradeReport.find((detail) => detail.student_enrolled_course.scheduled_course.academic_period.id === id)
    })
    console.log('Unique Academic Period: ', uniqueAcademicPeriod)

    const sortedAcademicPeriods = uniqueAcademicPeriod.sort((a, b) => {
        if(b.period.year !== a.period.year){
            return b.period.year - a.period.year
        }
        return b.period.semester - a.period.semester
    })

    useEffect(() => {
        if (sortedAcademicPeriods && sortedAcademicPeriods.length > 0) {
            if (!selectedPeriodId) {
                setSelectedPeriodId(sortedAcademicPeriods[0].student_enrolled_course.scheduled_course.academic_period.id)
            } 
            /*else {
                // Filtrar los cursos disponibles en el nuevo periodo
                const newFilteredCourses = allScheduledCourse.filter(detail => detail.period.id === Number(selectedPeriodId))
                // Verificar si el curso previamente seleccionado sigue disponible
                const isCourseAvailable = newFilteredCourses.some(course => course.id === selectedScheduledCourseId)
    
                if (!isCourseAvailable) {
                    // Si el curso no está disponible, seleccionar el primero o null
                    setSelectedScheduledCourseId(newFilteredCourses.length > 0 ? newFilteredCourses[0].id : null)
                }
            }*/
        }
    }, [selectedPeriodId, studentGradeReport])

    //const labels = filteredByAcademicPeriod[0].grade_detail_learning_outcome.map(item => item.code)
    //const dataPoints = filteredByAcademicPeriod[0].grade_detail_learning_outcome.map(item => item.grade)

    // Extraer todos los códigos únicos
const codes = Array.from(new Set(filteredByAcademicPeriod.flatMap(item => 
    item.grade_detail_learning_outcome.map(grade => grade.code)
  )))
  console.log('codes: ', codes)
  
  // Crear un objeto que asocie cada código con las calificaciones de cada estudiante
  const studentGrades = filteredByAcademicPeriod.map(item => {
      const grades = {}
      item.grade_detail_learning_outcome.forEach(grade => {
          grades[grade.code] = grade.grade
      })
      return {
          studentName: `${item.student_enrolled_course.student.first_name} ${item.student_enrolled_course.student.last_name}`,
          grades: grades,
      }
  })
  
  // Crear datasets para cada código basado en las calificaciones de los estudiantes
  /*const datasets = codes.map(code => ({
      label: code,
      backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.4)`,
      borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
      data: studentGrades.map(student => student.grades[code] || 0), // Asignar 0 si no hay calificación
      fill: true,
  }))*/
    const datasets = studentGrades.map(student => ({
        label: student.studentName,
        backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.4)`,
        borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
        data: codes.map(code => student.grades[code] || 0), // Asignar 0 si no hay calificación
        fill: true,
    }))
  console.log('datasets', datasets)
  
  //const labels = studentGrades.map(student => student.studentName)

    return(
        <>
            <h1 className="text-xl">Reportes:</h1>
            <label className="text-sm">Periodo académico:</label>
            <select 
                id="academic_period" 
                name='academic_periods' 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setSelectedPeriodId(e.target.value)}
            >
                <option disabled>Seleccione un periodo académico</option>
                {sortedAcademicPeriods &&
                    sortedAcademicPeriods.map((detail) => (
                    <option
                        key={`set_academic_period_${detail.student_enrolled_course.scheduled_course.academic_period.id}`}
                        value={detail.student_enrolled_course.scheduled_course.academic_period.id}
                    >
                        {`${detail.student_enrolled_course.scheduled_course.academic_period.year}-${detail.student_enrolled_course.scheduled_course.academic_period.semester}`}
                    </option>
                ))}
            </select>
            <label className="text-sm">Curso programado:</label>
            <select 
                id="scheduled_course" 
                name='scheduled_courses' 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                //onChange={handleScheduledCourseChange}
            >
                <option disabled>Seleccione el curso programado</option>
                {uniqueScheduledCourses.map((course) => (
                    <option
                        key={`set_scheduled_course_${course.id}`}
                        value={course.id}
                    >
                        {`${course.group} - ${course.courseName}`}
                    </option>
                ))}
            </select>

            <label className="text-sm">Estudiante:</label>
            <select 
                id="student" 
                name='students'
                value={selectedStudentId || ''}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setSelectedStudentId(e.target.value)}
            >
                <option value="">Todos los estudiantes</option>
                {uniqueStudents.map((student) => (
                    <option
                        key={`student_${student.id}`}
                        value={student.id}
                    >
                        {`${student.firstName} ${student.lastName}`}
                    </option>
                ))}
            </select>
            <div>
                <LineChart labels={codes} datasets={datasets} />
            </div>
        </>
    )
}
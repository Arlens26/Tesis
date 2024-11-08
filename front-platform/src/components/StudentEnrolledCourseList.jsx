import { useEffect, useState } from "react"
import { useEnrolledStudent } from "../hooks/useEnrolledStudent"
import { useNavigate } from "react-router-dom"

export function StudentEnrolledCourseList(){
    const navigate = useNavigate()
    const { getStudentEnrolledCourse, studentEnrolledCourse } = useEnrolledStudent()
    console.log('Lista de student enrolled: ',studentEnrolledCourse)
    const [selectedPeriodId, setSelectedPeriodId] = useState()

    useEffect(() =>{
        getStudentEnrolledCourse()
    }, [])

    const uniqueAcademicPeriod = Array.from(
        new Set(studentEnrolledCourse.map((detail) => detail.scheduled_course.academic_period.id))
    ).map((id) => {
        return studentEnrolledCourse.find((detail) => detail.scheduled_course.academic_period.id === id)
    })
    console.log('Unique Academic Period: ', uniqueAcademicPeriod)

    const sortedAcademicPeriods = uniqueAcademicPeriod.sort((a, b) => {
        if(b.scheduled_course.academic_period.year !== a.scheduled_course.academic_period.year){
            return b.scheduled_course.academic_period.year - a.scheduled_course.academic_period.year
        }
        return b.scheduled_course.academic_period.semester - a.scheduled_course.academic_period.semester
    })
    console.log('Sorted Academic Period: ', sortedAcademicPeriods)

    const filteredByAcademicPeriod = studentEnrolledCourse
    .filter(detail => detail.scheduled_course.academic_period.id === Number(selectedPeriodId))
    .reduce((acc, detail) => {
        const courseId = detail.scheduled_course.evaluation_version.course.id
        const group = detail.scheduled_course.group

        // Verificamos si ya existe el curso con ese grupo en el acumulador
        const exists = acc.some(item => 
            item.scheduled_course.evaluation_version.course.id === courseId && 
            item.scheduled_course.group === group
        );

        // Si no existe, lo agregamos al acumulador
        if (!exists) {
            acc.push(detail)
        }

        return acc
    }, [])
    console.log('Filtered by Academic Period: ', filteredByAcademicPeriod)

    const groupedStudents = studentEnrolledCourse
    .filter(detail => detail.scheduled_course.academic_period.id === Number(selectedPeriodId))
    .reduce((acc, detail) => {
        const courseName = detail.scheduled_course.evaluation_version.course.name
        const groupId = detail.scheduled_course.group
        const status = detail.active
        //const studentId = detail.student
        
        //console.log('detail grouped students: ', courseId, groupId, studentId)
        if (!acc[courseName]) {
            acc[courseName] = {}
        }

        if (!acc[courseName][groupId]) {
            acc[courseName][groupId] = []
        }

        // Agregamos los estudiantes matriculados en el curso y grupo
        acc[courseName][groupId].push({student: detail.student, status: status, scheduled_course: detail.scheduled_course})
        
        return acc
    }, {})
    console.log('Grouped students: ', groupedStudents)

    const groupedCourses = filteredByAcademicPeriod
    .filter(detail => detail.scheduled_course.academic_period.id === Number(selectedPeriodId))
    .reduce((acc, detail) => {
        console.log('detail grouped courses:', acc)
        const courseId = detail.scheduled_course.evaluation_version.course.id
        
        // Verificamos si el curso ya existe en el acumulador
        if (!acc[courseId]) {
            acc[courseId] = {
                course: detail.scheduled_course.evaluation_version.course,
                groups: [],
                //students: []
            }
        }
        // Agregamos el grupo al curso
        acc[courseId].groups.push(detail.scheduled_course)
        // Agregamos los estudiantes matriculados en el curso
        //acc[courseId].students.push(detail.student_id)
        
        return acc
    }, {})
    console.log('Grouped courses: ', groupedCourses)

    useEffect(() => {
        if (studentEnrolledCourse.length > 0 && !selectedPeriodId) {
            const firstPeriodId = sortedAcademicPeriods[0]?.scheduled_course?.academic_period?.id
            if (firstPeriodId) setSelectedPeriodId(firstPeriodId)
        }
    }, [studentEnrolledCourse])
    
    return(
        <div className="grid gap-2">
        <h1 className="text-xl">Programación académica</h1>
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
                    key={`set_academic_period_${detail.scheduled_course.academic_period.id}`}
                    value={detail.scheduled_course.academic_period.id}
                >
                    {`${detail.scheduled_course.academic_period.year}-${detail.scheduled_course.academic_period.semester}`}
                </option>
            ))}
        </select>
        {Object.values(groupedCourses).map(({ course, groups }) => (
            <>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3" colSpan={3}>
                            {course.code} - {course.name}
                        </th>
                        <th scope="col" className="px-6 py-3" colSpan={2}> 
                            Créditos: {course.credit}
                        </th>
                    </tr>
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Periodo académico
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Grupo
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Profesor
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Programada para el Programa Académico
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Lista estudiantes
                        </th>
                    </tr>
                </thead>
                <tbody>
                {groups.map((groupDetail) => (
                        <tr key={groupDetail.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {groupDetail.academic_period.year} - {groupDetail.academic_period.semester}
                            </th>
                            <td className="px-6 py-4">
                                {groupDetail.group}
                            </td>
                            <td className="px-6 py-4">
                                {groupDetail.professor.first_name} {groupDetail.professor.last_name}
                            </td>
                            <td className="px-6 py-4">
                                
                            </td>
                            <button className='bg-btn-edit opacity-80 px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'
                               onClick={() => {
                                navigate('/enrolled-student-list', { state: { courseName: course.name, groupId: groupDetail.group, students: groupedStudents[course.name][groupDetail.group] } })
                            }} 
                            >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-list">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M9 6l11 0" />
                                        <path d="M9 12l11 0" />
                                        <path d="M9 18l11 0" />
                                        <path d="M5 6l0 .01" />
                                        <path d="M5 12l0 .01" />
                                        <path d="M5 18l0 .01" />
                                    </svg>
                                <span>Estudiantes</span>
                            </button>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
            </>
        ))} 
        </div>
    )
}
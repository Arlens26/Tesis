import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { useScheduledCourse } from '../../scheduled_course/hooks/useSheduledCourse'
import { useEnrolledStudent } from '../hooks/useEnrolledStudent'
import { toast } from "sonner"
import { SaveIcon } from '../../components/Icons'

export function EnrolledStudent() {
    const [students, setStudents] = useState([])
    const { getAllScheduledCourse, allScheduledCourse } = useScheduledCourse()
    const { createStudentEnrolledCourse } = useEnrolledStudent()
    const [selectedPeriodId, setSelectedPeriodId] = useState(null)
    const [selectedScheduledCourseId, setSelectedScheduledCourseId] = useState(null)
    const [professorName, setProfessorName] = useState('')

    // Filtrar los cursos por periodo académico seleccionado
    const uniqueAcademicPeriod = Array.from(
        new Set(allScheduledCourse.map((detail) => detail.period.id))
    ).map((id) => {
        return allScheduledCourse.find((detail) => detail.period.id === id)
    })
    console.log('Unique Academic Period: ', uniqueAcademicPeriod)

    const sortedAcademicPeriods = uniqueAcademicPeriod.sort((a, b) => {
        if(b.period.year !== a.period.year){
            return b.period.year - a.period.year
        }
        return b.period.semester - a.period.semester
    })

    const filteredByAcademicPeriod = allScheduledCourse
        .filter(detail => detail.period.id === Number(selectedPeriodId))
    console.log('Filtered by Academic Period: ', filteredByAcademicPeriod)

    useEffect(() => {
        getAllScheduledCourse()
    }, [])

    useEffect(() => {
        if (sortedAcademicPeriods && sortedAcademicPeriods.length > 0) {
            if (!selectedPeriodId) {
                setSelectedPeriodId(sortedAcademicPeriods[0].period.id)
            } else {
                // Filtrar los cursos disponibles en el nuevo periodo
                const newFilteredCourses = allScheduledCourse.filter(detail => detail.period.id === Number(selectedPeriodId))
                // Verificar si el curso previamente seleccionado sigue disponible
                const isCourseAvailable = newFilteredCourses.some(course => course.id === selectedScheduledCourseId)
    
                if (!isCourseAvailable) {
                    // Si el curso no está disponible, seleccionar el primero o null
                    setSelectedScheduledCourseId(newFilteredCourses.length > 0 ? newFilteredCourses[0].id : null)
                }
            }
        }
    }, [sortedAcademicPeriods, selectedPeriodId, allScheduledCourse])

    /*useEffect(() => {
        if (filteredByAcademicPeriod && filteredByAcademicPeriod.length > 0 && selectedScheduledCourseId !== filteredByAcademicPeriod[0].id) {
          setSelectedScheduledCourseId(filteredByAcademicPeriod[0].id)
          console.log("Curso programado ID seleccionado:", selectedScheduledCourseId)
        } else if (filteredByAcademicPeriod.length === 0 && selectedScheduledCourseId !== null) {
            setSelectedScheduledCourseId(null) // Resetear si no hay cursos
        }
    }, [filteredByAcademicPeriod, selectedScheduledCourseId])*/

    useEffect(() => {
        if (filteredByAcademicPeriod.length > 0 && !selectedScheduledCourseId) {
            setSelectedScheduledCourseId(filteredByAcademicPeriod[0].id)
        }
    }, [filteredByAcademicPeriod])

    useEffect(() => {
        if (filteredByAcademicPeriod.length > 0) {
            const selectedCourse = filteredByAcademicPeriod.find(detail => detail.id === Number(selectedScheduledCourseId))
            console.log('Select course: ', selectedCourse)
            //console.log('Select scheduled: ',selectedScheduledCourseId)
            if (selectedCourse) {
                const professor = selectedCourse.professor
                setProfessorName(`${professor.first_name} ${professor.last_name}`)
            } else {
                setProfessorName('') // Limpiar si no se encuentra
            }
        }
    }, [filteredByAcademicPeriod, selectedScheduledCourseId])

    const handleScheduledCourseChange = (e) => {
        const selectedCourseId = Number(e.target.value)
        console.log('Selected course ID: ',selectedCourseId)
        setSelectedScheduledCourseId(selectedCourseId)

        // Buscar el curso programado seleccionado
        const selectedCourse = filteredByAcademicPeriod.find(detail => detail.id === selectedCourseId)
        
        // Si se encuentra, actualizar el nombre del profesor
        if (selectedCourse) {
            const professor = selectedCourse.professor
            setProfessorName(`${professor.first_name} ${professor.last_name}`)
        } else {
            setProfessorName('') // Limpiar si no se encuentra
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result)
                const workbook = XLSX.read(data, { type: 'array' })
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
                const jsonData = XLSX.utils.sheet_to_json(firstSheet)

                const result = jsonData.map(item => {
                    const firstInitial = item.Nombres.charAt(0).toUpperCase()
                    const lastInitial = item.Apellidos.charAt(0).toUpperCase()
                    
                    const identification = item.Cédula

                    const password = `${firstInitial}${identification}${lastInitial}`

                    return {
                        first_name: item.Nombres,
                        last_name: item.Apellidos,
                        identification: item.Cédula,
                        email: item.Correo,
                        code: item.Código,
                        code_schedule: item.Programa,
                        password: password 
                    }
                })
                console.log('Resultado estudiantes: ', result)
                setStudents(result)
            }
            reader.readAsArrayBuffer(file)
        }
    }

    // Crear el JSON con el scheduled_course_id seleccionado y la lista de estudiantes
    const createStudentEnrolledData = () => {
        if (!selectedScheduledCourseId) {
            console.error('No se ha seleccionado un curso programado.');
            return
        }

        const studentEnrolledData = {
            scheduled_course_id: selectedScheduledCourseId,
            students: students.map(student => ({
                first_name: student.first_name,
                last_name: student.last_name,
                email: student.email,
                code_schedule: student.code_schedule,
                code: student.code,
                password: student.password
            }))
        }

        if (studentEnrolledData.students.length === 0) {
            toast.error('No se ha cargado información de estudiantes')
            return
        }

        console.log('JSON Scheduled course and students:', studentEnrolledData)
        createStudentEnrolledCourse(studentEnrolledData)
            .then(() => {
                //console.log('Estudiantes matriculados correctamente')
                toast.success('Estudiantes matriculados correctamente')
            .catch((error) => {
                //console.error('Error al matricular los estudiantes:', error)
                toast.error('Error al matricular los estudiantes:', error)
            })
         })
        return studentEnrolledData
    }

    return(
        <>
        <h1 className="text-xl">Matrícula estudiantes</h1>
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
                    key={`set_academic_period_${detail.period.id}`}
                    value={detail.period.id}
                >
                    {`${detail.period.year}-${detail.period.semester}`}
                </option>
            ))}
        </select>
        
        <label className="text-sm">Curso programado:</label>
        <select 
            id="scheduled_course" 
            name='scheduled_courses' 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={handleScheduledCourseChange}
        >
            <option disabled>Seleccione el curso programado</option>
            {filteredByAcademicPeriod &&
                filteredByAcademicPeriod.map((detail) => (
                <option
                    key={`set_scheduled_course_${detail.id}`}
                    value={detail.id}
                >
                    {`${detail.group} - ${detail.course.name}`}
                </option>
            ))}
        </select>
        
        <label className="text-sm">Profesor:</label>
        <input type="text" placeholder='' name='name_course' value={professorName} disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
        
        <div className='p-4'>
            {/*filteredByAcademicPeriod.map((detail) => (
                <div key={`activityGrade_${detail.id}`}>
                    <span>Academic period selected: {selectedPeriodId} - </span>
                    <span>Scheduled course selected: {selectedScheduledCourseId}</span>
                </div>
            ))*/}
            {/*
                allScheduledCourse.map((item, index) => (
                    <div key={index}>
                        <span>Grupo: {item.group}</span>
                        <span> - Curso: {item.course.name}</span>
                        <span> - Profesor: {item.professor.first_name}</span>
                    </div>
                ))
            */}
        </div>
        
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Cargar el archivo
        </label>
        <input onChange={handleFileChange} 
        accept='.xlsx .xls'
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
        id="file_input" type="file"/>
        
        <div className="mt-4">
            <h2 className="text-lg font-bold">Lista de Estudiantes</h2>
            {students.length > 0 ? (
                <>
                    <ul className="list-disc pl-5">
                        {students.map((student, index) => (
                            <li key={index}>
                                {student.first_name} {student.last_name} - ID: {student.identification} - Email: {student.email} - Código programa: {student.code_schedule} - Código: {student.code} - Contraseña: {student.password}
                            </li>
                        ))}
                    </ul>
                    

<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Estudiante
                </th>
                <th scope="col" className="px-6 py-3">
                    Identificación
                </th>
                <th scope="col" className="px-6 py-3">
                    Email
                </th>
                <th scope="col" className="px-6 py-3">
                    Código programa
                </th>
                <th scope="col" className="px-6 py-3">
                    Código
                </th>
            </tr>
        </thead>
        <tbody>
            {students.map((student, index) => (
                <>
                <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {student.first_name} {student.last_name}
                    </th>
                    <td className="px-6 py-4">
                        {student.identification}
                    </td>
                    <td className="px-6 py-4">
                        {student.email}
                    </td>
                    <td className="px-6 py-4">
                        {student.code_schedule}
                    </td>
                    <td className="px-6 py-4">
                        {student.code}
                    </td>
                </tr>
                </>
            ))}
        </tbody>
    </table>
</div>

                </>
            ) : (
                <p>No hay estudiantes para mostrar.</p>
            )}
        </div>
        <button onClick={createStudentEnrolledData} type='submit' 
            className='bg-btn-create opacity-80 w-fit px-20 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'>
            <SaveIcon/>
            <span className="ml-1">Guardar</span>
        </button>
        </>
    )
}

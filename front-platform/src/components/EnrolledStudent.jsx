import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { useScheduledCourse } from '../hooks/useSheduledCourse'

export function EnrolledStudent() {
    const [students, setStudents] = useState([])
    const { getAllScheduledCourse, allScheduledCourse } = useScheduledCourse()

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

    const filteredByAcademicPeriod = allScheduledCourse
        .filter(detail => detail.period.id === Number(selectedPeriodId))
    console.log('Filtered by Academic Period: ', filteredByAcademicPeriod)

    useEffect(() => {
        getAllScheduledCourse()
    }, [])

    useEffect(() => {
        if (uniqueAcademicPeriod && uniqueAcademicPeriod.length > 0 && !selectedPeriodId) {
          setSelectedPeriodId(uniqueAcademicPeriod[0].period.id)
          console.log("Academic Period ID seleccionado:", selectedPeriodId)
        }
    }, [uniqueAcademicPeriod, selectedPeriodId])

    useEffect(() => {
        if (filteredByAcademicPeriod && filteredByAcademicPeriod.length > 0 && selectedScheduledCourseId !== filteredByAcademicPeriod[0].id) {
          setSelectedScheduledCourseId(filteredByAcademicPeriod[0].id)
          console.log("Curso programado ID seleccionado:", selectedScheduledCourseId)
        } else if (filteredByAcademicPeriod.length === 0 && selectedScheduledCourseId !== null) {
            setSelectedScheduledCourseId(null) // Resetear si no hay cursos
        }
    }, [filteredByAcademicPeriod, selectedScheduledCourseId])

    useEffect(() => {
        if (filteredByAcademicPeriod.length > 0) {
            const selectedCourse = filteredByAcademicPeriod.find(detail => detail.id === selectedScheduledCourseId)
            console.log('Select course: ', selectedCourse)
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
            {uniqueAcademicPeriod &&
                uniqueAcademicPeriod.map((detail) => (
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
            {filteredByAcademicPeriod.map((detail) => (
                <div key={`activityGrade_${detail.id}`}>
                    <span>Academic period selected: {selectedPeriodId} - </span>
                    <span>Scheduled course selected: {selectedScheduledCourseId}</span>
                </div>
            ))}
            {
                allScheduledCourse.map((item, index) => (
                    <div key={index}>
                        <span>Grupo: {item.group}</span>
                        <span> - Curso: {item.course.name}</span>
                        <span> - Profesor: {item.professor.first_name}</span>
                    </div>
                ))
            }
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
                <ul className="list-disc pl-5">
                    {students.map((student, index) => (
                        <li key={index}>
                            {student.first_name} {student.last_name} - ID: {student.identification} - Email: {student.email} - Código programa: {student.code_schedule} - Código: {student.code} - Contraseña: {student.password}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay estudiantes para mostrar.</p>
            )}
        </div>
        </>
    )
}

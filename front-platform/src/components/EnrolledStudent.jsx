import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { useEnrolledStudent } from '../hooks/useEnrolledStudent'

export function EnrolledStudent() {
    const [students, setStudents] = useState([])
    const { getStudentEnrolledCourse, studentEnrolledCourse } = useEnrolledStudent()

    const [selectedPeriodId, setSelectPeriodId] = useState(null)
    //console.log('Selected period id: ', selectedPeriodId)

    // Verificar que el cursos programados sean únicos
    const uniqueScheduledCourse = Array.from(
        new Set(studentEnrolledCourse.map((detail) => detail.scheduled_course.id))
      ).map((id) => {
        return studentEnrolledCourse.find((detail) => detail.scheduled_course.id === id)
      })
      console.log('Unique Scheduled Course: ', uniqueScheduledCourse)

      const uniqueAcademicPeriod = Array.from(
        new Set(uniqueScheduledCourse.map((detail) => detail.scheduled_course.academic_period.id))
      ).map((id) => {
        return uniqueScheduledCourse.find((detail) => detail.scheduled_course.academic_period.id === id)
      })
      console.log('Unique Academic Period: ', uniqueAcademicPeriod)

    const filteredByAcademicPeriod = uniqueScheduledCourse
        .filter(detail => detail.scheduled_course.academic_period.id == Number(selectedPeriodId))
    console.log('Filtered by Academic Period: ', filteredByAcademicPeriod)

    useEffect(() => {
        getStudentEnrolledCourse()
    }, [])

    useEffect(() => {
        if (uniqueScheduledCourse && uniqueScheduledCourse.length > 0 && !selectedPeriodId) {
          setSelectPeriodId(uniqueScheduledCourse[0].scheduled_course.academic_period.id)
          console.log("Academic Period ID seleccionado:", selectedPeriodId)
        }
      }, [uniqueAcademicPeriod, selectedPeriodId])

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
                    };
                });
                console.log('Resultado estudiantes: ', result)
                setStudents(result)
            }
            reader.readAsArrayBuffer(file)
        }
    }

    return(
        <>
        <label className="text-sm">Periodo académico:</label>
          <select 
            id="academic_period" 
            name='academic_periods' 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => setSelectPeriodId(e.target.value)}
          >
            <option disabled>Seleccione un periodo académico</option>
            {uniqueAcademicPeriod &&
                uniqueAcademicPeriod.map((detail) => (
                <option
                    key={`set_academic_period_${detail.scheduled_course.academic_period.id}`}
                    value={detail.scheduled_course.academic_period.id}
                >
                    {`${detail.scheduled_course.academic_period.year}-${detail.scheduled_course.academic_period.semester}`}
                </option>
            ))}
          </select>

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
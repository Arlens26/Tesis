import { useLocation } from "react-router-dom"
import { useCourses } from "../hooks/useCourses"
import { useEvaluationVersionCourse } from "../hooks/useEvaluationVersionCourse"
import { useState, useEffect } from "react"
import { useScheduledCourse } from "../hooks/useSheduledCourse"

export function ScheduledCourse(){
    const { periods, getAcademicPeriods } = useEvaluationVersionCourse()
    const { getProfessors, professors, createScheduledCourse } = useScheduledCourse()
    console.log(professors)
    const { getCourse } = useCourses()
    const location = useLocation()
    const [versionId, setVersionId] = useState('')
    const [courseName, setCourseName] = useState('')
    const [courseCode, setCourseCode] = useState('')

    useEffect(()=>{
        getAcademicPeriods()
        getProfessors()
        const course_id = location.state.course_id
        const version_id = location.state.version_id
        console.log(version_id)
        console.log(periods)
        setVersionId(version_id)

        getCourse(course_id).then(course => {
            setCourseName(course.name)
            setCourseCode(course.code)
            console.log(course)
        })
    },[])

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target)
        const fields = Object.fromEntries(formData.entries());
        fields.version_id = versionId

        const academic_period = {
            //id: fields.period.split('-')[2],
            year: fields.period.split('-')[0],
            semester: fields.period.split('-')[1]
        }
        fields.academic_period = academic_period
        console.log(fields);
        createScheduledCourse(fields)
         .then(() => {
            console.log('Se creo el curso programado de manera correcta');
         })
         .catch((error) => {
            console.error('Error al crear curso programado:', error);
         });
    }
    
    
    return (
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <h1 className="text-xl">Programación curso</h1>
            <label className="text-sm">Versión evaluación</label>
            <input 
                type="text" 
                placeholder="" 
                name="version" 
                value={versionId} 
                disabled 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <label className="text-sm">Nombre del curso</label>
            <input type="text" placeholder='' name='name_course' value={courseName} disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
            <label className="text-sm">Código del curso</label>
            <input type="text" placeholder='' name='code_course' value={courseCode} disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
            <label className="text-sm">Periodo académico</label>
            <select id="period_id" name='period' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option disabled>Periodo académico</option>
                {periods && periods.map(period => (
                    <option key={period.id} value={`${period.year}-${period.semester}`}>
                        {`${period.year}-${period.semester}`}
                    </option>
                ))}
            </select>
            <label className="text-sm">Grupo</label>
            <input type="text" placeholder='Grupo' name='group' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
            <label className="text-sm">Profesor</label>
            <select id="professors" name='professor_id' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option disabled>Profesores</option>
                  {professors && professors.map(professor => (
                        <option key={professor.id} value={professor.id}>
                           {`${professor.first_name} ${professor.last_name}`}
                        </option>
                  ))}
            </select>
            <button type='submit' className='bg-btn-create opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100'>Guardar</button>
            <button type='submit' className='bg-btn-create opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100'>Volver</button>
        </form>
    )
}
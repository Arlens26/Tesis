import { useLocation, useNavigate } from "react-router-dom"
import { useCourses } from "../../courses/hooks/useCourses"
import { useEvaluationVersionCourse } from "../../evaluation_version/hooks/useEvaluationVersionCourse"
import { useState, useEffect } from "react"
import { useScheduledCourse } from "../hooks/useSheduledCourse"
import { toast } from "sonner"
import { GoBackButton } from "../../components/GoBackButton"
import { SaveIcon } from "../../components/Icons"
//import useBreadCrumb from "../../hooks/useBreadCrumb"

export function ScheduledCourse(){
    const { periods, getAcademicPeriods } = useEvaluationVersionCourse()
    const { getProfessors, professors, createScheduledCourse } = useScheduledCourse()
    console.log(professors)
    const { getCourse } = useCourses()
    const location = useLocation()
    const [versionId, setVersionId] = useState('')
    const [courseName, setCourseName] = useState('')
    const [courseCode, setCourseCode] = useState('')
    const navigate = useNavigate()

    //useBreadCrumb('Programación curso', '/scheduled-course')

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
        const fields = Object.fromEntries(formData.entries())
        fields.version_id = versionId

        const academic_period = {
            //id: fields.period.split('-')[2],
            year: fields.period.split('-')[0],
            semester: fields.period.split('-')[1]
        }
        fields.academic_period = academic_period
        //console.log('Fields: ', fields)
        const { period, group, professor_id, version_id } = fields
        if (!period || !group || !professor_id || !version_id) {
            toast.error('Por favor, completa todos los campos requeridos')
            return
        }
        createScheduledCourse(fields)
         .then(() => {
            toast.success('Se creo el curso programado de manera correcta')
            navigate('/course-list')
            //console.log('Se creo el curso programado de manera correcta')
         })
         .catch((error) => {
            toast.error('Error al crear curso programado:',  error)
            //console.error('Error al crear curso programado:', error)
         })
    }
    
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-primary">Programar Curso</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Información del Curso Programado</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">
                                Versión evaluación
                            </label>
                            <input 
                                type="text" 
                                id="version"
                                name="version" 
                                value={versionId} 
                                disabled 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label htmlFor="name_course" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre del curso
                            </label>
                            <input 
                                type="text" 
                                id="name_course"
                                name='name_course' 
                                value={courseName} 
                                disabled 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="code_course" className="block text-sm font-medium text-gray-700 mb-1">
                            Código del curso
                        </label>
                        <input 
                            type="text" 
                            id="code_course"
                            name='code_course' 
                            value={courseCode} 
                            disabled 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label htmlFor="period_id" className="block text-sm font-medium text-gray-700 mb-1">
                            Periodo académico
                        </label>
                        <select 
                            id="period_id" 
                            name='period' 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        >
                            <option disabled>Periodo académico</option>
                            {periods && periods.map(period => (
                                <option key={period.id} value={`${period.year}-${period.semester}`}>
                                    {`${period.year}-${period.semester}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">
                            Grupo
                        </label>
                        <input 
                            type="text" 
                            id="group"
                            placeholder='Grupo' 
                            name='group' 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div>
                        <label htmlFor="professors" className="block text-sm font-medium text-gray-700 mb-1">
                            Profesor
                        </label>
                        <select 
                            id="professors" 
                            name='professor_id' 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        >
                            <option disabled>Profesores</option>
                            {professors && professors.map(professor => (
                                <option key={professor.id} value={professor.id}>
                                    {`${professor.first_name} ${professor.last_name}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button type='submit' 
                            className='bg-btn-create opacity-80 w-fit px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-white gap-2'>
                            <SaveIcon/>
                            Guardar
                        </button>
                        <GoBackButton label='Volver' route='/course-list/'/> 
                    </div>
                </form>
            </div>
        </div>
    )
}
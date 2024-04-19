import { useLocation } from "react-router-dom"
import { useCourses } from "../hooks/useCourses"

export function ScheduledCourse(){
    const location = useLocation()
    const course_id = location.state.course_id
    const version_id = location.state.version_id
    console.log(version_id)
    const { getCourse } = useCourses()
    getCourse(course_id).then(course => {
        document.querySelector('input[name="name_course"]').value = course.name;
        document.querySelector('input[name="code_course"]').value = course.code;
        console.log(course)
    })
    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-xl">Programación curso</h1>
            <label className="text-sm">Versión evaluación</label>
            <input type="text" placeholder='' name='version' disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
            <label className="text-sm">Nombre del curso</label>
            <input type="text" placeholder='' name='name_course' disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
            <label className="text-sm">Código del curso</label>
            <input type="text" placeholder='' name='code_course' disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
            <label className="text-sm">Periodo académico</label>
            <select id="countries" name='period_id' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option disabled>Periodo académico</option>
            </select> 
            <label className="text-sm">Grupo</label>
            <input type="text" placeholder='Grupo' name='group' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
            <label className="text-sm">Profesor</label>
            <select id="countries" name='period_id' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option disabled>Profesores</option>
            </select> 
            <button type='submit' className='bg-btn-create opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100'>Guardar</button>
            <button type='submit' className='bg-btn-create opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100'>Volver</button>
        </div>
    )
}
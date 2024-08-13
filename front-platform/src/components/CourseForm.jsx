import { useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { useCourses } from "../hooks/useCourses"
import { toast } from "sonner"

export function CourseForm() {

    const { createCourse, updateCourse } = useCourses()
    const {id} = useParams()
    const paramsId = id
    const location = useLocation()
    const navigate = useNavigate()
  
    useEffect(() => {
      const loadCourseData = () => {
        if (location.state && location.state.courseData) {
          const { name, code, description, credit } = location.state.courseData
          document.querySelector('input[name="name"]').value = name
          document.querySelector('input[name="code"]').value = code
          document.querySelector('textarea[name="description"]').value = description
          document.querySelector('input[name="credit"]').value = credit
        }
      }
  
      loadCourseData()
    }, [location.state])
  
    const handleSubmit = (event) => {
  
      event.preventDefault()
      const fields = Object.fromEntries(new window.FormData(event.target))

      const { name, code, description, credit } = fields
      if (!name || !code || !description || !credit) {
        toast.error('Por favor, completa todos los campos requeridos')
        return
      }

      if(paramsId) {
        updateCourse(paramsId, fields)
          .then(() => {
            toast.success('Curso actualizado exitosamente')
            navigate('/course-list')
          })
          .catch((error) => {
            toast.error('Error al actualizar curso:', error)
          })
      } else{
        createCourse(fields)
          .then(() => {
            toast.success('Curso creado exitosamente')
            navigate('/course-list')
          })
          .catch((error) => {
            toast.error('Error al crear curso:', error)
          })
      }
    }
  
    return (
        <form className='form flex flex-col gap-4' onSubmit={handleSubmit}>
          <span>{paramsId ? 'Actualizar curso':'Crear curso'}</span>
          
          <input type="text" placeholder='Nombre del curso' name='name' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
          <input type="text" placeholder='Código del curso' name='code' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
          <textarea placeholder='Descripción' name='description' rows="3" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
          <input type="number" placeholder='Créditos' name='credit' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
          
          <button type='submit' className='bg-btn-create opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100'>{paramsId ? 'Actualizar':'Guardar'}</button>
        </form>
    )
  }
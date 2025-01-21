import { useEffect, useState } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { useCourses } from "../hooks/useCourses"
import { toast } from "sonner"
import { GoBackButton } from "../../components/GoBackButton"
import { SaveIcon, UpdateIcon } from "../../components/Icons"
//import useBreadCrumb from "../../hooks/useBreadCrumb"

export function CourseForm() {

    const { createCourse, updateCourse } = useCourses()
    const {id} = useParams()
    const paramsId = id
    const location = useLocation()
    const navigate = useNavigate()

    const [courseData, setCourseData] = useState({
        name: '',
        code: '',
        description: '',
        credit: ''
    })

    
    //useBreadCrumb(`${courseData.name ? 'Actualizar':'Crear'}` + ' curso', '/course')

    useEffect(() => {
      if (location.state && location.state.courseData) {
          setCourseData(location.state.courseData)
      }
    }, [location.state])

    const handleChange = (event) => {
      const { name, value } = event.target
      setCourseData(prevData => ({
          ...prevData,
          [name]: value
      }))
    }
  
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
      <div className="flex justify-center">
          <form className='form flex flex-col gap-4 max-w-md w-full p-0' onSubmit={handleSubmit}>
              <span>{paramsId ? 'Actualizar curso' : 'Crear curso'}</span>

              <input 
                  type="text" 
                  placeholder='Nombre del curso' 
                  name='name' 
                  value={paramsId}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <input 
                  type="text" 
                  placeholder='Código del curso' 
                  name='code' 
                  value={courseData.code}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <textarea 
                  placeholder='Descripción' 
                  name='description' 
                  rows="3" 
                  value={courseData.description}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <input 
                  type="number" 
                  placeholder='Créditos' 
                  name='credit' 
                  value={courseData.credit}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />          

              <div className="flex justify-end gap-2">
                  <button type='submit' 
                      className='bg-btn-create opacity-80 w-fit px-4 py-1 rounded-lg hover:opacity-100 flex items-center text-slate-100'>
                      {paramsId ? <UpdateIcon /> : <SaveIcon />}
                      <span className="ml-1">{paramsId ? 'Actualizar' : 'Guardar'}</span>
                  </button>
                  <GoBackButton label='Volver' route='/course-list/'/>
              </div>
          </form>
      </div>
  )
  }
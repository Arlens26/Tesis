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
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-primary">{paramsId ? 'Actualizar Curso' : 'Crear Curso'}</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Información del Curso</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del curso
                        </label>
                        <input 
                            type="text" 
                            id="name"
                            placeholder='Nombre del curso' 
                            name='name' 
                            value={courseData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                            Código del curso
                        </label>
                        <input 
                            type="text" 
                            id="code"
                            placeholder='Código del curso' 
                            name='code' 
                            value={courseData.code}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea 
                            id="description"
                            placeholder='Descripción' 
                            name='description' 
                            rows="3" 
                            value={courseData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div>
                        <label htmlFor="credit" className="block text-sm font-medium text-gray-700 mb-1">
                            Créditos
                        </label>
                        <input 
                            type="number" 
                            id="credit"
                            placeholder='Créditos' 
                            name='credit' 
                            value={courseData.credit}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button type='submit' 
                            className='bg-btn-create opacity-80 w-fit px-4 py-1 rounded-lg hover:opacity-100 flex items-center text-white gap-2'>
                            {paramsId ? <UpdateIcon /> : <SaveIcon />}
                            {paramsId ? 'Actualizar' : 'Guardar'}
                        </button>
                        <GoBackButton label='Volver' route='/course-list/'/>
                    </div>
                </form>
            </div>
        </div>
    )
  }
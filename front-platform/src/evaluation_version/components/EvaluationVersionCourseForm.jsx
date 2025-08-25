import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { CreateIcon, DeleteIcon, SaveIcon } from "../../components/Icons"
import { useEvaluationVersionCourse } from "../hooks/useEvaluationVersionCourse"
import { GoBackButton } from "../../components/GoBackButton"
import { useLearningOutComes } from "../hooks/useLearningOutComes"

export function EvaluationVersionCourseForm() {
    const location = useLocation()
    const { createEvaluationVersionCourse } = useEvaluationVersionCourse()
    const navigate = useNavigate()

    const {
      raList,
      percentage,
      totalPercentage,
      //numbers,
      setPercentage,
      buildLearningOutcomesList,
      handleAddRa,
      handleEditDescription,
      handleEditPercentage,
      handleDeleteRa
    } = useLearningOutComes()
  
    const [courseData, setCourseData] = useState({
        name: '',
        code: '',
        description: '',
        credit: ''
    })

    useEffect(() => {
       if (location.state && location.state.course) {
           const { name, code, description, credit } = location.state.course
           setCourseData({ name, code, description, credit })
       }
    }, [location.state])

    
    const handleInputChange = (e) => {
      const { name, value } = e.target
      setCourseData(prevState => ({
          ...prevState,
          [name]: value
      }))
    }
  
  
    const handleSubmit = (event) => {
      event.preventDefault()
  
      // Construir el JSON deseado
      const evaluationVersionData = {
        course: {
          id: location.state.course.id,
        },
        learning_outcome: buildLearningOutcomesList()
      }
      console.log(evaluationVersionData)
      // Función para validar los campos
      const validateRaList = (list) => {
        for (const item of list) {
            if (!item.description || !item.percentage) {
                toast.error('Por favor, completa todos los campos requeridos')
                //console.log('falta campos')
                return
            }
        }
        //console.log('Learning outcome prueba: ', evaluationVersionData.learning_outcome)
        if(evaluationVersionData.learning_outcome.length !== 0){
          // Si todos los campos son válidos, puedes continuar con tu lógica
          console.log('Todos los campos están completos')
          createEvaluationVersionCourse(evaluationVersionData)
          navigate('/course-list')
        }else{
          toast.info('Falta agregar los RAs')
        }
      }
      validateRaList(raList)
    }
  
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-primary">Crear Versión de Evaluación del Curso</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Información del Curso</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre del curso
                            </label>
                            <input 
                                type="text" 
                                id="name"
                                name='name' 
                                value={courseData.name} 
                                onChange={handleInputChange}
                                disabled 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                                Código del curso
                            </label>
                            <input 
                                type="text" 
                                id="code"
                                name='code'
                                value={courseData.code} 
                                onChange={handleInputChange}  
                                disabled 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción del curso
                        </label>
                        <textarea 
                            id="description"
                            name='description'
                            value={courseData.description} 
                            onChange={handleInputChange} 
                            disabled 
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label htmlFor="credit" className="block text-sm font-medium text-gray-700 mb-1">
                            Créditos
                        </label>
                        <input 
                            type="text" 
                            id="credit"
                            name='credit' 
                            value={courseData.credit} 
                            onChange={handleInputChange}
                            disabled 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Resultados de Aprendizaje (RA)</h3>
                        
                        <div className="grid gap-2"> 
                            <label className="block text-sm font-medium text-gray-700">Porcentaje de RA:</label>
                            <input
                                type="number"
                                placeholder="Porcentaje"
                                min={0}
                                max={100}
                                value={percentage}
                                onChange={(e) => setPercentage(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            />
                            <button type='button' onClick={handleAddRa} 
                                disabled={totalPercentage === 100}
                                className={`bg-btn-create ${totalPercentage === 100 ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:opacity-100'} w-fit px-4 py-1 rounded-lg flex items-center text-white gap-2`}>
                                <CreateIcon/>
                                Agregar RA
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Código
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Descripción
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Porcentaje
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                              {raList.sort((a, b) => a.id - b.id).map((ra, index) => (
                                  <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td name='code_ra' scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {ra.code}
                                    </td>
                                    <td className="px-6 py-4">
                                      <input 
                                        name='description_learning'  
                                        type="text" 
                                        placeholder={`Descripción ${ra.code}`} 
                                        onChange={(e) => handleEditDescription(index, e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    </td>
                                    <td className="px-6 py-4">
                                    <input
                                      name='percentage'
                                      type="number"
                                      min={1}
                                      max={100}
                                      value={parseInt(ra.percentage)}
                                      onChange={(e) => handleEditPercentage(index, parseInt(e.target.value))}
                                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                    </td>
                                    <td className="text-center">
                                      <button type='button' 
                                      onClick={ () => handleDeleteRa(index)}
                                      className='bg-primary opacity-80 rounded-sm py-1 px-1 hover:opacity-100'>
                                        <DeleteIcon />
                                      </button>
                                    </td>
                                  </tr>
                              ))}
                              <tr key={`totalPercentageRa`} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Total Porcentaje
                                    </th>
                                    <td className="px-6 py-4">
                                        {`${totalPercentage}%`}
                                    </td>
                                    <td className="px-6 py-4">
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button type='submit' 
                            className='bg-btn-create opacity-80 w-fit px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-white gap-2'>
                            <SaveIcon/>
                            Guardar
                        </button>
                        <GoBackButton label='Volver' route='/course-list/'/>
                    </div>
                </div>
            </form>
        </div>
    </div>
    )
}
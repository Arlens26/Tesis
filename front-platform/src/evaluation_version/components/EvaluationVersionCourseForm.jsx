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
      <form className='form flex flex-col gap-4 p-6' onSubmit={handleSubmit}>
          <h1 className="text-xl">Creación evaluación versión curso</h1>
          <label className="text-sm">Nombre del curso</label>
          <input 
            type="text" 
            placeholder='' 
            name='name' 
            value={courseData.name} 
            onChange={handleInputChange}
            disabled 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
          <label className="text-sm">Código del curso</label>
          <input 
            type="text" 
            placeholder='' 
            name='code'
            value={courseData.code} 
            onChange={handleInputChange}  
            disabled 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
          <label className="text-sm">Descripción del curso</label>
          <textarea 
            type="text" 
            placeholder='' 
            name='description'
            value={courseData.description} 
            onChange={handleInputChange} 
            disabled 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
          <label className="text-sm">Créditos</label>
          <input 
            type="text" 
            placeholder='' 
            name='credit' 
            value={courseData.credit} 
            onChange={handleInputChange}
            disabled 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
          <div className="flex flex-col gap-4">
                <div className="grid gap-2"> 
                  <span className="text-sm">Porcentaje de RA:</span>
                  <input
                    type="number"
                    placeholder="Porcentaje"
                    min={0}
                    max={100}
                    value={percentage}
                    onChange={(e) => setPercentage(parseInt(e.target.value))}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  <button type='button' onClick={handleAddRa} 
                    disabled={totalPercentage === 100}
                    className={`bg-btn-create ${totalPercentage === 100 ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:opacity-100'} w-fit px-4 py-1 rounded-lg flex items-center text-slate-100`}>
                      <CreateIcon/>
                      <span className="ml-1">Agregar RA</span>
                  </button>
                  
                </div>
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
  
                                    </td>
                                    <td className="px-6 py-4">
                                        {`${totalPercentage}%`}
                                    </td>
                                    <td className="px-6 py-4">
  
                                    </td>
                                  </tr>
                            </tbody>
            </table>
            <div className="flex justify-end gap-2">
              <button type='submit' 
                className='bg-btn-create opacity-80 w-fit px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'>
                  <SaveIcon/>
                  <span className="ml-1">Guardar</span>
              </button>
              <GoBackButton label='Volver' route='/course-list/'/>
            </div>
          </div>
      </form>
    )
  }
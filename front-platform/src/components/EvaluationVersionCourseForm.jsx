import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { CreateIcon, DeleteIcon, SaveIcon } from "./Icons"
import { useEvaluationVersionCourse } from "../hooks/useEvaluationVersionCourse"
import { GoBackButton } from "./GoBackButton"

export function EvaluationVersionCourseForm() {
    const location = useLocation()
    const { createEvaluationVersionCourse } = useEvaluationVersionCourse()
    const navigate = useNavigate()
  
    // Extraer el curso del estado de ubicación
    useEffect(() => {
       const loadCourseData = () => {
         if (location.state && location.state.course) {
           const { name, code, description, credit } = location.state.course
           document.querySelector('input[name="name"]').value = name
           document.querySelector('input[name="code"]').value = code
           document.querySelector('textarea[name="description"]').value = description
           document.querySelector('input[name="credit"]').value = credit
         }
       }
   
       loadCourseData()
     }, [location.state])
  
    const [raList, setRaList] = useState([])
    console.log(raList)
    const [percentage, setPercentage] = useState(0)
    const [totalPercentage, setTotalPercentage] = useState(0)
    const [numbers, setNumbers] = useState([])
  
    const buildLearningOutcomesList = () => {
      return raList.map(ra => ({
        code: ra.code, 
        description: ra.description,
        percentage: ra.percentage
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
  
    const handleAddRa = () => {
      if(percentage > 0 && totalPercentage + percentage <= 100){
        // Encontrar el número menor no presente en la lista
        let nextNumber = 1
  
        while (numbers.includes(nextNumber)) {
          nextNumber++
        }
        // Agregar el siguiente número a la lista
        const nuevosNumeros = [...numbers, nextNumber].sort((a, b) => a - b);
        setNumbers(nuevosNumeros);
  
        const raCode = `R.A.${nextNumber}`;
        setRaList([...raList, { id:nextNumber, code:raCode, description:'', percentage:`${percentage}%`}])    
        raList.sort((a, b) => a - b);
        setTotalPercentage(totalPercentage + percentage)
        setPercentage(0)
        console.log(raList)
      }else if(percentage === 0){
        toast.info('El porcentaje no debe ser igual a 0')
      }else {
        toast.info('El porcentaje total no debe ser mayor a 100')
      }    
    }
  
    const handleEditDescription = (index, newDescription) => {
      const updateRaList = [...raList]
      console.log(index)
      console.log(newDescription)
      if(newDescription !== undefined && newDescription.trim() !== ''){
        updateRaList[index].description = newDescription
        setRaList(updateRaList)
        console.log(updateRaList)
      }
    }
  
    const handleEditPercentage = (index, newPercentage) => {
      const updateRaList = [...raList]
      const diff = newPercentage - parseInt(updateRaList[index].percentage)
      if(!isNaN(newPercentage) && totalPercentage + diff <= 100 && newPercentage >= 1 && newPercentage <= 100){
        updateRaList[index].percentage = `${newPercentage}%`
        setRaList(updateRaList)
        setTotalPercentage(totalPercentage + diff)
      }
    }
  
    const handleDeleteRa = (index) => {
      const deletePercentage = parseInt(raList[index].percentage)
      const deleteNumber = raList[index].id
      const updateRaList = raList.filter((_, i) => i !== index)
      setRaList(updateRaList)
      setTotalPercentage(totalPercentage - deletePercentage)
      // Eliminar el número asociado al elemento eliminado
      const newNumbers = numbers.filter(number => number !== deleteNumber)
      setNumbers(newNumbers)
    }
  
    return (
      <form className='form flex flex-col gap-4' onSubmit={handleSubmit}>
          <h1 className="text-xl">Creación evaluación versión curso</h1>
          <label className="text-sm">Nombre del curso</label>
          <input type="text" placeholder='' name='name' disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
          <label className="text-sm">Código del curso</label>
          <input type="text" placeholder='' name='code' disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
          <label className="text-sm">Descripción del curso</label>
          <textarea type="text" placeholder='' name='description' disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
          <label className="text-sm">Créditos</label>
          <input type="text" placeholder='' name='credit' disabled className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
          <div className="flex flex-col gap-2">
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
                                    <td className="flex items-center gap-1">
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
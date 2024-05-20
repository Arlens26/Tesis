import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useScheduledCourse } from "../hooks/useSheduledCourse"
import { useEvaluationVersionCourse } from "../hooks/useEvaluationVersionCourse"

export function Activity() {

    const { getEvaluationVersionDetail, learningOutComes, percentages } = useScheduledCourse()
    const location = useLocation()
    
    const { evaluationVersion } = useEvaluationVersionCourse()
    
    console.log(learningOutComes)
    console.log(percentages)
    
    useEffect(() =>{
        const course_id = location.state.course_id
        console.log(course_id)
        console.log(evaluationVersion)
        if (course_id) {
            getEvaluationVersionDetail(course_id)
        } else {
            console.error("No se proporcionó un course_id en el estado de la ubicación.")
        }
    }, [location.state?.course_id, evaluationVersion])

    const handleSubmit = () => {
        console.log('Actividad agregada')
    }

    return(
        <form className='form flex flex-col gap-4' onSubmit={handleSubmit}>
          <span>Crear Actividad</span>
          
          <input type="text" placeholder='Nombre de la actividad' name='name' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
          <textarea placeholder='Descripción' name='description' rows="3" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>          
          <button type='submit' className='bg-btn-create opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100'>Agregar</button>

          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Actividad
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Descripción
                                    </th>
                                    {
                                      Object.keys(learningOutComes).map(id => (
                                        <th key={id} scope="col" className="px-6 py-3">
                                          {learningOutComes[id]?.code || 'Cargando...'}
                                        </th>
                                      ))
                                    }
                                    <th scope="col" className="px-6 py-3">
                                        Porcentaje
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                              {/*raList.sort((a, b) => a.id - b.id).map((ra, index) => (
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
                              ))*/}
                              <tr key={`totalPercentageRa`} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Porcentaje
                                    </th>
                                    <td className="px-6 py-4">
                                      
                                    </td>
                                    {
                                      Object.keys(percentages).map(id => (
                                      <td key={id} className="px-6 py-4">
                                        {percentages[id]?.percentage}
                                      </td>
                                    ))
                                  }
                                    <td className="px-6 py-4">
                                        100%
                                    </td>
                                    <td className="px-6 py-4">
                                        
                                    </td>
                                  </tr>
                            </tbody>
            </table>  

        </form>
    )
  }
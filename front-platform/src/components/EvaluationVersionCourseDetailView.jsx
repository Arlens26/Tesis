import { useEffect, useState } from "react"
import { useCourses } from "../hooks/useCourses"
import { useLocation } from "react-router-dom"
import { GoBackButton } from "./GoBackButton"
import { useEvaluationVersionDetail } from "../hooks/useEvaluationVersionDetail"

export function EvaluationVersionCourseDetailView() {

    const [course, setCourse] = useState() 
    console.log('Course estado: ', course)
    const [initialDate, setInitialDate] = useState('')
    const { getCourse } = useCourses()
    const location = useLocation()
    const { getEvaluationVersionDetailByVersionId, EvaluationVersionDetails } = useEvaluationVersionDetail()
    const [totalPercentage, setTotalPercentage] = useState(0)
    

    useEffect(() => {
        // Calcular el total del percentage cada vez que EvaluationVersionDetails cambie
        const total = EvaluationVersionDetails.reduce((acc, detail) => {
            return acc + (detail.percentage.percentage || 0) 
        }, 0)
        setTotalPercentage(total)
    }, [EvaluationVersionDetails])

    useEffect(() => {
        const course_id = location.state.course_id
        console.log('id course: ', course_id)
        const version_id = location.state.version_id
        console.log('Version id: ', version_id)
        const initial_date = location.state.initial_date
        console.log('Initial date: ', initial_date)
        if (initial_date) {
            setInitialDate(initial_date)
        }
        if(course_id){
            getCourse(course_id).then(course => {
                setCourse(course)
                console.log('Course: ', course)
            })
        }
        if(version_id){
            getEvaluationVersionDetailByVersionId(version_id)
        }
    }, [location.state])

    return(
        <>
            {course ? ( 
                <form className="flex flex-col gap-2">
                    <h1 className="text-xl">Version de evaluación del curso asociados con los RAs </h1>
                    <div>
                        <label htmlFor="courseName">Fecha inicial de la versión de evaluación:</label>
                        <input
                            type="text"
                            id="initialDate"
                            value={initialDate}
                            disabled={true}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="courseName">Nombre:</label>
                        <input
                            type="text"
                            id="courseName"
                            value={course.name}
                            disabled={true}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="courseCode">Código:</label>
                        <input
                            type="text"
                            id="courseCode"
                            value={course.code}
                            disabled={true}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        />
                    </div>
                    <div>
                        <label htmlFor="courseDescription">Descripción:</label>
                        <input
                            type="text"
                            id="courseDescription"
                            value={course.description}
                            disabled={true}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        />
                    </div>
                    <div>
                        <label htmlFor="courseCredit">Créditos:</label>
                        <input
                            type="number"
                            id="courseCredit"
                            value={course.credit}
                            disabled={true}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        />
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
                                </tr>
                            </thead>
                            <tbody>
                              {EvaluationVersionDetails ? ( EvaluationVersionDetails.map((detail, index) => (
                                  <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td name='code_ra' scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {detail.learning_outcome.code}
                                    </td>
                                    <td className="px-6 py-4">
                                      <input 
                                        name='description_learning'  
                                        type="text" 
                                        //placeholder={`Descripción ${detail.learning_outcome.description}`} 
                                        value={detail.learning_outcome.description}
                                        disabled
                                        //onChange={(e) => handleEditDescription(index, e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    </td>
                                    <td className="px-6 py-4">
                                    <input
                                      name='percentage'
                                      type="number"
                                      min={1}
                                      max={100}
                                      value={parseInt(detail.percentage.percentage)}
                                      disabled
                                      //onChange={(e) => handleEditPercentage(index, parseInt(e.target.value))}
                                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                    </td>
                                  </tr>
                              ))
                            ) : (
                                <p>Cargando RAs...</p> 
                            )}
                              <tr key={`totalPercentageRa`} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Total Porcentaje
                                    </th>
                                    <td className="px-6 py-4">
  
                                    </td>
                                    <td className="px-6 py-4">
                                        {`${totalPercentage}%`}
                                    </td>
                                  </tr>
                            </tbody>
                        </table>
                    <div className="flex justify-end gap-2">
                        <GoBackButton label='Volver' route='/course-list/'/>
                    </div>
                </form>
            ) : (
                <p>Cargando curso...</p> 
            )}
        </>
    )
}
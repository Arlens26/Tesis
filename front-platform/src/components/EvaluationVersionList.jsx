import { useEvaluationVersionCourse } from "../hooks/useEvaluationVersionCourse"
import PropTypes from 'prop-types'
import { EyeIcon } from "./Icons"

export function EvaluationVersionList({ courseId }){
    console.log(courseId)
    const { evaluationVersion } = useEvaluationVersionCourse()
    console.log('Evaluation version list: ', evaluationVersion)

    return(
        <div className="grid gap-3"> 
        <h1>Lista de versiones de evaluación:</h1>
        {/*<h1>Evaluation Version Data</h1>
        <div>*/}
            {/*evaluationVersion.filter(version => version.course == courseId).map(version => (
            <div key={version.id}>
                <p>Course id prop: {courseId}</p>
                <p>Version ID: {version.id}</p>
                <p>Date: {version.initial_date}</p>
                <p>Course ID: {version.course}</p>
            </div>
            ))*/}
        {/*</div>*/}
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Fecha de creación</th>
                        <th scope="col" className="px-6 py-3">Fecha de finalización</th>
                        <th scope="col" className="px-6 py-3">Estado</th>
                        <th scope="col" className="px-6 py-3">Acciones</th>
                    </tr>
                </thead>
                    <tbody>
                            {evaluationVersion.filter(version => version.course == courseId).map(version => (
                                <tr key={version.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{version.initial_date}</td>
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{version.end_date}</td>
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{ version.end_date == null ? 'Activo' : 'Inactivo' }</td>
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <div className="flex space-x-2">
                                            <button>
                                                <EyeIcon/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
            </table>
        </div>
    )
}

EvaluationVersionList.propTypes = {
    courseId: PropTypes.number.isRequired,
}
  
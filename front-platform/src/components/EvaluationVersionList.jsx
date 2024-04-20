import { useEvaluationVersionCourse } from "../hooks/useEvaluationVersionCourse"

export function EvaluationVersionList(){
    const { evaluationVersion } = useEvaluationVersionCourse()
    console.log(evaluationVersion)

    return(
        <>
        <h1>Evaluation Version Data</h1>
        <div>
            {evaluationVersion.map(version => (
            <div key={version.id}>
                <p>Version ID: {version.id}</p>
                <p>Date: {version.initial_date}</p>
                <p>Course ID: {version.course}</p>
            </div>
            ))}
        </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Creación evaluación versión curso</th>
                        <th scope="col" className="px-6 py-3">Fecha de finalización</th>
                        <th scope="col" className="px-6 py-3">Estado</th>
                        <th scope="col" className="px-6 py-3">Acciones</th>
                    </tr>
                </thead>
                    <tbody>
                            {evaluationVersion.map(version => (
                                <tr key={version.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{version.initial_date}</td>
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{version.end_date}</td>
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{ version.end_date == null ? 'Activo' : 'Inactivo' }</td>
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <div className="flex space-x-2">
                                            <button>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                                                    <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
            </table>
        </>
    )
}
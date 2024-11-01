import { useLocation, useNavigate } from "react-router-dom"

export function EnrolledStudentList() {
    const { state } = useLocation()
    const { courseName, groupId, students } = state || {}
    const navigate = useNavigate()

    const handleReturn = () => {
        navigate('/student-enrolled-course-list')
    }

    return (
        <div className="grid gap-2"> 
            <h1 className="text-xl">Lista de estudiantes</h1>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            {courseName}
                        </th>
                        <th scope="col" className="px-6 py-3" colSpan={2}> 
                            Grupo: {groupId}
                        </th>
                    </tr>
                    <tr>
                        <th scope="col" className="px-6 py-3">ID del Estudiante</th>
                        <th scope="col" className="px-6 py-3">Nombre del Estudiante</th>
                        <th scope="col" className="px-6 py-3">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {students?.map((student, index) => (
                        <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            <td className="px-6 py-4">{student.id}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {student.first_name} {student.last_name}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {student.active ? 'Inactivo' : 'Activo'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button type='button' className='bg-btn-create opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100' onClick={handleReturn}>Volver</button>
        </div>
    )
}

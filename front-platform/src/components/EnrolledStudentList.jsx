import { useLocation, useNavigate } from "react-router-dom"

export function EnrolledStudentList() {
    const { state } = useLocation()
    const { courseName, groupId, students } = state || {}
    console.log('Students: ', students) 
    const navigate = useNavigate()

    const handleReturn = () => {
        navigate('/student-enrolled-course-list')
    }

    const updateStudentStatus = (studentId, scheduledCourseId, currentStatus) => {
        const newStatus = !currentStatus

        const statusData = {
            scheduled_course_id: scheduledCourseId,
            student_id: studentId,
            active: newStatus,
        }
        console.log('Status data: ', statusData)
        //updateStatusStudentEnrolledCourse(statusData)
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
                    {students?.map((item, index) => (
                        <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            <td className="px-6 py-4">{item.student.id}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {item.student.first_name} {item.student.last_name}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            <button 
                                type="button" 
                                className={`focus:outline-none text-white font-medium rounded-full text-sm px-5 py-1 me-2 mb-2 ${item.student.active ? 'bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900' : 'bg-btn-create opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100'}`}
                                onClick={() => updateStudentStatus(item.student.id, item.scheduled_course.id, item.status)}
                            >
                                {item.student.active ? 'Inactivo' : 'Activo'}
                            </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button type='button' className='bg-btn-create opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100' onClick={handleReturn}>Volver</button>
        </div>
    )
}

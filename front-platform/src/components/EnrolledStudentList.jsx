import { useLocation } from "react-router-dom"
import { useEnrolledStudent } from "../hooks/useEnrolledStudent"
import { toast } from "sonner"
import { GoBackButton } from "./GoBackButton"
import { useEffect, useState } from "react"

export function EnrolledStudentList() {
    
    const { updateStudentEnrolledStatus } = useEnrolledStudent()
    const { state } = useLocation()
    const { courseName, groupId, students } = state || {}
    console.log('Students: ', students) 

    const [localStudents, setLocalStudents] = useState([])

    useEffect(() => {
        if (students) {
            setLocalStudents(students);
        }
    }, [students])

    const updateStudentStatus = (name, last_name, studentId, scheduledCourseId, currentStatus) => {
        const newStatus = !currentStatus

        const statusData = {
            scheduled_course_id: scheduledCourseId,
            student_id: studentId,
            active: newStatus,
        }
        console.log('Status data: ', statusData)
        updateStudentEnrolledStatus(statusData)
          .then(() => {
            toast.success(`Estado actualizado exitosamente para el estudiante ${name} ${last_name}`)
            setLocalStudents(prevStudents =>
                prevStudents.map(student =>
                    student.student.id === studentId
                        ? { ...student, status: newStatus }
                        : student
                )
            )
          })
          .catch((error) => {
            toast.error(`Error al actualizar estado del estudiante: ${name} ${last_name}`, error)
          })
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
                    {localStudents?.map((item, index) => (
                        <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            <td className="px-6 py-4">{item.student.id}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {item.student.first_name} {item.student.last_name}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            <button 
                                type="button" 
                                className={`focus:outline-none text-white font-medium rounded-full text-sm px-5 py-1 me-2 mb-2 ${item.status ? 'bg-btn-create opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100' : 'bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'}`}
                                onClick={() => updateStudentStatus(item.student.first_name, item.student.last_name, item.student.id, item.scheduled_course.id, item.status)}
                            >
                                {item.status ? 'Activo' : 'Inactivo' }
                            </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-end gap-2">
                <GoBackButton label='Volver' route='/student-enrolled-course-list/'/>
            </div>
        </div>
    )
}

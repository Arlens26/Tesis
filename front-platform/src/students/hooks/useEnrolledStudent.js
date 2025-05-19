import { useContext, useState } from "react"
import { 
    getStudentEnrolledCourseFetch, 
    updateStudentEnrolledStatusFetch, 
    getGradeDetailFetch, 
    updateGradeDetailFetch, 
    createStudentEnrolledCourseFetch, 
    getStudentGradeReportFetch 
} from "../services/enrolledStudentService"
import { AuthContext } from "../../auth/context/user"

export function useEnrolledStudent() {

    const { user } = useContext(AuthContext)

    const [gradeDetail, setGradeDetail] = useState([])
    const [studentEnrolledCourse, setStudentEnrolledCourse] = useState([])
    const [studentGradeReport, setStudentGradeReport] = useState([])

    const getStudentEnrolledCourse = () => {
        getStudentEnrolledCourseFetch()
            .then(json => setStudentEnrolledCourse(json))
            .catch(error => console.error('Error fetching student enrolled course', error))
    }

    const updateStudentEnrolledStatus = (data) => {
        return updateStudentEnrolledStatusFetch(data)
            .then(() => console.log('Estado del estudiante actualizado exitosamente'))
            .catch(error => console.error(error))
    }

    const getGradeDetail = () => {
        getGradeDetailFetch(user.token)
            .then(json => setGradeDetail(json))
            .catch(error => console.error('Error fetching grade detail:', error))
    }

    const updateGradeDetail = (gradeId, data) => {
        return updateGradeDetailFetch(gradeId, data)
            .then(() => console.log('Calificación actualizada exitosamente'))
            .catch(error => console.error(error))
    }

    const createStudentEnrolledCourse = (fields) => {
        return createStudentEnrolledCourseFetch(fields)
            .then(data => console.log('Datos enviados exitosamente', data))
            .catch(error => console.error('Error:', error))
    }

    const getStudentGradeReport = () => {
        getStudentGradeReportFetch()
            .then(json => setStudentGradeReport(json))
            .catch(error => console.error('Error fetching student grade report', error))
    }

    return { 
        getGradeDetail, 
        gradeDetail, 
        updateGradeDetail, 
        getStudentEnrolledCourse, 
        studentEnrolledCourse,
        createStudentEnrolledCourse, 
        getStudentGradeReport, 
        studentGradeReport, 
        updateStudentEnrolledStatus 
    }
}
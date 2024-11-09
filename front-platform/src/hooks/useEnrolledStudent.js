import { useState } from "react";

export function useEnrolledStudent() {
    
    //const STUDENTS_ENDPOINT = `http://127.0.0.1:8000/authentication/students/`
    const GRADE_DETAIL_LEARNING_OTUCOME = `http://localhost:8000/activities/all/grade-detail-learning-outcome/`
    const STUDENT_ENROLLED_COURSE = `http://127.0.0.1:8000/courses/all/student-enrolled-course/`
    const UPDATE_STATUS_STUDENT_ENROLLED_COURSE = `http://127.0.0.1:8000/courses/all/student-enrolled-course/update-status/`
    const CREATE_STUDENT_ENROLLED_COURSE = `http://127.0.0.1:8000/courses/all/create-student-enrolled-course/`
    const STUDENT_GRADE_REPORT = `http://127.0.0.1:8000/courses/all/student-report/`

    //const [students, setStudent] = useState([])
    //console.log(students)
    const [gradeDetail, setGradeDetail] = useState([])
    console.log(gradeDetail)
    const [studentEnrolledCourse, setStudentEnrolledCourse] = useState([])
    console.log(studentEnrolledCourse)
    const [studentGradeReport, setStudentGradeReport] = useState([])
    console.log('Student grade report use: ', studentGradeReport)

    const getStudentEnrolledCourse = () => {
        fetch(STUDENT_ENROLLED_COURSE)
        .then(res => res.json())
        .then(json => {
            return setStudentEnrolledCourse(json)
        })
        .catch(error => {
            console.error('Error feching student enrolled course', error)
        })
    }

    const updateStudentEnrolledStatus = (data) => {

      return fetch(`${UPDATE_STATUS_STUDENT_ENROLLED_COURSE}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          }, 
          body: JSON.stringify(data)
      })
      .then(response => {
          if(response.ok){
              console.log('Estado del estudiante actualizado exitosamente')
          }
          if(!response.ok){
              throw new Error('Error al actualizar el estado del estudiante')
          }
      })
    } 

    const getGradeDetail = () => {
        fetch(GRADE_DETAIL_LEARNING_OTUCOME)
        .then(res => res.json())
        .then(json => {
            return setGradeDetail(json)
        })
        .catch(error => {
          console.error('Error fetching students:', error)
      })
    }

    const updateGradeDetail = (gradeId, data) => {

        return fetch(`${GRADE_DETAIL_LEARNING_OTUCOME}${gradeId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(data)
        })
        .then(response => {
            if(response.ok){
                console.log('Calificación actualizada exitosamente')
            }
            if(!response.ok){
                throw new Error('Error al actualizar la calificación')
            }
        })
    }

    const createStudentEnrolledCourse = (fields) => {

        return fetch(CREATE_STUDENT_ENROLLED_COURSE, {
          method: 'POST', 
          headers: {
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify(fields)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al enviar los datos');
          }
          return response.json() 
        })
        .then(data => {
          console.log('Datos enviados exitosamente', data);
        })
        .catch(error => {
          console.error('Error:', error);
        })
      }

      const getStudentGradeReport = () => {
        fetch(STUDENT_GRADE_REPORT)
        .then(res => res.json())
        .then(json => {
            return setStudentGradeReport(json)
        })
        .catch(error => {
            console.error('Error feching student grade report', error)
        })
    }

    return { getGradeDetail, gradeDetail, updateGradeDetail, getStudentEnrolledCourse, studentEnrolledCourse, 
      createStudentEnrolledCourse, getStudentGradeReport, studentGradeReport, updateStudentEnrolledStatus }
}
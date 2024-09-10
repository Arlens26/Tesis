import { useState } from "react";

export function useEnrolledStudent() {
    
    const STUDENTS_ENDPOINT = `http://127.0.0.1:8000/authentication/students/`
    const GRADE_DETAIL_LEARNING_OTUCOME = `http://localhost:8000/activities/all/grade-detail-learning-outcome/`

    const [students, setStudent] = useState([])
    console.log(students)
    const [gradeDetail, setGradeDetail] = useState([])
    console.log(gradeDetail)

    const getStudents = () => {
        fetch(STUDENTS_ENDPOINT)
        .then(res => res.json())
        .then(json => {
            return setStudent(json)
        })
        .catch(error => {
          console.error('Error fetching students:', error);
      });
    }

    const getGradeDetail = () => {
        fetch(GRADE_DETAIL_LEARNING_OTUCOME)
        .then(res => res.json())
        .then(json => {
            return setGradeDetail(json)
        })
        .catch(error => {
          console.error('Error fetching students:', error);
      });
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

    return { getStudents, students, getGradeDetail, gradeDetail, updateGradeDetail }
}
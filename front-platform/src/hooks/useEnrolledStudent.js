import { useState } from "react";

export function useEnrolledStudent() {
    
    const STUDENTS_ENDPOINT = `http://127.0.0.1:8000/authentication/students/`

    const [students, setStudent] = useState([])
    console.log(students)

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

    return { getStudents, students }
}
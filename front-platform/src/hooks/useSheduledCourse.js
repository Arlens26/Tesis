import { useState } from "react"

export function useScheduledCourse(){
    
    //const ACADEMIC_PERIODS_ENDPOINT = `http://localhost:8000/courses/all/academic-periods/`
    const PROFESSORS_ENDPOINT = `http://127.0.0.1:8000/authentication/professors/`
    const CREATE_SCHEDULED_COURSE_ENPOINT = `http://localhost:8000/courses/all/create-scheduled-course/`
    const [professors, setProfessor] = useState([])

    const getProfessors = () => {
        fetch(PROFESSORS_ENDPOINT)
        .then(res => res.json())
        .then(json => {
            return setProfessor(json)
        })
    }

    const createScheduledCourse = (fields) => {

        return fetch(CREATE_SCHEDULED_COURSE_ENPOINT, {
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
          return response.json(); // Resuelve la promesa y parsea el cuerpo de la respuesta como JSON
        })
        .then(data => {
          console.log('Datos enviados exitosamente', data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }

    return { getProfessors, professors, createScheduledCourse }
}
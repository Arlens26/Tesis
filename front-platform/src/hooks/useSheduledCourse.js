import { useState, useContext } from "react"
import { AuthContext } from '../context/user';
import { VersionContext } from "../context/evaluationVersion";

export function useScheduledCourse(){
    
    //const ACADEMIC_PERIODS_ENDPOINT = `http://localhost:8000/courses/all/academic-periods/`
    const PROFESSORS_ENDPOINT = `http://127.0.0.1:8000/authentication/professors/`
    const CREATE_SCHEDULED_COURSE_ENPOINT = `http://localhost:8000/courses/all/create-scheduled-course/`
    const EVALUATION_VERSION_DETAIL_ENPOINT = `http://localhost:8000/courses/all/scheduled-course-detail/get_details_by_evaluation_version/?evaluation_version_id=`

    const { user } = useContext(AuthContext)
    console.log(user)
    const { evaluationVersion } = useContext(VersionContext)
    console.log(evaluationVersion)
    const [professors, setProfessor] = useState([])

    const versions = Array.isArray(evaluationVersion) ? evaluationVersion : [];
    const mappedVersions = versions?.map(version => ({
        id: version.id,
        initial_date: version.initial_date,
        end_date: version.end_date,
        course_id: version.course
    }))
    console.log(mappedVersions)

    const getProfessors = () => {
        fetch(PROFESSORS_ENDPOINT)
        .then(res => res.json())
        .then(json => {
            return setProfessor(json)
        })
        .catch(error => {
          console.error('Error fetching professors:', error);
      });
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

    const getEvaluationVersionDetail = (courseId) => {
      console.log(courseId)
      // Busca el curso id dentro del evaluation version ya cargados
      const existingVersionCourse = mappedVersions.find(version => version.course_id === courseId)
      console.log(existingVersionCourse)
      if (!existingVersionCourse) {
          console.error(`No se encontró una versión de evaluación para el curso id ${courseId}`)
          return;
      }
      console.log(existingVersionCourse.id);
      const versionId = existingVersionCourse.id;
      console.log(versionId)
      return fetch(`${EVALUATION_VERSION_DETAIL_ENPOINT}${versionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${user.token}`,
          'Content-Type': 'application/json' 
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json();
      })
      .then(json => {
        console.log(json)
      })
      .catch(error => {
        console.error("Error fetching evaluation version detail:", error)
        throw error
      });
    }

    return { getProfessors, professors, createScheduledCourse, getEvaluationVersionDetail }
}
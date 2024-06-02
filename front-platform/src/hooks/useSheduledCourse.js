import { useState, useContext } from "react"
import { AuthContext } from '../context/user';
import { VersionContext } from "../context/evaluationVersion";
import { ScheduledCourseContext } from "../context/scheduledCourse";

export function useScheduledCourse(){
    
    //const ACADEMIC_PERIODS_ENDPOINT = `http://localhost:8000/courses/all/academic-periods/`
    const PROFESSORS_ENDPOINT = `http://127.0.0.1:8000/authentication/professors/`
    const CREATE_SCHEDULED_COURSE_ENDPOINT = `http://localhost:8000/courses/all/create-scheduled-course/`
    const EVALUATION_VERSION_DETAIL_ENDPOINT = `http://localhost:8000/courses/all/scheduled-course-detail/get_details_by_evaluation_version/?evaluation_version_id=`
    const LEARNING_OUTCOME_ENDPOINT = `http://localhost:8000/courses/all/learning-outcome/`
    const PERCENTAGE_ENDPOINT = `http://localhost:8000/courses/all/percentage/`

    const { user } = useContext(AuthContext)
    //console.log(user)
    const { evaluationVersion } = useContext(VersionContext)
    //console.log(evaluationVersion)
    const { scheduledCourse, setScheduledCourse } = useContext(ScheduledCourseContext)
    //console.log(scheduledCourse)
    const [professors, setProfessor] = useState([])
    const [evaluationVersionDetail, setEvaluationVersionDetail] = useState({})
    console.log(evaluationVersionDetail)
    const [learningOutComes, setLearningOutComes] = useState({})
    const [percentages, setPercentages] = useState({})

    const versions = Array.isArray(evaluationVersion) ? evaluationVersion : [];
    const mappedVersions = versions?.map(version => ({
        id: version.id,
        initial_date: version.initial_date,
        end_date: version.end_date,
        course_id: version.course
    }))
    //console.log(mappedVersions)

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

        return fetch(CREATE_SCHEDULED_COURSE_ENDPOINT, {
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
      //console.log(existingVersionCourse.id);
      const versionId = existingVersionCourse.id;
      console.log(versionId)
      return fetch(`${EVALUATION_VERSION_DETAIL_ENDPOINT}${versionId}`, {
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
        const { scheduled_courses } = json
        setScheduledCourse(scheduled_courses)
        const { evaluation_version_details } = json
        setEvaluationVersionDetail(evaluation_version_details)
        if(evaluation_version_details && evaluation_version_details.length > 0){
          evaluation_version_details.forEach(detail => {
            const { learning_outcome, percentage } = detail
            getLearningOutCome(learning_outcome)
            getPercentage(percentage)
          })
        }
      })
      .catch(error => {
        console.error("Error fetching evaluation version detail:", error)
        throw error
      });
    }

    const getLearningOutCome = (learningOutComeId) => {
      return fetch(`${LEARNING_OUTCOME_ENDPOINT}${learningOutComeId}`, {
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
          console.log(`Learning Outcome ${learningOutComeId}:`, json)
          setLearningOutComes(prev => ({ ...prev, [learningOutComeId] : json }))
      })
      .catch(error => {
          console.error("Error fetching learning outcome:", error)
          throw error
      });
    }

    const getPercentage = (percentageId) => {
      return fetch(`${PERCENTAGE_ENDPOINT}${percentageId}`, {
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
          console.log(`Percentage ${percentageId}:`, json)
          setPercentages(prev => ({ ...prev, [percentageId] : json }))
      })
      .catch(error => {
          console.error("Error fetching percentage:", error)
          throw error
      });
    }

    return { getProfessors, professors, createScheduledCourse, getEvaluationVersionDetail,
              learningOutComes, percentages, scheduledCourse, evaluationVersionDetail
     }
}
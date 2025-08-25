import { useEffect, useContext } from 'react';
import { AuthContext } from '../../auth/context/user';
import { VersionContext } from '../../evaluation_version/context/evaluationVersion';
import { getCourseFetch, createCourse as createCourseService, deleteCourse as deleteCourseService, updateCourse as updateCourseService } from '../services/courseService';
//import responseCursos from '../mocks/curso.json';
//import { json } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useCourses() {
    
    const EVALUATION_VESION_ENDPOINT = `${BASE_URL}courses/all/evaluation-version/`
    const { user, course, setCourse, role } = useContext(AuthContext)
    console.log(user)
    const { evaluationVersion, setEvaluationVersion } = useContext(VersionContext)
    console.log(evaluationVersion)
    //const [responseCourses, setResponseCourses] = useState([])

    useEffect(() => {
      getCourses()
    }, [role])

    const courses = course
    console.log(courses)

    const mappedCourses = courses?.map(course => ({
      id: course.id,
      name: course.name,
      code: course.code,
      description: course.description,
      credit: course.credit,
      //period: course.period
    }))
    console.log(mappedCourses)

    const getCourses = () => {
        console.log(role)
        let ENDPOINT = ''
        if (role === 'director') {
          ENDPOINT = `${BASE_URL}/courses/all/courses/`;
          console.log('Cursos del director')
          
        }else if (role === 'professor') {
          ENDPOINT = `${BASE_URL}/courses/all/scheduled-course/`;
          console.log('Cursos del profesor')
        }
        return fetch(ENDPOINT, {
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
          if(role === 'director'){
            setCourse(json)
          }
          if (role === 'professor') {
            const courses = json.map(scheduledCourse => ({
              id: scheduledCourse.course.id,
              name: scheduledCourse.course.name,
              code: scheduledCourse.course.code,
              description: scheduledCourse.course.description,
              credit: scheduledCourse.course.credit,
              group: scheduledCourse.group,
              period: scheduledCourse.period,
              professor_id: scheduledCourse.professor.id,
              evaluation_version_id: scheduledCourse.evaluation_version_id
            }))
            setCourse(courses)
            const evaluationVersionIds = json.map(version => version.evaluation_version_id);

            return Promise.all(evaluationVersionIds.map(id =>
              fetch(`${EVALUATION_VESION_ENDPOINT}${id}`)
                .then(res => res.json())
                .then(json => {
                  console.log(json)
                  setEvaluationVersion(json)
                })
            ))
            //return courses
          } if(role === 'student') {
            // Falta estudiantes
            console.log('Es estudiante')
            //return json
          }
        })
        .catch(error => {
          console.error("Error fetching courses:", error)
          throw error
        })
    }

    const getCourse = (courseId) => {
      // Busca el curso dentro de los cursos ya cargados
      const existingCourse = courses.find(course => course.id === courseId)
  
      // Si el curso ya está cargado, devuelve directamente el curso
      if (existingCourse) {
          console.log(existingCourse)
          return Promise.resolve(existingCourse)
      } else {
          // Si el curso no está cargado, realiza la petición para obtenerlo
          getCourseFetch(courseId)
      }
  }

  const deleteCourse = (courseId) => {
    return deleteCourseService(courseId, user.token)
  }

  const createCourse = (fields) => {
    return createCourseService(fields, user.token)
  }

  const updateCourse = (courseId, fields) => {
    return updateCourseService(courseId, fields, user.token)
  }
  
    return { 
        courses: course, getCourses, getCourse, createCourse, deleteCourse, updateCourse
     }
  }
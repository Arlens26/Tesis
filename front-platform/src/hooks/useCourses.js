import { useEffect, useContext } from 'react';
import { AuthContext } from '../context/user';
import { VersionContext } from '../context/evaluationVersion';
//import responseCursos from '../mocks/curso.json';
//import { json } from 'react-router-dom';

export function useCourses() {
    
    const COURSE_ENDPOINT = `http://localhost:8000/courses/all/courses/`
    const EVALUATION_VESION_ENDPOINT = `http://localhost:8000/courses/all/evaluation-version/`
    
    const { user, course, setCourse, role } = useContext(AuthContext)
    console.log(user)
    const { evaluationVersion, setEvaluationVersion } = useContext(VersionContext)
    console.log(evaluationVersion)
    //const [responseCourses, setResponseCourses] = useState([])

    useEffect(() => {
      getCourses()
    }, [role]);

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
          ENDPOINT = `http://localhost:8000/courses/all/courses/`;
          console.log('Cursos del director')
          
        }else if (role === 'professor') {
          ENDPOINT = `http://localhost:8000/courses/all/scheduled-course/`;
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
              credit: scheduledCourse.course.credit
            }));
            setCourse(courses)
            const evaluationVersionIds = json.map(version => version.evaluation_version_id);

            return Promise.all(evaluationVersionIds.map(id =>
              fetch(`${EVALUATION_VESION_ENDPOINT}${id}`)
                .then(res => res.json())
                .then(json => {
                  console.log(json)
                  setEvaluationVersion(json)
                })
            ));
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
        });
    }

    const getCourse = (courseId) => {
      // Busca el curso dentro de los cursos ya cargados
      const existingCourse = courses.find(course => course.id === courseId);
  
      // Si el curso ya está cargado, devuelve directamente el curso
      if (existingCourse) {
          console.log(existingCourse)
          return Promise.resolve(existingCourse);
      } else {
          // Si el curso no está cargado, realiza la petición para obtenerlo
          return fetch(`${COURSE_ENDPOINT}${courseId}`)
              .then(response => {
                  if (!response.ok) {
                      throw new Error('Curso no obtenido');
                  }
                  return response.json();
              });
      }
  }
  

    const createCourse = (fields) => {

      return fetch(COURSE_ENDPOINT, {
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

    const deleteCourse = (courseId) => {

        return fetch(`${COURSE_ENDPOINT}${courseId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if(response.ok){
                getCourses()
                console.log('Curso eliminado exitosamente')
            }
            if(!response.ok){
                throw new Error('Error al eliminar curso')
            }
        })
    }

    const updateCourse = (courseId, fields) => {

        return fetch(`${COURSE_ENDPOINT}${courseId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(fields)
        })
        .then(response => {
            if(response.ok){
                console.log('Curso actualizado exitosamente')
            }
            if(!response.ok){
                throw new Error('Error al actualizar curso')
            }
        })
    }

    return { 
        courses: mappedCourses, getCourses, getCourse, createCourse, deleteCourse, updateCourse
     }
  }
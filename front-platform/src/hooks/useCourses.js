import { useEffect, useContext } from 'react';
import { AuthContext } from '../context/user';
//import responseCursos from '../mocks/curso.json';
//import { json } from 'react-router-dom';

export function useCourses() {
    
    const COURSE_ENDPOINT = `http://localhost:8000/courses/all/courses/`
    
    const { course, setCourse } = useContext(AuthContext)
    //const [responseCourses, setResponseCourses] = useState([])

    useEffect(() => {
      getCourses()
    }, []);

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

    const getCourses = () => {
        fetch(COURSE_ENDPOINT)
        .then(res => res.json())
        .then(json => {
            setCourse(json)
        })
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
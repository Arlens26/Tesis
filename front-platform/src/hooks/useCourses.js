import { useState, useEffect } from 'react';
//import responseCursos from '../mocks/curso.json';
//import { json } from 'react-router-dom';

export function useCourses() {
    
    const COURSE_ENDPOINT = `http://localhost:8000/courses/all/courses/`
    
    const [responseCourses, setResponseCourses] = useState([])
    
    const courses = responseCourses

    const mappedCourses = courses?.map(course => ({
      id: course.id,
      name: course.name,
      code: course.code,
      description: course.description,
      credit: course.credit,
      period: course.period
    }))

    useEffect(() => {
        getCourses();
    }, []);

    const getCourses = () => {
        fetch(COURSE_ENDPOINT)
        .then(res => res.json())
        .then(json => {
            setResponseCourses(json)
        })
    }

    const getCourse = (courseId) => {

        return fetch(`${COURSE_ENDPOINT}${courseId}`)
        .then(response => {
            if(!response.ok){
                throw new Error('Curso no obtenido')
            }
            return response.json()
        })
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

    return { courses: mappedCourses, getCourses, getCourse, createCourse, deleteCourse, updateCourse }
  }
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
      description: course.description,
      creditos: course.creditos
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

    const createCourses = (fields) => {

      fetch(COURSE_ENDPOINT, {
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

    return { courses: mappedCourses, getCourses, createCourses }
  }
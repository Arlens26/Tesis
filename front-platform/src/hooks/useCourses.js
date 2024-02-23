import { useState } from 'react';
//import responseCursos from '../mocks/curso.json';
//import { json } from 'react-router-dom';

export function useCourses() {
    
    const [responseCourses, setResponseCourses] = useState([])
    
    const courses = responseCourses

    const mappedCourses = courses?.map(course => ({
      id: course.id,
      name: course.name,
      description: course.description,
      creditos: course.creditos
    }))

    const getCourses = () => {
        fetch(`http://localhost:8000/courses/all/courses/`)
        .then(res => res.json())
        .then(json => {
            setResponseCourses(json)
        })
    }

    return { courses: mappedCourses, getCourses }
  }
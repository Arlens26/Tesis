const BASE_URL = import.meta.env.VITE_API_BASE_URL

const COURSE_ENDPOINT = `${BASE_URL}/courses/all/courses/`


export const getCourseFetch = (courseId) => {
    return fetch(`${COURSE_ENDPOINT}${courseId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Curso no obtenido')
            }
                return response.json()
        })
}

export const createCourse = (fields, token) => {

    return fetch(COURSE_ENDPOINT, {
      method: 'POST', 
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(fields)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al enviar los datos')
      }
      return response.json() // Resuelve la promesa y parsea el cuerpo de la respuesta como JSON
    })
    .then(data => {
      console.log('Datos enviados exitosamente', data)
    })
    .catch(error => {
      console.error('Error:', error)
    })
  }


export const deleteCourse = (courseId, token) => {

    return fetch(`${COURSE_ENDPOINT}${courseId}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if(response.ok){
            //getCourses()
            console.log('Curso eliminado exitosamente')
        }
        if(!response.ok){
            throw new Error('Error al eliminar curso')
        }
    })
}

export const updateCourse = (courseId, fields, token) => {

    return fetch(`${COURSE_ENDPOINT}${courseId}/`, {
        method: 'PUT',
        headers: {
            'Authorization': `Token ${token}`,
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
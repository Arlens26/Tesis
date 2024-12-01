const COURSE_ENDPOINT = `http://localhost:8000/courses/all/courses/`


export const getCourseFetch = (courseId) => {
    return fetch(`${COURSE_ENDPOINT}${courseId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Curso no obtenido')
            }
                return response.json()
        })
}

export const createCourse = (fields) => {

    return fetch(COURSE_ENDPOINT, {
      method: 'POST', 
      headers: {
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


export const deleteCourse = (courseId) => {

    return fetch(`${COURSE_ENDPOINT}${courseId}`, {
        method: 'DELETE'
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

export const updateCourse = (courseId, fields) => {

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
const EVALUATION_VERSION_ENDPOINT = `http://localhost:8000/courses/all/evaluation-version/`
const CREATE_EVALUATION_VERSION_COURSE_ENPOINT = `http://localhost:8000/courses/all/create-evaluation-version-course/`
const ACADEMIC_PERIODS_ENDPOINT = `http://localhost:8000/courses/all/academic-periods/`


export const getEvaluationVersion = () => {
    return fetch(EVALUATION_VERSION_ENDPOINT)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener la versión de evaluación')
        }
        return response.json()
    })
}

export const createEvaluationVersion = (fields) => {

    return fetch(CREATE_EVALUATION_VERSION_COURSE_ENPOINT, {
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
      return response.json() 
    })
    /*.then(data => {
      console.log('Datos enviados exitosamente', data)
    })
    .catch(error => {
      console.error('Error:', error)
    })*/
  }

  export const academicPeriods = () => {
    return fetch(ACADEMIC_PERIODS_ENDPOINT)
    .then(response => {
        if(!response.ok){
            throw new Error('Error al obtener los períodos académicos')
        }
        return response.json()
    })
    
}
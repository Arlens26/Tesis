import { useContext, useEffect, useState } from "react";
import { VersionContext } from "../context/evaluationVersion";

export function useEvaluationVersionCourse(){
    
    const EVALUATION_VERSION_ENDPOINT = `http://localhost:8000/courses/all/evaluation-version/`
    const CREATE_EVALUATION_VERSION_COURSE_ENPOINT = `http://localhost:8000/courses/all/create-evaluation-version-course/`
    const ACADEMIC_PERIODS_ENDPOINT = `http://localhost:8000/courses/all/academic-periods/`

    const { evaluationVersion, setEvaluationVersion, hasEvaluationVersion } = useContext(VersionContext)
    const [periods, setPeriod]  = useState()
    
    console.log(hasEvaluationVersion)

    useEffect(() => {
        getEvaluationVersion()
        //getAcademicPeriods()
    },[])
    
    //const evaluationVersion = responseEvaluationVersion

          /*const mappedEvaluationVersion = evaluationVersion?.map(version => ({
        date: version.date,
        id: version.id,
      }))*/

    const getEvaluationVersion = () => {
        fetch(EVALUATION_VERSION_ENDPOINT)
        .then(res => res.json())
        .then(json => {
            console.log(json)
            setEvaluationVersion(json)
        })
    }

    const createEvaluationVersionCourse = (fields) => {

        return fetch(CREATE_EVALUATION_VERSION_COURSE_ENPOINT, {
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

      const getAcademicPeriods = () => {
        fetch(ACADEMIC_PERIODS_ENDPOINT)
        .then(res => res.json())
        .then(json => {
            console.log(json)
            setPeriod(json)
        })
    }

    return { evaluationVersion, hasEvaluationVersion, createEvaluationVersionCourse, periods, getAcademicPeriods }

}
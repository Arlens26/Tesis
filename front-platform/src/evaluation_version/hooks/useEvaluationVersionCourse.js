import { useContext, useEffect, useState } from "react";
import { VersionContext } from "../context/evaluationVersion";
import { getEvaluationVersion, createEvaluationVersion, academicPeriods } from "../services/evaluationVersionService";

export function useEvaluationVersionCourse(){
    
    const { evaluationVersion, setEvaluationVersion, hasEvaluationVersion } = useContext(VersionContext)
    const [periods, setPeriod]  = useState()
    
    console.log(hasEvaluationVersion)

    useEffect(() => {
      const dataEvaluationVersion = () => {
        getEvaluationVersion()
          .then(evaluationData => {
            setEvaluationVersion(evaluationData)
          })
          .catch(error => {
            throw new Error('Error al recibir los datos del Evaluation version', error)
          })
      }
      dataEvaluationVersion()
        //getAcademicPeriods()
    },[setEvaluationVersion])

    const createEvaluationVersionCourse = (fields) => {
      return createEvaluationVersion(fields)
        .then(data => {
          return data
        })
        .catch(error => {
          throw new Error('Error al enviar los datos de Evaluation Version', error)
        })
    }

    const getAcademicPeriods = () => {
      return academicPeriods()
      .then(data => {
        setPeriod(data)
        return data
      })
      .catch(error => {
        throw new Error('Error al obtener los datos de los periodos académicos', error)
      })
    }

    return { evaluationVersion, hasEvaluationVersion, createEvaluationVersionCourse, 
      periods, getAcademicPeriods 
    }

}
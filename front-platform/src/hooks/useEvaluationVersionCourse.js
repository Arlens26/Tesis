import { useEffect, useState } from "react";

export function useEvaluationVersionCourse(){
    const EVALUATION_VERSION_ENDPOINT = `http://localhost:8000/courses/all/evaluation-version/`
    
    const [responseEvaluationVersion, setEvaluationVersion] = useState([])

    useEffect(() => {
        getEvaluationVersion()
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

    return { responseEvaluationVersion }

}
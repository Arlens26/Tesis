import { useContext, useState } from "react"
import { AuthContext } from "../auth/context/user"

export function useEvaluationVersionDetail(){
    
    const EVALUATION_VERSION_DETAIL_BY_VERSION_ENDPOINT = `http://127.0.0.1:8000/courses/all/evaluation-version-detail/get_details_by_evaluation_version/?evaluation_version_id=`
    const { user } = useContext(AuthContext)
    const [EvaluationVersionDetails, setEvaluationVersionDetails] = useState([])
    console.log('Evaluation version details: ', EvaluationVersionDetails)

    const getEvaluationVersionDetailByVersionId = (versionId) => {
        console.log('version id: .', versionId)
        return fetch(`${EVALUATION_VERSION_DETAIL_BY_VERSION_ENDPOINT}${versionId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Token ${user.token}`,
              'Content-Type': 'application/json' 
            },
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.json()
          })
          .then(json => {
            console.log('Preview json evaluation version details:',json)
            const { evaluation_version_details } = json
            console.log('New evaluation version details: ', evaluation_version_details)
            setEvaluationVersionDetails(evaluation_version_details)
          })
          .catch(error => {
            console.error("Error fetching evaluation version detail:", error)
            throw error
          })
    }

    return { getEvaluationVersionDetailByVersionId, EvaluationVersionDetails }
}
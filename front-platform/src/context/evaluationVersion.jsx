import { createContext, useState } from "react";
import PropTypes from 'prop-types'

export const VersionContext = createContext()

export function VersionProvider({ children }){
    const [evaluationVersion, setEvaluationVersion] = useState([])
    const hasEvaluationVersion = evaluationVersion.length > 0

    return(
        <VersionContext.Provider value={{ evaluationVersion, setEvaluationVersion, hasEvaluationVersion }}>
            { children }
        </VersionContext.Provider>
    )
}

// Validamos las propiedades del VersionProvider
VersionProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
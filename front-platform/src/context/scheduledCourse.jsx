import { createContext, useState } from "react"
import PropTypes from 'prop-types'

export const ScheduledCourseContext = createContext()

export function ScheduledCourseProvider( {children} ){
    const [scheduledCourse, setScheduledCourse] = useState([])
    
    return(
        <ScheduledCourseContext.Provider value={{ scheduledCourse, setScheduledCourse }}>
            { children }
        </ScheduledCourseContext.Provider>
    ) 
}

// Validamos las propiedades del ScheduledCourseProvider
ScheduledCourseProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
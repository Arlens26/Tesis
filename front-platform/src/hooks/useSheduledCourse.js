import { useState } from "react"

export function useScheduledCourse(){
    
    //const ACADEMIC_PERIODS_ENDPOINT = `http://localhost:8000/courses/all/academic-periods/`
    const PROFESSORS_ENDPOINT = `http://127.0.0.1:8000/authentication/professors/`
    const [professors, setProfessor] = useState([])

    const getProfessors = () => {
        fetch(PROFESSORS_ENDPOINT)
        .then(res => res.json())
        .then(json => {
            return setProfessor(json)
        })
    }

    return { getProfessors, professors }
}
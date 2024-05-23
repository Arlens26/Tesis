import { useState } from "react"

export function useActivities(){
    const ACTIVITY_ENDPOINT = `http://localhost:8000/activities/all/activities/`
    const [activities, setActivities] = useState({})

    const getActivities = () => {
        fetch(ACTIVITY_ENDPOINT)
        .then(res => res.json())
        .then(json => {
            console.log(json)
            setActivities(json)
        })
    }

    return { getActivities, activities }
}
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

    const createActivity = (fields) => {
        return fetch(ACTIVITY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(fields)
        })
        .then(response => {
            if(!response.ok){
                throw new Error('Error al enviar los datos de la actividad')
            }
            return response.json()
        })
        .then(data => {
            console.log('Datos enviados exitosamente', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    return { getActivities, activities, createActivity }
}
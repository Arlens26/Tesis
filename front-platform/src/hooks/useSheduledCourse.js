import { useState, useContext } from "react"
import { AuthContext } from '../context/user';
import { VersionContext } from "../context/evaluationVersion";

export function useScheduledCourse(){
    
    const PROFESSORS_ENDPOINT = `http://127.0.0.1:8000/authentication/professors/`
    const CREATE_SCHEDULED_COURSE_ENDPOINT = `http://localhost:8000/courses/all/create-scheduled-course/`
    const SCHEDULED_COURSE = `http://127.0.0.1:8000/courses/all/scheduled-course/`
    const EVALUATION_VERSION_DETAIL_ENDPOINT = `http://localhost:8000/courses/all/scheduled-course-detail/get_details_by_evaluation_version/?evaluation_version_ids=`

    const { user } = useContext(AuthContext)
    //console.log(user)
    const { evaluationVersion } = useContext(VersionContext)
    console.log('Evaluation vesion: ', evaluationVersion)
    const [newScheduledCourse, setNewScheduledCourse] = useState([])
    console.log('New scheduled course estado: ', newScheduledCourse)
    const [professors, setProfessor] = useState([])
    const [allScheduledCourse, setAllScheduledCourse] = useState([])
    console.log('All scheduled course: ', allScheduledCourse)
    const [evaluationVersionDetail, setEvaluationVersionDetail] = useState({})

    const versions = evaluationVersion ? [evaluationVersion] : []
    console.log('versions: ', versions)
    const mappedVersions = versions.map(version => ({
      id: version.id,
      initial_date: version.initial_date,
      end_date: version.end_date,
      course_id: version.course
    }))
    console.log('mapped versions: ', mappedVersions)

    const getProfessors = () => {
        fetch(PROFESSORS_ENDPOINT)
        .then(res => res.json())
        .then(json => {
            return setProfessor(json)
        })
        .catch(error => {
          console.error('Error fetching professors:', error)
      })
    }

    const getAllScheduledCourse = () => {
      fetch(SCHEDULED_COURSE, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${user.token}`,
          'Content-Type': 'application/json' 
        },
      })
      .then(res => res.json())
      .then(json => {
          return setAllScheduledCourse(json)
      })
      .catch(error => {
        console.error('Error fetching scheduled course', error)
      })
    }

    const createScheduledCourse = (fields) => {

        return fetch(CREATE_SCHEDULED_COURSE_ENDPOINT, {
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
        .then(data => {
          console.log('Datos enviados exitosamente', data)
        })
        .catch(error => {
          console.error('Error:', error)
        })
      }

    const getEvaluationVersionDetail = (versionIds, period) => {
      console.log('Period' , period)
      return fetch(`${EVALUATION_VERSION_DETAIL_ENDPOINT}${versionIds}`, {
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
        console.log('Preview json:',json)
        const { scheduled_courses } = json
        console.log('Json: ', json)
        const newScheduledCorses = scheduled_courses.filter(element => 
          element.professor.id === Number(user.id) &&
          element.period.id === period.id &&
          element.period.year === period.year &&
          element.period.semester === period.semester)
        console.log('New scheduled courses: ', newScheduledCorses)
        setNewScheduledCourse(newScheduledCorses)
        const { evaluation_version_details } = json
        console.log('New evaluation version detail: ', evaluation_version_details)
        setEvaluationVersionDetail(evaluation_version_details)
      })
      .catch(error => {
        console.error("Error fetching evaluation version detail:", error)
        throw error
      })
    }

    return { getProfessors, professors, createScheduledCourse, getEvaluationVersionDetail,
             evaluationVersionDetail, getAllScheduledCourse, allScheduledCourse, newScheduledCourse
     }
}
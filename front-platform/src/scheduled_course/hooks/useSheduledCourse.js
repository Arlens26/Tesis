import { useState, useContext } from "react"
//import { AuthContext } from '../auth/context/user';
import { AuthContext } from "../../auth/context/user";
//import { VersionContext } from "../../evaluation_version/context/evaluationVersion";
//import { VersionContext } from "../evaluation_version/context/evaluationVersion";
import { professorsFetch, allScheduledCourseFetch, createScheduledCourseFetch, evaluationVersionDetailFetch } from "../services/scheduledCourseService";

export function useScheduledCourse(){
    
    const { user } = useContext(AuthContext)
    //console.log(user)
    //const { evaluationVersion } = useContext(VersionContext)
    //console.log('Evaluation vesion: ', evaluationVersion)
    const [newScheduledCourse, setNewScheduledCourse] = useState([])
    //console.log('New scheduled course estado: ', newScheduledCourse)
    const [professors, setProfessor] = useState([])
    const [allScheduledCourse, setAllScheduledCourse] = useState([])
    //console.log('All scheduled course: ', allScheduledCourse)
    const [evaluationVersionDetail, setEvaluationVersionDetail] = useState({})

    //****  Nota: Se comentó todo versions porque aparentemente ya no lo uso ****//
    //const versions = evaluationVersion ? [evaluationVersion] : []
    //console.log('versions: ', versions)
    /*const mappedVersions = versions.map(version => ({
      id: version.id,
      initial_date: version.initial_date,
      end_date: version.end_date,
      course_id: version.course
    }))*/
    //console.log('mapped versions: ', mappedVersions)
    /************** */

    const getProfessors = () => {
      professorsFetch()
        .then(json => setProfessor(json))
        .catch(error => {
          throw new Error('Error al recibir los datos de los profesores', error)
        })
    }

    const getAllScheduledCourse = () => {
      allScheduledCourseFetch(user.token)
        .then(json => setAllScheduledCourse(json))
        .catch(error => {
          throw new Error('Error al recibir los datos de todos los cursos programados', error)
        })
    }

    const createScheduledCourse = (fields) => {
      createScheduledCourseFetch(fields)
        .then(data => console.log('Datos enviados exitosamente', data))
        .catch(error => {
           throw new Error('Error al crear un curso programado', error)
        })
    }

    const getEvaluationVersionDetail = (versionIds, period) => {
      //console.log('Period' , period)
      evaluationVersionDetailFetch(versionIds, user.token)
        .then(json => {
            //console.log('Preview json:',json)
            const { scheduled_courses } = json
            //console.log('Json: ', json)
            const newScheduledCorses = scheduled_courses.filter(element =>
              element.professor.id === Number(user.id) &&
              element.period.id === period.id &&
              element.period.year === period.year &&
              element.period.semester === period.semester
            )
            //console.log('New scheduled courses: ', newScheduledCorses)
            setNewScheduledCourse(newScheduledCorses)
            //console.log('New evaluation version detail: ', evaluation_version_details)
            setEvaluationVersionDetail(json.evaluation_version_details)
        })
        .catch(error => {
          throw new Error('Error al obtener el detalle de la versión de evaluación', error)
        })
    }

    return { getProfessors, professors, createScheduledCourse, getEvaluationVersionDetail,
             evaluationVersionDetail, getAllScheduledCourse, allScheduledCourse, newScheduledCourse
    }
}
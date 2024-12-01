import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { CreateIcon, EditIcon, DeleteIcon, SearchListIcon, ListCheckIcon } from "./Icons"
import { useUsers } from "../hooks/useUsers"
import { useCourses } from "../courses/hooks/useCourses"
import { useEvaluationVersionCourse } from "../hooks/useEvaluationVersionCourse"
import { EvaluationVersionList } from "./EvaluationVersionList"

function BtnCreateCourse() {
    const navigate = useNavigate()
    const handleCreateCourse = () => {
        navigate('/course')
      }

    return (
    <div className='flex justify-end items-center'> 
      <button className='bg-btn-create opacity-80 px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'
      onClick={handleCreateCourse}>
          <CreateIcon/>
          <span className="ml-1">Crear curso</span>
      </button>
    </div>
    )
}

function BtnStudentEnrolledCourseList() {
  const navigate = useNavigate()
  const handleCheckStudentEnrolledCourse = () => {
      navigate('/student-enrolled-course-list')
    }

  return (
  <div className='flex justify-end items-center'> 
    <button className='bg-btn-create opacity-80 px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'
    onClick={handleCheckStudentEnrolledCourse}>
        <SearchListIcon/>
        <span className="ml-1">Consultar programación</span>
    </button>
  </div>
  )
}

const BtnSemesterGroup = ({ onSelectSemester }) => {
  const currentYear = new Date().getFullYear()
  const currentSemester = new Date().getMonth() < 6 ? 1 : 2

  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <button 
      type="button" 
      className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
      onClick={() => onSelectSemester('current')}>
        Semestre {currentYear}-{currentSemester}
      </button>
      <button 
      type="button" 
      className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
      onClick={() => onSelectSemester('previous')}>
        Semestres anteriores
      </button>
    </div>
  )
}

export function CourseList() { 
    const { courses, getCourse, deleteCourse, getCourses } = useCourses()
    console.log('Lista de cursos: ', courses)
    const [accordionStates, setAccordionStates] = useState({})
    //const { responseEvaluationVersion } = useEvaluationVersionCourse()
    const { evaluationVersion, hasEvaluationVersion } = useEvaluationVersionCourse()
    const [ selectedSemester, setSelectedSemester ] = useState('current')
    
    const [search, updateSearch] = useState('')
    const [filteredCourses, setFilteredCourses] = useState([])

    const { role } = useUsers()
  
    const navigate = useNavigate()

    //const hasEvaluationVersion = responseEvaluationVersion.length > 0
    console.log(hasEvaluationVersion)
    console.log(evaluationVersion)

    const getCurrentSemesterCourses = () => {
      const currentYear = new Date().getFullYear()
      const currentSemester = new Date().getMonth() < 6 ? 1 : 2
    
      return courses.filter(
        (course) => course.period && course.period.year === currentYear && course.period.semester === currentSemester
      )
    }
    
    const getPreviousSemesterCourses = () => {
      const currentYear = new Date().getFullYear()
      const currentSemester = new Date().getMonth() < 6 ? 1 : 2
    
      return courses.filter(
        (course) => course.period && (course.period.year < currentYear || (course.period.year === currentYear && course.period.semester < currentSemester))
      )
    }

    useEffect(() => {
      const currentSemesterCourses = getCurrentSemesterCourses(courses)
      const previousSemesterCourses = getPreviousSemesterCourses(courses)
      filterCourses(search, currentSemesterCourses, previousSemesterCourses)
    }, [courses, search, role, selectedSemester])
  
    const toggleAccordion = (id) => {
      setAccordionStates((prevState) => ({
        ...prevState,
        [id]: !prevState[id] || false, // Si el estado no existe, lo inicializa como false
      }));
    };
  
    const handleEditCourse = (courseId) => {
      getCourse(courseId)
        .then(courseData => {
          navigate(`/course/${courseId}`, {state: {courseData}})
        })
        .catch(error => console.log('Error al obtener cursos', error))
    }
  
    const handleDeleteCourse = (courseId, courseName) => {
      console.log(courseName)
       deleteCourse(courseId)
       .then(() => {
         toast.success(`El curso ${courseName} ha sido eliminado`)
         getCourses()
         navigate('/course-list')
        }
       )
       .catch(error => console.log('Error al eliminar curso', error))
    }
  
    const handleCreateEvaluationVersion = (courseId) =>{
      const selectedCourse = courses.find(course => course.id === courseId)
      console.log(selectedCourse)
      navigate('/evaluation-version-course/', {state: { course: selectedCourse}})
      //navigate('/evaluation-version-course/', {state: { courseId }});
    }

    const handleScheduledCourse = (courseId, versionId) =>{
      console.log(versionId)
      navigate('/scheduled-course/', {state: {course_id: courseId, version_id: versionId}})
    }

    const handleActivity = (course) => {
      navigate('/course-list/activity/', {state: {course: course}})
    }

    const handleActivityRaiting = (courseId, versionId) => {
      navigate('/grade-detail', {state: {course_id: courseId, version_id: versionId}})
    }
    
    const handleSelectSemester = (semester) => {
      setSelectedSemester(semester)
    }

    //const currentYear = new Date().getFullYear()
    //const currentSemester = new Date().getMonth() < 6 ? 1 : 2
    
    /*const currentSemesterCourses = courses.filter(
      (course) => course.period && course.period.year === currentYear && course.period.semester === currentSemester
    )
  
    const previousSemesterCourses = courses.filter(
      (course) => course.period && (course.period.year < currentYear || (course.period.year === currentYear && course.period.semester < currentSemester))
    )*/

    const filterCourses = (searchTerm, currentSemesterCourses, previousSemesterCourses) => {
      console.log(searchTerm)
      const coursesToSearch = role === 'professor'
        ? (selectedSemester === 'current' ? currentSemesterCourses : previousSemesterCourses)
        : courses
  
      if (!searchTerm) {
        setFilteredCourses(coursesToSearch)
        return
      }
  
      const filtered = coursesToSearch.filter(course => 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      setFilteredCourses(filtered)
    }

    const currentSemesterCourses = getCurrentSemesterCourses(courses)
    const previousSemesterCourses = getPreviousSemesterCourses(courses)
  
    const coursesToRender = search ? filteredCourses : (role === 'professor'
    ? (selectedSemester === 'current' ? currentSemesterCourses : previousSemesterCourses)
    : courses)
    console.log('Courses to render: ', coursesToRender)

    //console.log(courses.length)
    if (!courses || courses.length === 0) {
      return (
          <>
              <span>No hay cursos creados...</span>
          </>
      );
  }

    const handleSubmit = (event) => {
      event.preventDefault()
      const filteredCourses = coursesToRender.filter(
        (course) =>
          course.name.toLowerCase().includes(search.toLowerCase()) ||
          course.code.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredCourses(filteredCourses)
      console.log({ search })
    }

    const handleChange = (event) => {
      const newSearch = event.target.value
      if(newSearch.startsWith(' ')) return
      updateSearch(event.target.value)
      const currentSemesterCourses = getCurrentSemesterCourses(courses)
      const previousSemesterCourses = getPreviousSemesterCourses(courses)
      filterCourses(newSearch, currentSemesterCourses, previousSemesterCourses)
    }
  
    return (
      <section>
        <form className="max-w-md mx-auto m-2" onSubmit={handleSubmit}>   
            <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input name="search" onChange={handleChange} value={search} type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Cursos, códigos..." required />
                {/*<button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Buscar</button>*/}
            </div>
        </form>
        <div className='flex flex-col gap-2'>
        {role === 'professor' ? (
          <BtnSemesterGroup onSelectSemester={handleSelectSemester}/>
        ) :  null}
        {role === 'director' ? (
          <div className="flex justify-end gap-2">
            <BtnCreateCourse/>
            <BtnStudentEnrolledCourseList/>
          </div>
        ) : null}
          {coursesToRender.filter((curso, index, self) => {
            return self.findIndex((c) => c.id === curso.id) === index
          }).sort((a,b) => a.name > b.name).map((curso) => (
                <div key={curso.id} id={`accordion-collapse-${curso.id}`} data-accordion="collapse">
                  <h2 id={`accordion-collapse-heading-${curso.id}`}>
                    <div
                      type="button"
                      className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                      data-accordion-target={`#accordion-collapse-body-${curso.id}`}
                      aria-expanded={accordionStates[curso.id]}
                      onClick={() => toggleAccordion(curso.id)}
                      aria-controls={`accordion-collapse-body-${curso.id}`}
                    >
                      <div className='flex items-start gap-2'>
                      {role === 'director' ? (
                        <>
                        <button className='bg-btn-edit opacity-80 rounded-sm py-1 px-1 hover:opacity-100'
                          onClick={(e) => {
                            // Detener la propagación del evento para que no afecte al botón del acordeón
                            e.stopPropagation()
                            handleEditCourse(curso.id)
                          }}>
                            <EditIcon />
                          </button>
                          {!hasEvaluationVersion || !evaluationVersion.some(ev => ev.course === curso.id) ? (
                          <button className='bg-primary opacity-80 rounded-sm py-1 px-1 hover:opacity-100'
                              onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCourse(curso.id, curso.name)
                            }}> 
                            <DeleteIcon />
                          </button>
                          ) : null}
                        </>
                      ) : null}
                      <div className="flex flex-col">
                        <span>{curso.name} - {curso.code}</span>
                        <span className="text-xs">Créditos: {curso.credit}</span>
                      </div>
                      </div>
                      <svg
                        data-accordion-icon
                        className={`w-3 h-3 ${accordionStates[curso.id] ? 'rotate-0' : 'rotate-180'} shrink-0`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                      </svg>
                    </div>
                  </h2>
                  <div
                    id={`accordion-collapse-body-${curso.id}`}
                    className={`${accordionStates[curso.id] ? 'block' : 'hidden'}`}
                    aria-labelledby={`accordion-collapse-heading-${curso.id}`}
                  >
                    {/*<div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                      <span>La cantidad de créditos es: {curso.credit}</span>
                    </div>*/}
                    {role === 'director' ? (
                      <>
                        <div className="relative px-4 py-4 overflow-x-auto shadow-md sm:rounded-lg">             
                      <button 
                        className='bg-btn-create opacity-80 px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'
                        onClick={(e) =>{
                          e.stopPropagation();
                          handleCreateEvaluationVersion(curso.id)
                          }}>
                          <CreateIcon/>
                          <span className="ml-1">Evaluación versión</span>
                      </button>
                      {hasEvaluationVersion && evaluationVersion.some(ev => ev.course === curso.id) ? (
                      <div className="grid gap-2">
                        <EvaluationVersionList courseId={curso.id}/>
                        <button 
                            className='bg-btn-create opacity-80 w-fit px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'
                            onClick={(e) =>{
                              e.stopPropagation();
                               // Filtrar las versiones para encontrar la última versión activa
                              const activeVersion = evaluationVersion.filter(version => version.course == curso.id && !version.end_date);

                              // Verificar si hay alguna versión activa
                              if (activeVersion.length > 0) {
                                // Obtener el id de la última versión activa
                                const activeVersionId = activeVersion[activeVersion.length - 1].id;
                                console.log(activeVersionId)
                                handleScheduledCourse(curso.id, activeVersionId)
                              } else {
                                console.log("No hay ninguna versión activa para este curso.");
                              }
                              }}>
                              <CreateIcon/>
                              <span className="ml-1">Programar curso</span>
                        </button>
                      </div>
                    ) : null}
                    </div>
                      </>
                    ): null}

                    {role === 'professor' ? (
                      <div className="flex gap-2">
                        <button 
                          className='bg-btn-create opacity-80 px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'
                          onClick={(e) =>{
                            e.stopPropagation();
                            console.log(curso.id)
                            const selectedCourse = coursesToRender.filter(course => course.id === curso.id)
                            const groupedCourse = selectedCourse.reduce((acc, curso) => {
                              // Busca si ya existe un curso con el mismo id
                              const existingCourse = acc.find(item => item.id === curso.id)
                              
                              if (existingCourse) {
                                // Si existe, añade la variación al arreglo os detalles
                                existingCourse.details.push({
                                  evaluation_version_id: curso.evaluation_version_id,
                                  group: curso.group,
                                  period: curso.period
                                })
                              } else {
                                // Si no existe, crea un nuevo objeto con los detalles
                                acc.push({
                                  code: curso.code,
                                  credit: curso.credit,
                                  description: curso.description,
                                  id: curso.id,
                                  name: curso.name,
                                  professor_id: curso.professor_id,
                                  period: curso.period,
                                  details: [{
                                    evaluation_version_id: curso.evaluation_version_id,
                                    group: curso.group,
                                    //period: curso.period
                                  }]
                                })
                              }
                            
                              return acc
                            }, [])
                            handleActivity(groupedCourse)
                          }}>
                          <CreateIcon/>
                          <span className="ml-1">Configurar evaluación</span>
                        </button>  
                        <button 
                          className='bg-btn-create opacity-80 px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'
                          onClick={(e) =>{
                            e.stopPropagation();
                            //console.log(curso.id)
                            handleActivityRaiting(curso.id, curso.evaluation_version_id)
                          }}>
                          <ListCheckIcon/>
                          <span className="ml-1">Calificaciones</span>
                        </button>
                      </div>
                    ): null}
                  </div>
                </div>
            ))}
        </div>
      </section>
    );
  }

  /*function NoCoursesResults(){
    return (
        <>
            <BtnCreateCourse/>
            <span>No hay cursos creados...</span>
        </>
    )
  }*/

  /*export function Courses(){
    const { courses, getCourse, deleteCourse } = useCourses()
    /*const [hasCourses, setHasCourses] = useState(false);

    useEffect(() => {
        if (courses && courses.length > 0) {
        setHasCourses(true);
        } else {
        setHasCourses(false);
        }
    }, [courses]);*/

    /*return (
        //hasCourses ? (
        <CourseList courses={courses} getCourse={getCourse} deleteCourse={deleteCourse} />
        /*) : (
        <NoCoursesResults />
        )*/
   /* )
  }*/

 /* CourseList.propTypes = {
    courses: PropTypes.array.isRequired,
    getCourse: PropTypes.func.isRequired,
    deleteCourse: PropTypes.func.isRequired
  };*/
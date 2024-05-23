import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditIcon, DeleteIcon } from "./Icons";
//import PropTypes from 'prop-types';
import { useUsers } from "../hooks/useUsers";
import { useCourses } from "../hooks/useCourses";
import { useEvaluationVersionCourse } from "../hooks/useEvaluationVersionCourse";
import { EvaluationVersionList } from "./EvaluationVersionList";

function BtnCreateCourse() {
    const navigate = useNavigate()
    const handleCreateCourse = () => {
        navigate('/course')
      }

    return (
    <div className='flex justify-end items-center'> 
      <button className='bg-btn-create opacity-80 px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'
      onClick={handleCreateCourse}>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-plus h-6 w-6 mr-2" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M12 5l0 14" />
              <path d="M5 12l14 0" />
          </svg>
          <span>Crear curso</span>
      </button>
    </div>
    )
}

const BtnSemesterGroup = ({ onSelectSemester }) => {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <button 
      type="button" 
      className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
      onClick={() => onSelectSemester('current')}>
        Semestre actual
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
    const { courses, getCourse, deleteCourse } = useCourses()
    const [accordionStates, setAccordionStates] = useState({})
    //const { responseEvaluationVersion } = useEvaluationVersionCourse()
    const { evaluationVersion, hasEvaluationVersion } = useEvaluationVersionCourse()
    const [ selectedSemester, setSelectedSemester ] = useState('current')

    const { role } = useUsers()
  
    const navigate = useNavigate()

    //const hasEvaluationVersion = responseEvaluationVersion.length > 0
    console.log(hasEvaluationVersion)
    console.log(evaluationVersion)
  
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
  
    const handleDeleteCourse = (courseId) => {
       deleteCourse(courseId)
       .then(() => {
         navigate('/course-list')
        }
       )
       .catch(error => console.log('Error al eliminar curso', error))
    }
  
    const handleCreateEvaluationVersion = (courseId) =>{
      const selectedCourse = courses.find(course => course.id === courseId);
      console.log(selectedCourse)
      navigate('/evaluation-version-course/', {state: { course: selectedCourse}})
      //navigate('/evaluation-version-course/', {state: { courseId }});
    }

    const handleScheduledCourse = (courseId, versionId) =>{
      console.log(versionId)
      navigate('/scheduled-course/', {state: {course_id: courseId, version_id: versionId}})
    }

    const handleActivity = (courseId) => {
      navigate('/activity/', {state: {course_id: courseId}})
    }
    
    const handleSelectSemester = (semester) => {
      setSelectedSemester(semester);
    }

    const currentYear = new Date().getFullYear()
    const currentSemester = new Date().getMonth() < 6 ? 1 : 2
    
    const currentSemesterCourses = courses.filter(
      (course) => course.period && course.period.year === currentYear && course.period.semester === currentSemester
    );
  
    const previousSemesterCourses = courses.filter(
      (course) => course.period && (course.period.year < currentYear || (course.period.year === currentYear && course.period.semester < currentSemester))
    );
  
    const coursesToRender = role === 'professor'
    ? (selectedSemester === 'current' ? currentSemesterCourses : previousSemesterCourses)
    : courses;
    console.log(coursesToRender)

    //console.log(courses.length)
    if (!courses || courses.length === 0) {
      return (
          <>
              <span>No hay cursos creados...</span>
          </>
      );
  }
  
    return (
      <section>
        <div className='flex flex-col gap-2'>
        {role === 'professor' ? (
          <BtnSemesterGroup onSelectSemester={handleSelectSemester}/>
        ) :  null}
        {role === 'director' ? (
          <BtnCreateCourse/>
        ) : null}
          {coursesToRender.map((curso) => (
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
                              handleDeleteCourse(curso.id)
                            }}> 
                            <DeleteIcon />
                          </button>
                          ) : null}
                        </>
                      ) : null}
                      <span>{curso.name} - {curso.code}</span>
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
                    <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                      <span>La cantidad de créditos es: {curso.credit}</span>
                    </div>
                    {role === 'director' ? (
                      <>
                        <div className="relative px-4 py-4 overflow-x-auto shadow-md sm:rounded-lg">             
                      <button 
                        className='bg-btn-create opacity-80 px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'
                        onClick={(e) =>{
                          e.stopPropagation();
                          handleCreateEvaluationVersion(curso.id)
                          }}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-plus h-6 w-6 mr-2" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M12 5l0 14" />
                              <path d="M5 12l14 0" />
                          </svg>
                          <span>Evaluación versión</span>
                      </button>
                      {hasEvaluationVersion && evaluationVersion.some(ev => ev.course === curso.id) ? (
                      <>
                        <EvaluationVersionList courseId={curso.id}/>
                        <button 
                            className='bg-btn-create opacity-80 px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'
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
                              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>
                              <span>Programar curso</span>
                        </button>
                      </>
                    ) : null}
                    </div>
                      </>
                    ): null}

                    {role === 'professor' ? (
                      <button 
                        className='bg-btn-create opacity-80 px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'
                        onClick={(e) =>{
                          e.stopPropagation();
                          console.log(curso.id)
                          handleActivity(curso.id)
                        }}>
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>
                        <span>Crear actividades</span>
                      </button>  
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
import { useState, version } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../hooks/useCourses";
import { EditIcon, DeleteIcon } from "./Icons";
import PropTypes from 'prop-types';
import { useEvaluationVersionCourse } from "../hooks/useEvaluationVersionCourse";

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

function EvaluationVersionList(){
    const { responseEvaluationVersion } = useEvaluationVersionCourse()
    console.log(responseEvaluationVersion)
    const end_date = ''

    return(
        <>
        <h1>Evaluation Version Data</h1>
        <div>
            {responseEvaluationVersion.map(version => (
            <div key={version.id}>
                <p>Version ID: {version.id}</p>
                <p>Date: {version.date}</p>
                <p>Course ID: {version.course}</p>
            </div>
            ))}
        </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Creación evaluación versión curso</th>
                        <th scope="col" className="px-6 py-3">Fecha de finalización</th>
                        <th scope="col" className="px-6 py-3">Estado</th>
                        <th scope="col" className="px-6 py-3">Acciones</th>
                    </tr>
                </thead>
                    <tbody>
                            {responseEvaluationVersion.map(version => (
                                <tr key={version.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{version.date}</td>
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"></td>
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{ end_date == '' ? 'Activo' : 'Inactivo' }</td>
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <div className="flex space-x-2">
                                            <button>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                                                    <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
            </table>
        </>
    )
}

export function CourseList() { 
    const { courses, getCourse, deleteCourse } = useCourses()
    const [accordionStates, setAccordionStates] = useState({})
    const { responseEvaluationVersion } = useEvaluationVersionCourse()
  
    const navigate = useNavigate()

    const hasEvaluationVersion = responseEvaluationVersion.length > 0
    console.log(responseEvaluationVersion)
  
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

    const handleScheduledCourse = (versionId) =>{
        console.log(versionId)
        navigate('/scheduled-course/')
    }

    //console.log(courses.length)
    if(courses.length <= 0){
        return (
            <>
                <BtnCreateCourse/>
                <span>No hay cursos creados...</span>
            </>
        )
    }
  
    return (
      <section>
        <div className='flex flex-col gap-2'>
          <BtnCreateCourse/>
          {courses.map((curso) => (
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
                        <button className='bg-btn-edit opacity-80 rounded-sm py-1 px-1 hover:opacity-100'
                        onClick={(e) => {
                          // Detener la propagación del evento para que no afecte al botón del acordeón
                          e.stopPropagation()
                          handleEditCourse(curso.id)
                        }}>
                          <EditIcon />
                        </button>
                        { hasEvaluationVersion ? null : (
                                <button className='bg-primary opacity-80 rounded-sm py-1 px-1 hover:opacity-100'
                                    onClick={(e) => {
                                    // Detener la propagación del evento para que no afecte al botón del acordeón
                                    e.stopPropagation();
                                    handleDeleteCourse(curso.id)
                                 }}> 
                                <DeleteIcon />
                                 </button>
                        )}
                        <span>{curso.name}</span>
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
                    <EvaluationVersionList/>
                    <button 
                        className='bg-btn-create opacity-80 px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'
                        onClick={(e) =>{
                          e.stopPropagation();
                          handleScheduledCourse(version.id)
                          }}>
                          <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>
                          <span>Evaluación versión</span>
                      </button>
                    </div>
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

  CourseList.propTypes = {
    courses: PropTypes.array.isRequired,
    getCourse: PropTypes.func.isRequired,
    deleteCourse: PropTypes.func.isRequired
  };
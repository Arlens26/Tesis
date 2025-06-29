
import './App.css';
import MonacoEditorWrapper from './components/MonacoEditor';
import { Toaster } from 'sonner';
import { MenuIcon } from './components/Icons';
import { useId, useState } from 'react';
import { FooterPage } from './pages/Footer.jsx';
import { HeaderPage } from './pages/Header.jsx';
import { Link, Routes, Route } from 'react-router-dom';
import { LoginForm } from './auth/components/LoginForm.jsx';
import { CourseList } from './courses/components/CourseList.jsx';
import { CourseForm } from './courses/components/CourseForm.jsx';
import { EvaluationVersionCourseForm } from './evaluation_version/components/EvaluationVersionCourseForm.jsx';
//import { useCourses } from './hooks/useCourses.js';
import { ScheduledCourse } from './scheduled_course/components/ScheduledCourse.jsx';
import { VersionProvider } from './evaluation_version/context/evaluationVersion.jsx';
import { SelectRole } from './auth/components/SelectRole.jsx';
import { Activity } from './activities/components/Activity.jsx';
import { ScheduledCourseProvider } from './scheduled_course/context/scheduledCourse.jsx';
//import { BreadCrumb } from './components/BreadCrumb.jsx';
import { ActivityRating } from './activities/components/ActivityRating.jsx';
import { EnrolledStudent } from './students/components/EnrolledStudent.jsx';
import { StudentEnrolledCourseList } from './students/components/StudentEnrolledCourseList.jsx';
import { EnrolledStudentList } from './students/components/EnrolledStudentList.jsx';
import { StudentGradeReport } from './students/components/StudentGradeReport.jsx';
import { EvaluationVersionCourseDetailView } from './components/EvaluationVersionCourseDetailView.jsx';
import { useRef } from 'react';
import { useEffect } from 'react';

function App() {

  const code = '// Agregue el código';
  const test = '// Código de prueba';
  const language = 'python';
  const theme = 'vs-dark';
  const size = 30
  const menuCheckId = useId();

  //const { courses, getCourse, deleteCourse } = useCourses();
  const [menuChecked, setMenuChecked] = useState(true)
  const menuRef = useRef(null)

  const handleMenuToggle = () => {
    setMenuChecked(!menuChecked)
    console.log(menuChecked)
  }

  const handleClickOutSide = (event) => {
    if(menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuChecked(true)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSide)
    return () => {
      document.removeEventListener('mousedown', handleClickOutSide)
    }
  }, [])

  const [components, setComponents] = useState([])

  const agregarComponente = () => {
    setComponents([...components, <Card key={components.length} />]);
    console.log(components)
  } 

  function Card() {
      const [score, setScore] = useState(1);

      const handleDecrement = () => {
        console.log('Decrement Score : '+score)
        const newValue = score > 1 ? score - 1 : 1;
        setScore(newValue); 
        console.log('Decrement: '+newValue)
      };

      const handleIncrement = () => {
        console.log('Increment Score : '+score)
        const newValue = score < 5 ? score + 1 : 5;
        setScore(newValue);
        console.log('Increment: '+newValue)
      };

      const handleChange = (e) => {
        const inputValue = parseInt(e.target.value, 10);

        if(!isNaN(inputValue) && inputValue >=1 && inputValue <= 5){
          setScore(inputValue);
          console.log('Input Value: '+score)
        } else{
          setScore(score);
        }
      }

    return (
      <>         
        <form className="max-w-xs mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Escoja los puntos:</label>
            <div className="relative flex items-center max-w-[11rem]">
                <button onClick={handleDecrement} type="button" id="decrement-button" data-input-counter-decrement="bedrooms-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                    </svg>
                </button>
                <input type="text" id="bedrooms-input" data-input-counter data-input-counter-min="1" data-input-counter-max="5" aria-describedby="helper-text-explanation" className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pb-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" value={score} onChange={handleChange} required/>
                <div className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-calculator" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M4 3m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><
                          path d="M8 7m0 1a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1z" />
                          <path d="M8 14l0 .01" /><path d="M12 14l0 .01" /><path d="M16 14l0 .01" /><path d="M8 17l0 .01" />
                          <path d="M12 17l0 .01" /><path d="M16 17l0 .01" />
                       </svg>
                    <span>Puntos</span>
                </div>
                <button onClick={handleIncrement} type="button" id="increment-button" data-input-counter-increment="bedrooms-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                    </svg>
                </button>
            </div>
            <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">Selecciones la cantidad de puntos para la pregunta.</p>
        </form>
        <div className='mb-4'>
        <textarea id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Escribe tu pregunta..."></textarea>                
        </div>
        <div className='mb-4'>
        <MonacoEditorWrapper code={code} language={language} theme={theme} size={size} />
        </div>
        <MonacoEditorWrapper code={test} language={language} theme={theme} size={size} />
      </>
    )
  }
   
  function CreateCode() { 
    const [selectedTheme, setSelectedTheme] = useState(''); // Estado para rastrear el tema seleccionado

    const handleChange = (e) => {
      setSelectedTheme(e.target.value); // Actualiza el estado cuando cambia la selección
    }; 
    return(
      <>
        <div className='flex flex-col gap-4 mb-4'>          
          <div className=''>   
              <select id="countries" value={selectedTheme} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option disabled>Tema</option>
                <option value="DK">Dark</option>
                <option value="LT">Light</option>
              </select>         
              <form className="max-w-sm">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tamaño de fuente:</label>
                  <input type="number" id="number-input" data-input-counter data-input-counter-min="1" data-input-counter-max="100" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="100" required/>
              </form>
          </div>
          <div className='flex flex-col-2 gap-4'>
              <button className='bg-btn-create opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100' onClick={agregarComponente}>Agregar pregunta</button>
              <button className='bg-primary opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100'>Eliminar pregunta</button>
          </div>
          {components.map((component, index) => (
            <div key={index}>
              <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'><strong>Pregunta {index + 1}:</strong></label>
              {component}
              </div>
          ))}
        </div>
        <button className='bg-primary opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100'>Guardar</button>
      </>
    )
  }

  return (
    <VersionProvider>
      <ScheduledCourseProvider>
        <Toaster richColors closeButton position="top-right"/>
        <section className={`container min-w-full min-h-screen overflow-hidden`}>
          <HeaderPage />
              <label className='btn-menu mt-2 ml-4' htmlFor={menuCheckId}>
                <MenuIcon />
              </label>
              <input id={menuCheckId} type="checkbox" checked={menuChecked} onChange={handleMenuToggle} hidden />
              {menuChecked && <div className="overlay" onClick={handleMenuToggle}></div>}
          <aside ref={menuRef} className={`menu-list py-20 flex justify-center ${menuChecked ? 'open' : ''}`}>
            <ul className="space-y-2">
                <li className="text-white hover:bg-slate-100/10 transition duration-200 rounded p-2"><Link to="/">Inicio</Link></li>
                <li className="text-white hover:bg-slate-100/10 transition duration-200 rounded p-2"><Link to="/login">Login</Link></li>
                <li className="text-white hover:bg-slate-100/10 transition duration-200 rounded p-2"><Link to="/role">Role</Link></li>
                <li className="text-white hover:bg-slate-100/10 transition duration-200 rounded p-2"><Link to="/code">Code</Link></li>
                <li className="text-white hover:bg-slate-100/10 transition duration-200 rounded p-2"><Link to="/course-list">Courses</Link></li>
                <li className="text-white hover:bg-slate-100/10 transition duration-200 rounded p-2"><Link to="/course">Create Course</Link></li>
                <li className="text-white hover:bg-slate-100/10 transition duration-200 rounded p-2"><Link to="/grade-detail">Grade detail</Link></li>
                <li className="text-white hover:bg-slate-100/10 transition duration-200 rounded p-2"><Link to="/enrolled-student">Enrolled student</Link></li>
                <li className="text-white hover:bg-slate-100/10 transition duration-200 rounded p-2"><Link to="/student-enrolled-course-list">Student enrolled course list</Link></li>
                <li className="text-white hover:bg-slate-100/10 transition duration-200 rounded p-2"><Link to="/student-grade-report">Student grade report</Link></li>
            </ul>
          </aside>
          <main className={`bg-main p-6 ${menuChecked ? 'main-menu-open' : ''} p-16`}>
            {/*<BreadCrumb/>*/}
            <Routes>
              <Route path='/' element={<main/>} />
              <Route path='/login' element={<LoginForm/>} />
              <Route path='/role' element={<SelectRole/>} />
              <Route path='/code' element={<CreateCode/>}/>
              {/* Cambiar forma de pasar props usando useContext para los cursos */}
              <Route path='/course-list' element={<CourseList/>} />
              <Route path='/course' element={<CourseForm/>} />
              <Route path='/course/:id' element={<CourseForm/>} />
              <Route path='/evaluation-version-course/' element={<EvaluationVersionCourseForm/>} />
              <Route path='/scheduled-course/' element={<ScheduledCourse/>} />
              <Route path='course-list/activity/' element={<Activity/>} />
              <Route path='grade-detail' element={<ActivityRating/>} />
              <Route path='enrolled-student' element={<EnrolledStudent/>} />
              <Route path='enrolled-student-list' element={<EnrolledStudentList/>} />
              <Route path='student-enrolled-course-list' element={<StudentEnrolledCourseList/>} />
              <Route path='student-grade-report' element={<StudentGradeReport/>} />
              <Route path='evaluation-version-course-detail-view' element={<EvaluationVersionCourseDetailView/>} />
            </Routes>
          </main>
          <FooterPage />
      </section>
      </ScheduledCourseProvider>
    </VersionProvider>
  )
}

export default App;

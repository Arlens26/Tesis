
import './App.css';
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
import { CodeActivity } from './components/CodeActivity.jsx';

function App() {

  
  const menuCheckId = useId()
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
              <Route path='/code' element={<CodeActivity/>}/>
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

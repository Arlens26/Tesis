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
import { useUsers } from './auth/hooks/useUsers.js';
import { useRoleStore } from './auth/store/useRoleStore'
import { HomeIcon, LoginIcon, ProfileIcon, CourseLayoutIcon, CreateIcon, CodeIcon, StudentEnrolledIcon, StudentEnrolledListIcon, ReportAnaliticsIcon } from './components/Icons.jsx'

function App() {

  const { role } = useUsers()
  const isDirector = useRoleStore((state) => state.isDirector)

  const menuCheckId = useId()
  //const { courses, getCourse, deleteCourse } = useCourses();
  const menuRef = useRef(null)

  const isLoggedIn = role !== null

  return (
    <VersionProvider>
      <ScheduledCourseProvider>
        <Toaster richColors closeButton position="top-right"/>
        <div className="flex flex-col min-h-screen">
          <HeaderPage />
          <div className="flex flex-grow">
            {isLoggedIn && (
              <div className="group fixed left-0 top-0 h-full z-10">
                <aside 
                  ref={menuRef} 
                  className="h-full py-20 flex flex-col items-center transition-all duration-300 w-16 group-hover:w-72 overflow-hidden bg-gray-800"
                >
                  <ul className="space-y-2 w-full px-2">
                    <li className="text-white hover:bg-slate-100/10 transition duration-200 rounded p-2">
                      <Link to="/" className="flex items-center">
                        <span className="mr-0 group-hover:mr-2 transition-all duration-300">
                          <HomeIcon/>
                        </span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                          Inicio
                        </span>
                      </Link>
                    </li>
                    <li className="text-white hover:bg-slate-100/10 transition duration-200 rounded p-2">
                      <Link to="/login" className="flex items-center">
                        <span className="mr-0 group-hover:mr-2 transition-all duration-300">
                          <LoginIcon/>
                        </span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                          Login
                        </span>
                      </Link>
                    </li>
                    {isDirector && (
                      <>
                        <li className="text-white hover:bg-slate-100/10 transition duration-200 rounded p-2">
                          <Link to="/role" className="flex items-center">
                            <span className="mr-0 group-hover:mr-2 transition-all duration-300">
                              <ProfileIcon/>
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                              Perfil
                            </span>
                          </Link>
                        </li>
                        <li className="text-white hover:bg-slate-100/10 transition duration-200 rounded p-2">
                          <Link to="/code" className="flex items-center">
                            <span className="mr-0 group-hover:mr-2 transition-all duration-300">
                              <CodeIcon/>
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                              Código
                            </span>
                          </Link>
                        </li>                    
                      </>
                    )}
                    <li className="text-white hover:bg-slate-100/10 transition duration-200 rounded p-2">
                      <Link to="/course-list" className="flex items-center">
                        <span className="mr-0 group-hover:mr-2 transition-all duration-300">
                          <CourseLayoutIcon/>
                        </span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                          Cursos
                        </span>
                      </Link>
                    </li>
                    {isDirector && role === 'director' && (
                      <li className="text-white hover:bg-slate-100/10 transition duration-200 rounded p-2">
                        <Link to="/course" className="flex items-center">
                          <span className="mr-0 group-hover:mr-2 transition-all duration-300">
                            <CreateIcon/>
                          </span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                            Crear curso
                          </span>
                        </Link>
                      </li>
                    )}            
                    {role === 'professor' && (
                      <li className="text-white hover:bg-slate-100/10 transition duration-200 rounded p-2">
                        <Link to="/enrolled-student" className="flex items-center">
                          <span className="mr-0 group-hover:mr-2 transition-all duration-300">
                            <StudentEnrolledIcon/>
                          </span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                            Matrículas estudiantes
                          </span>
                        </Link>
                      </li>
                    )}
                    <li className="text-white hover:bg-slate-100/10 transition duration-200 rounded p-2">
                      <Link to="/student-enrolled-course-list" className="flex items-center">
                        <span className="mr-0 group-hover:mr-2 transition-all duration-300">
                          <StudentEnrolledListIcon/>
                        </span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                          Programación académica
                        </span>
                      </Link>
                    </li>
                    <li className="text-white hover:bg-slate-100/10 transition duration-200 rounded p-2">
                      <Link to="/student-grade-report" className="flex items-center">
                        <span className="mr-0 group-hover:mr-2 transition-all duration-300">
                          <ReportAnaliticsIcon/>
                        </span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                          Reporte calificaciones
                        </span>
                      </Link>
                    </li>
                  </ul>
                </aside>
              </div>
            )}
            <main className={`bg-main p-16 flex-grow transition-all duration-300 ${isLoggedIn ? 'ml-16 group-hover:ml-72' : 'ml-0'}`}>
              <Routes>
                <Route path='/' element={<LoginForm/>} />
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
          </div>
          <div className={`${isLoggedIn ? 'ml-16 group-hover:ml-72' : ''} transition-all duration-300`}>
            <FooterPage />
          </div>
        </div>
      </ScheduledCourseProvider>
    </VersionProvider>
  )
}

export default App;
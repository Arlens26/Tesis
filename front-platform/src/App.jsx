
import './App.css';
import MonacoEditorWrapper from './components/MonacoEditor';
import { LogoUnivalleIcon, MenuIcon } from './components/Icons';
import { useId, useState } from 'react';
import { FooterPage } from './pages/Footer.jsx';
import { HeaderPage } from './pages/Header.jsx';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { useCourses } from './hooks/useCourses.js';

function App() {

  const code = '// Agregue el código';
  const test = '// Código de prueba';
  const language = 'python';
  const theme = 'vs-dark';
  const size = 30
  const menuCheckId = useId();

  const [menuChecked, setMenuChecked] = useState(true);

  const handleMenuToggle = () => {
    setMenuChecked(!menuChecked);
    console.log(menuChecked)
  };

  const [components, setComponents] = useState([]);

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

  function Login() {
    return (
      <form className='flex justify-center'>
        <div className="flex flex-col items-center max-w-sm p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className='mb-4'>
              <LogoUnivalleIcon/>
            </div>
            <div className="mb-4">
              <input type="text" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nombre de usuario" required/>
            </div> 
            <div className="mb-4">
              <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Contraseña" required/>
            </div> 
            <div className='mb-4'>
              <button className='bg-primary opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100'>Entrar</button>
            </div>
            <div className='mb-4'>
              <span className='text-link cursor-pointer'><a>¿Olvidó su nombre de usuario o contraseña?</a></span>
            </div>
        </div>
      </form>
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

function CourseList() { 
  const { courses, deleteCourse } = useCourses()
  const [accordionStates, setAccordionStates] = useState({});

  const navigate = useNavigate()
  /*const params = useParams()
  console.log(params.id)*/

  const toggleAccordion = (id) => {
    setAccordionStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id] || false, // Si el estado no existe, lo inicializa como false
    }));
  };

  if (!courses) {
    return <p>Cargando cursos...</p>;
  }

  return (
    <>
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
                <button className='bg-primary opacity-80 rounded-sm py-1 px-1 hover:opacity-100'
                onClick={(e) => {
                  // Detener la propagación del evento para que no afecte al botón del acordeón
                  e.stopPropagation();
                  // Aquí va la lógica para eliminar el curso
                  deleteCourse(curso.id)
                  navigate('/courses')
                  //navigate(`/course/${curso.id}`)
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                </button>
                <span>{curso.name}</span>
              </div>
              <svg
                data-accordion-icon
                className={`w-3 h-3 rotate-${accordionStates[curso.id] ? '180' : '0'} shrink-0`}
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
              <span>La cantidad de créditos es: {curso.creditos}</span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function CourseForm() {

  const { createCourses } = useCourses()

  const handleSubmit = (event) => {
    event.preventDefault()
    const fields = Object.fromEntries(new window.FormData(event.target))
    createCourses(fields)
    console.log(fields)
  }

  return (
      <form className='form flex flex-col gap-4' onSubmit={handleSubmit}>
        <input name='name' type="text" placeholder='Nombre del curso' />
        <textarea name='description' rows="3" placeholder='Descripción' />
        <input name='creditos' type="number" />
        <button type='submit'>Guardar</button>
      </form>
  )
}

  return (
      <section className={`container ${menuChecked ? 'menu-open' : ''}, min-w-full`}>
        <HeaderPage />
            <label className='btn-menu' htmlFor={menuCheckId}>
              <MenuIcon />
            </label>
            <input id={menuCheckId} type="checkbox" checked={menuChecked} onChange={handleMenuToggle} hidden />
        <aside className='menu-list py-10 flex justify-center'>
          <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/code">Code</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/course-create">Create Course</Link></li>
          </ul>
        </aside>
        <main className='bg-main p-6'>
          <Routes>
            <Route path='/' element={<main/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/code' element={<CreateCode/>}/>
            <Route path='/courses' element={<CourseList/>} />
            <Route path='/course-create' element={<CourseForm/>} />
            <Route path='/course/:id' element={<CourseList/>} />
          </Routes>
        </main>
        <FooterPage />
      </section>
  )
}

export default App;

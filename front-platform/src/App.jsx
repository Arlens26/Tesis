
import './App.css';
import MonacoEditorWrapper from './components/MonacoEditor';
import { DeleteIcon, EditIcon, LogoUnivalleIcon, MenuIcon } from './components/Icons';
import { useEffect, useId, useState } from 'react';
import { FooterPage } from './pages/Footer.jsx';
import { HeaderPage } from './pages/Header.jsx';
import { Link, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
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
  const { courses, getCourse, deleteCourse } = useCourses()
  const [accordionStates, setAccordionStates] = useState({});

  const navigate = useNavigate()

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

  const handleCreateCourse = () => {
    navigate('/course')
  }

  const handleDeleteCourse = (courseId) => {
     deleteCourse(courseId)
     .then(() => {
       navigate('/course-list')
      }
     )
     .catch(error => console.log('Error al eliminar curso', error))
  }

  if (!courses) {
    return <p>No hay cursos creados...</p>;
  }

  return (
    <section>
      <div className='flex flex-col gap-2'>
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
                        e.stopPropagation()
                        handleEditCourse(curso.id)
                      }}>
                        <EditIcon />
                      </button>
                      <button className='bg-primary opacity-80 rounded-sm py-1 px-1 hover:opacity-100'
                      onClick={(e) => {
                        // Detener la propagación del evento para que no afecte al botón del acordeón
                        e.stopPropagation();
                        handleDeleteCourse(curso.id)
                      }}>
                        <DeleteIcon />
                      </button>
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
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Opciones
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Actividad
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Fecha
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Calificación
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Ejercicios
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            
                        </tbody>
                    </table>
                    <button className='bg-btn-create opacity-80 px-4 py-1 rounded-lg flex items-center hover:opacity-100 text-slate-100'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-plus h-6 w-6 mr-2" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 5l0 14" />
                            <path d="M5 12l14 0" />
                        </svg>
                        <span>Crear Actividad</span>
                    </button>
                  </div>
                </div>
              </div>
          ))}
      </div>
    </section>
  );
}

function CourseForm() {

  const { createCourse, updateCourse } = useCourses()
  const {id} = useParams()
  const paramsId = id
  const location = useLocation()
  const navigate = useNavigate()

  const [raList, setRaList] = useState([])
  const [percentage, setPercentage] = useState(0)
  const [totalPercentage, setTotalPercentage] = useState(0)

  useEffect(() => {
    const loadCourseData = () => {
      if (location.state && location.state.courseData) {
        const { name, code, description, credit, period } = location.state.courseData;
        document.querySelector('input[name="name"]').value = name;
        document.querySelector('input[name="code"]').value = code;
        document.querySelector('textarea[name="description"]').value = description;
        document.querySelector('input[name="credit"]').value = credit;
        // Llenar el select con el único periodo académico y deshabilitarlo
        const select = document.querySelector('select[name="period_id"]');
        const option = document.createElement('option');
        option.textContent = period;
        option.value = period; // Asigna el mismo valor que el texto del periodo
        option.selected = true; // Selección por defecto
        //select.disabled = true; // Deshabilita el select
        select.appendChild(option);
      }
    };

    loadCourseData();
  }, [location.state]);

  const handleSubmit = (event) => {

    event.preventDefault()
    const fields = Object.fromEntries(new window.FormData(event.target))

    if(paramsId) {
      updateCourse(paramsId, fields)
        .then(() => {
          console.log('Curso actualizado exitosamente');
          navigate('/course-list')
        })
        .catch((error) => {
          console.error('Error al actualizar curso:', error);
        });
    } else {
      createCourse(fields)
        .then(() => {
          console.log('Curso creado exitosamente');
        })
        .catch((error) => {
          console.error('Error al crear curso:', error);
        });
    }
  }

  const handleAddRa = () => {
    const nextNumber = raList.length + 1;
    const raName = `R.A.${nextNumber}`;
    if(percentage > 0 && totalPercentage + percentage <= 100){
      setRaList([...raList, { name:raName, percentage:`${percentage}%`}])
      setTotalPercentage(totalPercentage + percentage)
      setPercentage(0)
    }
  }

  const handleEditPercentage = (index, newPercentage) => {
    const updateRaList = [...raList]
    const diff = newPercentage - parseInt(updateRaList[index].percentage)
    if(!isNaN(newPercentage) && totalPercentage + diff <= 100 && newPercentage >= 1 && newPercentage <= 100){
      updateRaList[index].percentage = `${newPercentage}%`
      setRaList(updateRaList)
      setTotalPercentage(totalPercentage + diff)
    }
  }

  const handleDeleteRa = (index) => {
    const deletePercentage = parseInt(raList[index].percentage)
    const updateRaList = raList.filter((_, i) => i !== index)
    setRaList(updateRaList)
    setTotalPercentage(totalPercentage - deletePercentage)
  }

  return (
      <form className='form flex flex-col gap-4' onSubmit={handleSubmit}>
        <span>Creación cursos</span>
        <hr />
        <select id="countries" name='period_id' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option disabled>Periodo académico</option>
        </select> 
        <input type="text" placeholder='Nombre del curso' name='name' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
        <input type="text" placeholder='Código del curso' name='code' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
        <textarea placeholder='Descripción' name='description' rows="3" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
        <input type="number" placeholder='Créditos' name='credit' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
        <div className="flex flex-col gap-2">
          {!paramsId && (
              <div> 
                <span>Porcentaje de RA:</span>
                <input
                  type="number"
                  placeholder="Porcentaje"
                  min={0}
                  max={100}
                  value={percentage}
                  onChange={(e) => setPercentage(parseInt(e.target.value))}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <button type='button' onClick={handleAddRa} 
                  disabled={totalPercentage === 100 || percentage === 1}
                  className='bg-btn-create opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100'>Agregar RA</button>
                
              </div>
             )
          }
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                              <tr>
                                  <th scope="col" className="px-6 py-3">
                                      Nombre
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                      Porcentaje
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                      Acciones
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                            {raList.map((ra, index) => (
                                <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                  <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                      {ra.name}
                                  </td>
                                  <td className="px-6 py-4">
                                  <input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={parseInt(ra.percentage)}
                                    onChange={(e) => handleEditPercentage(index, parseInt(e.target.value))}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  />
                                  </td>
                                  <td className="flex items-center gap-1">
                                    <button type='button' 
                                    onClick={ () => handleDeleteRa(index)}
                                    className='bg-primary opacity-80 rounded-sm py-1 px-1 hover:opacity-100'>
                                      <DeleteIcon />
                                    </button>
                                  </td>
                                </tr>
                            ))}
                            <tr key={`totalPercentageRa`} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                      Total Porcentaje
                                  </th>
                                  <td className="px-6 py-4">
                                      {`${totalPercentage}%`}
                                  </td>
                                  <td className="px-6 py-4">

                                  </td>
                                </tr>
                          </tbody>
          </table>
        </div>
        <button type='submit' className='bg-btn-create opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100'>{paramsId ? 'Actualizar':'Guardar'}</button>
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
              <li><Link to="/course-list">Courses</Link></li>
              <li><Link to="/course">Create Course</Link></li>
          </ul>
        </aside>
        <main className='bg-main p-6'>
          <Routes>
            <Route path='/' element={<main/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/code' element={<CreateCode/>}/>
            <Route path='/course-list' element={<CourseList/>} />
            <Route path='/course' element={<CourseForm/>} />
            <Route path='/course/:id' element={<CourseForm/>} />
          </Routes>
        </main>
        <FooterPage />
      </section>
  )
}

export default App;

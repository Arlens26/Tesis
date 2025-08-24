import { useState } from "react"
import MonacoEditorWrapper from "./MonacoEditor"
import { CreateIcon, DeleteIcon, SaveIcon } from "./Icons"

export function CodeActivity() {

    const code = '// Agregue el código'
    const test = '// Código de prueba'
    const language = 'python'
    const theme = 'vs-dark'
    const size = 30

    const [components, setComponents] = useState([])

  const agregarComponente = () => {
    setComponents([...components, <Card key={components.length} />])
    console.log(components)
  } 

  function Card() {
      const [score, setScore] = useState(1)

      const handleDecrement = () => {
        console.log('Decrement Score : '+score)
        const newValue = score > 1 ? score - 1 : 1
        setScore(newValue); 
        console.log('Decrement: '+newValue)
      }

      const handleIncrement = () => {
        console.log('Increment Score : '+score)
        const newValue = score < 5 ? score + 1 : 5
        setScore(newValue)
        console.log('Increment: '+newValue)
      }

      const handleChange = (e) => {
        const inputValue = parseInt(e.target.value, 10)

        if(!isNaN(inputValue) && inputValue >=1 && inputValue <= 5){
          setScore(inputValue)
          console.log('Input Value: '+score)
        } else{
          setScore(score)
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

    const [selectedTheme, setSelectedTheme] = useState('') 

    const handleChange = (e) => {
      setSelectedTheme(e.target.value) 
    } 

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
              <button className='bg-btn-create opacity-80 w-fit px-4 py-1 rounded-lg hover:opacity-100 flex items-center text-slate-100' onClick={agregarComponente}>
                <CreateIcon/>
                <span className="ml-1">Agregar pregunta</span>
              </button>
              <div className="flex justify-end items-center">
                <button className='bg-primary opacity-80 w-fit px-4 py-1 rounded-lg hover:opacity-100 flex items-center text-slate-100'>
                    <DeleteIcon/>
                    <span className="ml-1">Eliminar pregunta</span>
                </button>
              </div>
          </div>
          {components.map((component, index) => (
            <div key={index}>
              <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'><strong>Pregunta {index + 1}:</strong></label>
              {component}
              </div>
          ))}
        </div>
        <div className="flex justify-end items-center">
            <button className='bg-btn-create opacity-80 w-fit px-4 py-1 rounded-lg hover:opacity-100 flex items-center text-slate-100'>
                <SaveIcon/>
                <span className="ml-1">Guardar</span>
            </button>
        </div>
      </>
    )
    
}
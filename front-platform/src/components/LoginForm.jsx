import { useUsers } from '../hooks/useUsers'
import { LogoUnivalleIcon} from './Icons'
import { useNavigate } from "react-router-dom"
import { toast } from 'sonner'

export function LoginForm() {

    const { getLogin, setRole } = useUsers()
    const navigate = useNavigate()

    const handleSubmit = (event) => {
  
        event.preventDefault()
        const fields = Object.fromEntries(new window.FormData(event.target))
        getLogin(fields)
        .then((profile) => {
            console.log(profile)
            toast.success('Usuario logueado exitosamente')
            if (profile.is_director && profile.is_professor) {
                setRole('director')
                navigate('/role')
            } 
            else if (profile.is_professor && !profile.is_director && !profile.is_student){
                setRole('professor')
                navigate('/course-list')
            }
            else if (profile.is_student){ 
                setRole('student')
                navigate('/course-list')
            }
            else{
                console.log('No se reconoce el rol')
            }
          })
          .catch((error) => {
            toast.error('Usurio o contraseña incorrecta', error)
        })

    }

    return (
      <form className='flex justify-center' onSubmit={handleSubmit}>
        <div className="flex flex-col items-center max-w-sm p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className='mb-4'>
              <LogoUnivalleIcon/>
            </div>
            <div className="mb-4">
              <input type="text" id="username" name='username' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nombre de usuario" required/>
            </div> 
            <div className="mb-4">
              <input type="password" name='password' id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Contraseña" required/>
            </div> 
            <div className='mb-4'>
              <button type='submit' className='bg-primary opacity-80 px-20 py-1 rounded-lg hover:opacity-100 text-slate-100'>Entrar</button>
            </div>
            <div className='mb-4'>
              <span className='text-link cursor-pointer'><a>¿Olvidó su nombre de usuario o contraseña?</a></span>
            </div>
        </div>
      </form>
    )
  }
import { LogoUnivalleIcon} from './Icons';

export function LoginForm() {
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
import { useNavigate } from "react-router-dom"
import { useUsers } from "../auth/hooks/useUsers"
import { LogoutIcon } from "../components/Icons"
import logo from '../images/logo-univalle.png'
import { toast } from 'sonner'

export function HeaderPage() {
  const { user, role, logout } = useUsers()
  const navigate = useNavigate()

  const handleLogout = () => {
    const userName = user ? user.first_name : 'usuario'
    logout()
        .then(() => {
            toast.success(`Sesión cerrada exitosamente del usuario: ${userName}`)
            navigate('/login')
        })
        .catch(error => {
            toast.error('Error al cerrar sesión', error)
        })
  }
  
    return (
        <header className='bg-white shadow-md p-4 sm:px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center w-full'>     
          <nav className="grid grid-cols-6 gap-4">
            <div className='flex items-center ml-8 mb-8'>
              <img className='logo-img h-auto max-w-[160px] max-h-8' src={logo} alt="logo_univalle" />
            </div>
            <div className="col-end-7 col-span-2 xs:col-end-7 xs:col-span-3 flex justify-end items-center mb-8">
                {role ? 
                  <>
                    <span>Bienvenido, {user.first_name} {user.last_name} {' '} - {' '}
                      <span className="text-primary">{role}</span>
                    </span>
                    <button className="ml-1" onClick={handleLogout}>
                      <LogoutIcon/>
                    </button>
                   </>
                   : 
                      <span>Bienvenido</span>
                    }
            </div>
          </nav>
        </header>
    )
}
import { useUsers } from "../auth/hooks/useUsers"
import { LogoutIcon } from "../components/Icons"
import logo from '../images/logo-univalle.png'

export function HeaderPage() {
  const { user, role } = useUsers()
  //const { profile } = user;
    return (
        <header className='mr-14'>     
          <nav className="grid grid-cols-6 gap-4">
            <div className='logo-container col-start-1 col-end-3'>
              <img className='logo-img' src={logo} alt="logo_univalle" />
            </div>
            <div className="col-end-7 col-span-2 flex justify-end items-center">
              <span>{user ? <span>Bienvenido, {user.first_name} {user.last_name} {' '} - {' '}
                <span className="text-primary">{role}</span> 
                {/*profile && (
                  <>
                    {profile.is_professor && <span>Profesor</span>}
                    {profile.is_director && <span>Director</span>}
                    {profile.is_student && <span>Estudiante</span>}
                  </>
                )*/}</span> : <span>Bienvenido</span>} </span>
                <button className="ml-1">
                  <LogoutIcon/>
                </button>
            </div>
          </nav>
        </header>
    )
}
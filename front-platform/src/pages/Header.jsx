import { useUsers } from "../auth/hooks/useUsers"

export function HeaderPage() {
  const { user, role } = useUsers()
  const { profile } = user;
    return (
        <header className=''>     
          <nav className="grid grid-cols-6 gap-4">
            <div className='logo-container col-start-1 col-end-3'>
              <img className='logo-img' src="src/images/logo-univalle.png" alt="logo_univalle" />
            </div>
            <div className="col-end-7 col-span-2">
              <span>{user ? <span>Rol: {role} Bienvenido, {user.first_name} {user.last_name}.{' '}
                {profile && (
                  <>
                    {profile.is_professor && <span>Profesor</span>}
                    {profile.is_director && <span>Director</span>}
                    {profile.is_student && <span>Estudiante</span>}
                  </>
                )}</span> : <span>Bienvenido</span>} </span>
            </div>
          </nav>
        </header>
    )
}
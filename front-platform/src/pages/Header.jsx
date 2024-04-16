import { useUsers } from "../hooks/useUsers"

export function HeaderPage() {
  const { user } = useUsers()
    return (
        <header className=''>     
          <nav className="grid grid-cols-6 gap-4">
            <div className='logo-container col-start-1 col-end-3'>
              <img className='logo-img' src="src/images/logo-univalle.png" alt="logo_univalle" />
            </div>
            <div className="col-end-7 col-span-2">
              <span>{user ? <span>Bienvenido, {user.username}</span> : <span>Bienvenido</span>} </span>
            </div>
          </nav>
        </header>
    )
}
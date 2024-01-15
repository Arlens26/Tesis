import { LogoUnivalleIcon } from "../components/Icons"

export function FooterPage() {
    return (
      <>
        <footer>
          <div className='logo'>
            <LogoUnivalleIcon />
          </div>
          <div className='info'>
            <h5>
              UNIVERSIDAD DEL VALLE
            </h5>
            <ul>
              <li>Cali - Colombia</li>
              <li>© 1994 - 2024</li>
            </ul>
          </div>
          <div className='info'>
            <h5>
              Dirección:
            </h5>
            <ul>
              <li>Ciudad Universitaria Meléndez</li>
              <li>Calle 13 # 100-00</li>
              <br></br>
              <li>Sede San Fernando</li>
              <li>Calle 4B N° 36-00</li>
            </ul>
          </div>
          <div className='info'>
            <h5>Redes Sociales</h5>
          </div>
        </footer>
      </>
    )
  }
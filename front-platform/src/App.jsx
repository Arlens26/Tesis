
import './App.css';
import MonacoEditorWrapper from './components/MonacoEditor';
import { LogoUnivalleIcon, MenuIcon } from './components/Icons';
import { useId, useState } from 'react';

function App() {

  const code = 'print("Hola, Mundo!")';
  const language = 'python';
  const theme = 'vs-dark';
  const size = 30
  const menuCheckId = useId();

  const [menuChecked, setMenuChecked] = useState(true);

  const handleMenuToggle = () => {
    setMenuChecked(!menuChecked);
    console.log(menuChecked)
  };

  return (
      <section className={`container ${menuChecked ? 'menu-open' : ''}`}>
        <header className='menu'>     
          <nav>
            <div className='logo-container'>
              <img className='logo-img' src="src/images/logo-univalle.png" alt="logo_univalle" />
            </div>
          </nav>
        </header>
            <label className='btn-menu' htmlFor={menuCheckId}>
              <MenuIcon />
            </label>
            <input id={menuCheckId} type="checkbox" checked={menuChecked} onChange={handleMenuToggle} hidden />
        <aside className='menu-list'>
          <ul>
              <li><a href="">Inicio</a></li>
              <li><a href="">Login</a></li>
          </ul>
        </aside>
        <main>
          <button>Agregar código</button>
          <div>
          <MonacoEditorWrapper code={code} language={language} theme={theme} size={size} />
          </div>
        </main>
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
      </section>
  )
}

export default App;

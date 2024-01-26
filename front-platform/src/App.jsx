
import './App.css';
import MonacoEditorWrapper from './components/MonacoEditor';
import { LogoUnivalleIcon, MenuIcon } from './components/Icons';
import { useId, useState } from 'react';
import { FooterPage } from './pages/Footer.jsx';
import { HeaderPage } from './pages/Header.jsx';
import { Link, Routes, Route } from 'react-router-dom';

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

  const [components, setComponents] = useState([]);

  const agregarComponente = () => {
    setComponents([...components, <Card key={components.length} />]);
    console.log(components)
  } 

  function Card() {
    return (
      <>
        <label className=''>Se agrego componente</label>
      </>
    )
  }

  function Login() {
    return (
      <form className='login-form'>
        <label>Login</label>
        <LogoUnivalleIcon/>
        <input type="text" placeholder='Nombre de usurio' />
        <input type="password" placeholder='Contraseña'/>
        <button>Entrar</button>
        <span className='recovery-password'><a>¿Olvidó su nombre de usuario o contraseña?</a></span>
      </form>
    )
  }
   
  function CreateCode() {
    return(
      <>
        <button onClick={agregarComponente}>Agregar Texto</button>
        {components.map((component, index) => (
          <div key={index}>{component}</div>
        ))}
        <div>
          <MonacoEditorWrapper code={code} language={language} theme={theme} size={size} />
        </div>
      </>
    )
  }

  return (
      <section className={`container ${menuChecked ? 'menu-open' : ''}`}>
        <HeaderPage />
            <label className='btn-menu' htmlFor={menuCheckId}>
              <MenuIcon />
            </label>
            <input id={menuCheckId} type="checkbox" checked={menuChecked} onChange={handleMenuToggle} hidden />
        <aside className='menu-list'>
          <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/code">Code</Link></li>
          </ul>
        </aside>
        <main>
          <Routes>
            <Route path='/login' element={<Login/>} />
            <Route path='/code' element={<CreateCode/>}/>
          </Routes>
        </main>
        <FooterPage />
      </section>
  )
}

export default App;

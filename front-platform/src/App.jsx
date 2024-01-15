
import './App.css';
import MonacoEditorWrapper from './components/MonacoEditor';
import { MenuIcon } from './components/Icons';
import { useId, useState } from 'react';
import { FooterPage } from './pages/Footer.jsx';
import { HeaderPage } from './pages/Header.jsx';

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
        <HeaderPage />
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
        <FooterPage />
      </section>
  )
}

export default App;

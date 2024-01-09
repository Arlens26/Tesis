
import './App.css';
import MonacoEditorWrapper from './components/MonacoEditor';

function App() {

  const code = 'print("Hola, Mundo!")';
  const language = 'python';
  const theme = 'vs-dark';
  const size = 30

  return (
      <section className='container'>
        <header className=''>Header</header>
        <MonacoEditorWrapper code={code} language={language} theme={theme} size={size} />
      </section>
  )
}

export default App;

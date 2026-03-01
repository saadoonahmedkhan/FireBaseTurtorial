import './App.css'
import Auth from './components/auth';
import Movies from './components/movies';
function App() {
  return (
    <>
      <p className=" text-3xl font-bold text-center text-red-600">
        Vite + React + Tailwind CSS is working!
      </p>
      <Auth/>
      <Movies/>
    </>
  )
}

export default App

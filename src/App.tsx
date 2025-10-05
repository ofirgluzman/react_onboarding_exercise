import { Outlet } from 'react-router-dom'
import './App.css'
import AppTopHeader from './components/AppTopHeader'

function App() {
  return (
    <div className="app">
      <AppTopHeader />
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default App

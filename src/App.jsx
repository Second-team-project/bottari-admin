import './App.css';
import { Outlet } from 'react-router-dom';
import Menu from './components/common/Menu';

function App() {
  return (
    <>
      <div className="app-container">
        <Menu />
        <Outlet />
      </div>
    </>
  )
}

export default App;

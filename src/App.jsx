import './App.css';
import { Outlet, useLocation } from 'react-router-dom';
import Menu from './components/common/Menu';
import Header from './components/common/Header.jsx';

function App() {
  const location = useLocation();

  // 로그인 페이지인지 체크
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      <div className={isLoginPage ? "app-login-container" : "app-container"}>
        <Menu />
        {isLoginPage ? (
            <Outlet />
        ) : (
            <div>
              <Header />
              <Outlet />
            </div>
        )}
      </div>
    </>
  )
}

export default App;

import BottariLogo2 from '../logo/BottariLogo2.jsx';
import './Login.css';

export default function Login() {
  return(
    <>
      <div className='login-all-container'>
        {/* 헤더 */}
        <div className='login-header-container'>
          <BottariLogo2 width={150} height={95} />
          <p className='login-header-title'>관리자 로그인</p>
        </div>
        
        {/* 로그인 */}
        <form className='login-container'>
          <input type="text" className='login-input' placeholder='아이디' />
          <input type="password" className='login-input' placeholder='패스워드' />
          <button type='submit' className='login-btn'>로그인</button>
        </form>
      </div>
    </>
  )
}
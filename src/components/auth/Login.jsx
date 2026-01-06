import { useDispatch } from 'react-redux';
import BottariLogo2 from '../logo/BottariLogo2.jsx';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { loginThunk } from '../../store/thunks/authThunk.js';
import { useState } from 'react';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    accountId: '',
    password: '',
  });

  function handleChange(e) {
    const { value } = e.target;
    setLoginData({
      ...loginData,
      [e.target.name]: value
    });
  };

  // 로그인 요청
  async function handleSubmit(e) {
    e.preventDefault();

    if (!loginData.accountId || !loginData.password) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      await dispatch(loginThunk(loginData)).unwrap();
      
      // 로그인 성공 시 모니터링 이동
      return navigate('/monitoring', { replace: true }); 
    } catch (error) {
      // 백엔드에서 보낸 에러 메시지 처리 (customError의 message)
      const errorMsg = error.response?.data?.message || '로그인에 실패했습니다.';
      alert(errorMsg);
    }
  };

  return(
    <>
      <div className='login-all-container'>
        {/* 헤더 */}
        <div className='login-header-container'>
          <BottariLogo2 width={150} height={95} />
          <p className='login-header-title'>관리자 로그인</p>
        </div>
        
        {/* 로그인 */}
        <form className='login-container' onSubmit={handleSubmit}>
          <input type="text" name="accountId" className='login-input' placeholder='아이디' value={loginData.accountId} onChange={handleChange}/>
          <input type="password" name="password" className='login-input' placeholder='패스워드' value={loginData.password}
            onChange={handleChange}/>
          <button type='submit' className='login-btn'>로그인</button>
        </form>
      </div>
    </>
  )
}
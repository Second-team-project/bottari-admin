const swRegister = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js", { scope: '/',
        // 개발 모드일 때는 'module', 배포(build) 후에는 'classic'으로 설정
        type: isDev ? 'module' : 'classic'
       }) // 루트에 설치되는 이유는 dist에 등록되기 때문, scope = 커버 범위
      .then((registration) => {
        console.log("서비스워커 등록 성공", registration);
      })
      .catch((error) => {
        console.error("서비스워커 등록 실패: ", error);
      });
  }
}

export default swRegister;
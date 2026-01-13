import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

const PREFIX = import.meta.env.VITE_APP_NAME;

// -------------------------
// 정적 파일 캐싱
// -------------------------
precacheAndRoute(self.__WB_MANIFEST);

// -------------------------
// HTML 오프라인 대응
// -------------------------
registerRoute(
  ({request}) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: `${PREFIX}-html-cache`,
    networkTimeoutSeconds: 3,
  })
);
// -------------------------
// 이미지 캐싱 <= 유저들이 사용한 이미지
// -------------------------
registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({
    cacheName: `${PREFIX}-image-cache`,
    networkTimeoutSeconds: 3,
  })
);

// -------------------------
// API 요청 캐싱(최소 동작 보장을 위함, GET을 제외한 메소드에서는 제외)
// -------------------------
registerRoute(
  ({request, url}) => url.origin === import.meta.env.VITE_SERVER_URL && request.method === 'GET',
  new StaleWhileRevalidate({
    cacheName: `${PREFIX}-api-cache`,
    networkTimeoutSeconds: 3,
  })
);

// -------------------------
// 웹 푸시 핸들러
// -------------------------
self.addEventListener('push', e => {
  const data = e.data.json();

  self.registration.showNotification(
    data.title,
    {
      body: data.message,
      icon: '/icons/bottari-icon-32.png',
      data: {
        targetUrl: data.data.targetUrl
      }
    }
  );
});

// -------------------------
// 웹 푸시 클릭 이벤트
// -------------------------
self.addEventListener('notificationclick', e => {
  e.notification.close(); // 푸시 알림창 닫기

  // 페이로드에서 백엔드가 전달해준 전체 URL 추출(e에 핸들러의 data가 담김)
  const openUrl = e.notification.data.targetUrl;

  // Origin 획득
  const origin = self.location.origin;
  
  e.waitUntil(
    // clients의 구조
    // [
      //   WindowClient = {
        //     focused: false,
        //     frameType: "top-level",
        //     id: "f6e4c645-16ba-4ebe-9600-443b91141742",
        //     type: "window",
        //     url: "http://localhost:3000/posts",
        //     visibilityState: "visible"
        //   },
        //   // ...
        // ]
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }) // <= window는 브라탭저의 탭 / includeUnconstrolled : 서비스워커가 제어하고 있는지(true면 서비스워커가 제어 안 하고 있는 페이지도 포함)
    .then(clients => {
      // 앱에서 루트 도메인 탭이 있는지 확인
      const myClient = clients.find(client => client.url.startsWith(origin));

      // 재활용할 탭이 있다면 포커스 및 네비게이트 처리
      if(myClient) {
        myClient.focus();
        return myClient.navigate(openUrl);
      }
      // 재활용할 탭이 없다면 새 창으로 열기
      if(self.clients.openWindow) { // 브라우저가 열려있을 때
        return self.clients.openWindow(openUrl);
      }
    })
  );
})
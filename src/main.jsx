import './index.css';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import store from './store/store.js';
import Router from './routes/Route.jsx';
import { injectStoreInAxios } from './api/axiosInstance.js';
import swRegister from './swRegister.js';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router />
  </Provider>,
)

injectStoreInAxios(store);

// 서비스 워커 등록
swRegister();
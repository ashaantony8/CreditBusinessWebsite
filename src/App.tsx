import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import AppRoute from './routes/AppRoute';
import store from './store';

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AppRoute />
        <ToastContainer />
      </Provider>
    </BrowserRouter>
  );
}

export default App;

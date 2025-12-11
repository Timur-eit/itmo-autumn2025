import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { Layout } from './components/Layout/Layout';
import { PassengersPage } from './pages/Passengers/PassengersPage';
import './styles/globals.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Theme preset={presetGpnDefault}>
      <Layout>
        <PassengersPage />
      </Layout>
    </Theme>
  </Provider>,
);

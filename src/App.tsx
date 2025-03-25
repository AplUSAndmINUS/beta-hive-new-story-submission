import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './stores/store';
import { storyRoutes } from './routes/routes';
import Menu from './components/menu/menu';
import ProgressBar from './components/progress-bar/progress-bar';

import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'src/styles/_app.scss';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className='App-Main'>
          <Menu routes={storyRoutes} />
          <ProgressBar />
          <Routes>
            {storyRoutes.map((route, index: number) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;

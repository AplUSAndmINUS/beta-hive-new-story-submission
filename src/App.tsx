import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './stores/store';
import { storyRoutes } from './routes/routes';
import Menu from './components/menu/menu';
import ProgressBar from './components/progress-bar/progress-bar';
import { externalResources } from './config/resources';

import 'src/styles/_app.scss';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadResources = async () => {
      try {
        // Load all resources
        await Promise.all(
          externalResources.map((resource) => {
            return new Promise((resolve, reject) => {
              const element = document.createElement(resource.type);
              Object.entries(resource).forEach(([key, value]) => {
                if (key !== 'type') {
                  element.setAttribute(key, value);
                }
              });

              if (resource.type === 'script') {
                element.onload = resolve;
                element.onerror = reject;
              } else {
                element.onload = resolve;
                element.onerror = reject;
              }

              document.head.appendChild(element);
            });
          })
        );

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading resources:', error);
        // Still set loading to false to prevent infinite loading
        setIsLoading(false);
      }
    };

    loadResources();

    // Cleanup function
    return () => {
      const elements = document.head.querySelectorAll(
        'link[href*="bootstrap"], link[href*="font-awesome"], script[src*="bootstrap"]'
      );
      elements.forEach((element) => element.remove());
    };
  }, []);

  if (isLoading) {
    return (
      <div className='loading-screen'>
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

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

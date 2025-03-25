import { useNavigate } from 'react-router-dom';

import { Routes, storyRoutes } from 'src/routes/routes';

const useNavigation = () => {
  const navigate = useNavigate();

  const handleNavigation = (name: string) => {
    const route = storyRoutes.find((route: Routes) => route.name === name);

    if (!route) {
      throw new Error(`Route with name ${name} not found`);
    }

    if (route && route.path) {
      navigate(route.path);
    }
  };

  return handleNavigation;
};

export default useNavigation;

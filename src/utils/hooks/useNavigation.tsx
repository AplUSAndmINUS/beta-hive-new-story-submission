import { useNavigate } from 'react-router-dom';

import { adminRoutes } from 'src/routes/admin-routes';
import { Routes } from 'src/services/models/routes.types';

const useNavigation = () => {
  const navigate = useNavigate();

  const handleNavigation = (name: string) => {
    const route = adminRoutes.find((route: Routes) => route.name === name);

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

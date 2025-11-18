import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';

const ProtectedRoute = () => {
  const location = useLocation();
  const { carregando, user } = useAuth();
  const { inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  
  const isLoggedIn = isAuthenticated && user !== null;
  // console.log(isLoggedIn, isAuthenticated, user );
  // console.log(inProgress, carregando);
  // Enquanto os dados estiverem carregando
  if (inProgress !== 'none' || carregando) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        Carregando autenticação...
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para a página de login
  if (!isLoggedIn) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Se autenticado, renderiza as rotas protegidas
  return <Outlet />;
};

export default ProtectedRoute;

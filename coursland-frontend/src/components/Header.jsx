import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserService from '../api/UserService';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(UserService.isAuthenticated());
  const [isAdmin, setIsAdmin] = useState(UserService.isAdmin());
  const location = useLocation();

  const handleLogout = () => {
    UserService.logout();
    setIsAuthenticated(false); 
  };

  useEffect(() => {
    setIsAuthenticated(UserService.isAuthenticated());
    setIsAdmin(UserService.isAdmin());

    if ((location.pathname === '/login' || location.pathname === '/registro' || location.pathname === '/') && isAuthenticated) {
      handleLogout();
    }
  }, [location.pathname, isAuthenticated]); 

  return (
    <>
      <header className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
          {isAuthenticated && (
            <>
              <Link className="navbar-brand" to="/">Coursland - Plataforma de Cursos</Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to="/">Inicio</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/crearcurso">Añadir Curso</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/chatroom">Chatroom</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/cursos">Cursos</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/perfil">Perfil</Link>
                  </li>
                  {isAdmin && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/adminpanel">AdminPanel</Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <Link className="nav-link" to="/" onClick={handleLogout}>Cerrar sesión</Link>
                  </li>
                </ul>
              </div>
            </>
          )}
          {!isAuthenticated && (
            <Link className="navbar-brand" to="/">Coursland - Plataforma de Cursos</Link>
          )}
        </div>
      </header>
      <div style={{ marginTop: '50px' }}>
      </div>
    </>
  );
};

export default Header;

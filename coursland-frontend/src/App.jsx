import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import Cursos from './pages/cursos/Cursos';
import PerfilPage from './pages/users/PerfilPage';
import AdminPanel from './pages/admin/AdminPanel';
import CrearCursoForm from './pages/cursos/CrearCursoForm';
import ActualizarCurso from './pages/cursos/ActualizarCurso';
import GestionUsuarios from './pages/admin/GestionUsuarios';
import GestionCursos from './pages/admin/GestionCursos';
import Recursos from './pages/cursos/Recursos'; 
import ChatRoom from './pages/chat/ChatRoom';
import Chat from './pages/chat/Chat';
import backgroundImage from './assets/background4.png';
import MisCursos from './pages/cursos/MisCursos';
import ActualizarPerfil from './pages/users/ActualizarPerfil';


const App = () => {
  return (
    <Router>
      <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', minHeight: '90vh',marginBottom: '50px'  }}>
        <Header />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistrationPage />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/crearcurso" element={<CrearCursoForm />} />
          <Route path="/adminpanel" element={<AdminPanel />} />
          <Route path="/gestionusuarios" element={<GestionUsuarios />} />
          <Route path="/gestioncursos" element={<GestionCursos />} />
          <Route path="/recursos/:cursoId" element={<Recursos />} />
          <Route path="/chatroom" element={<ChatRoom />} />
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/miscursos" element={<MisCursos />} />
          <Route path="/actualizarcurso/:cursoId" element={<ActualizarCurso />} />
          <Route path="/actualizarperfil" element={<ActualizarPerfil />} />
          {/* Redirige a la página de Inicio para todas las rutas no definidas */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes> 
        <Footer />
      </div>
    </Router>
  );
};

export default App;

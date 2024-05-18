import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/courslandre.png';

const Inicio = () => {
  return (
    <div className="container text-center mt-5">
      <img src={logo} alt="Coursland Logo" className="mb-4" style={{ maxWidth: '400px' }} />
      <p className="lead mb-4" style={{ fontSize: '24px', color: '#fff', textShadow: '2px 2px 2px rgba(0, 0, 0, 1.0)' }}>La mejor plataforma de cursos en línea</p>
      <Link to="/registro" className="btn btn-dark btn-lg" style={{ backgroundColor: '#da773e' }}>Comenzar</Link>
    </div>
  );
};

export default Inicio;

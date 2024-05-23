import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CursoService from '../../api/CursoService';
import UserService from '../../api/UserService';
import logo from '../../assets/courslandre.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('titulo');
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!UserService.isAuthenticated()) {
          navigate('/login');
          return; 
        }
        const token = localStorage.getItem('token'); 
        const cursosData = await CursoService.listarCursos(token); 
        setCursos(cursosData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [navigate]); 

  const filteredCursos = cursos.filter(curso => {
    if (!searchTerm) {
      return true; // Si no se escribe nada en el campo de búsqueda, muestra todos los cursos
    } else if (searchType === 'titulo') {
      return curso.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchType === 'dificultad') {
      return curso.dificultad.toString() === searchTerm; 
    } else if (searchType === 'categoria') {
      return curso.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCursos = filteredCursos.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <br />
      <h2 className="text-center mt-4 mb-4" style={{ color: 'white', textShadow: '2px 2px 2px rgba(0, 0, 0, 1.0)' }}>Cursos Disponibles</h2>
      <div className="row mb-3">
        <div className="col-md-4">
          <input 
            type="text" 
            className="form-control" 
            placeholder={searchType === 'dificultad' ? 'Buscar por Dificultad (1-5)' : 'Buscar...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select 
            className="form-select" 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="titulo">Buscar por Título</option>
            <option value="dificultad">Buscar por Dificultad</option>
            <option value="categoria">Buscar por Categoría</option>
          </select>
        </div>
      </div>
      <div className="row">
        {currentCursos.length === 0 ? (
          <div className="col-12 text-center">
            <br /><br />
            <h3 style={{ color: 'white', textShadow: '2px 2px 2px rgba(0, 0, 0, 1.0)' }}>No hay cursos disponibles actualmente.</h3>
          </div>
        ) : (
          currentCursos.map(curso => (
            <div key={curso.idCurso} className="col-md-3">
              <div className="card mb-4" style={{ marginBottom: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <img src={logo} className="card-img-top" alt="Imagen del curso" style={{ width: '100%', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }} />
                <div className="card-body bg-dark" style={{ padding: '20px', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px' }}>
                  <h5 className="card-title" style={{ color: 'white', fontSize: '20px', marginBottom: '10px' }}>{curso.titulo}</h5>
                  <p className="card-text" style={{ color: 'white' }}>
                    Dificultad: {' '}
                    {[...Array(curso.dificultad)].map((_, index) => (
                      <FontAwesomeIcon icon={solidStar} key={index} style={{ color: '#f7ce3e' }} />
                    ))}
                  </p>
                  <p className="card-text" style={{ color: 'white' }}>Categoría: {curso.categoria}</p>
                  <p className="card-text" style={{ color: 'white' }}>Hecho por: {curso.creador.email}</p>
                  <Link to={`/recursos/${curso.idCurso}`} className="btn btn-primary" style={{ backgroundColor: '#da773e', border: 'none' }}>Ver recursos</Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {filteredCursos.length > 0 && (
        <div className="d-flex justify-content-between mt-4">
          <button 
            className="btn btn-primary" 
            style={{ backgroundColor: '#da773e', border: 'none' }}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button 
            className="btn btn-primary" 
            style={{ backgroundColor: '#da773e', border: 'none' }}
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastCourse >= filteredCursos.length}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Cursos;

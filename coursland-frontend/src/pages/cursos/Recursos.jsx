import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CursoService from '../../api/CursoService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faFile as regularFile } from '@fortawesome/free-regular-svg-icons';

const Recursos = () => {
  const { cursoId } = useParams(); 
  const [curso, setCurso] = useState(null);

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const cursoData = await CursoService.obtenerCursoPorId(cursoId);
        setCurso(cursoData);
      } catch (error) {
        console.error('Error al obtener el curso:', error);
      }
    };

    fetchCurso();
  }, [cursoId]);

  return (
    <div className="container">
      <br />
      <h2 className="text-center mt-4 mb-4" style={{ color: 'white', textShadow: '2px 2px 2px rgba(0, 0, 0, 1.0)' }}>Recursos del Curso</h2>
      {curso ? (
        <div className="jumbotron bg-dark" style={{ color: 'white', padding: '40px', borderRadius: '15px' }}>
          <h1 className="display-3" style={{ color: 'white' }}>{curso.titulo}</h1>
          <p className="lead" style={{ color: 'white' }}>{curso.descripcion}</p>
          <p className="lead" style={{ color: 'white' }}>Categoría: {curso.categoria}</p>
          <p className="lead" style={{ color: 'white' }}>Dificultad: {getDifficultyStars(curso.dificultad)}</p>
          <hr className="my-4" />
          <h4 style={{ color: 'white' }}>Enlaces:</h4>
          <ul>
            {curso.enlaces.map((enlace, index) => (
              <li key={index}>
                <a href={enlace} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>{enlace}</a>
              </li>
            ))}
          </ul>
          <h4 style={{ color: 'white' }}>Archivos Adjuntos:</h4>
          <ul>
            {curso.archivosAdjuntos && curso.archivosAdjuntos.map((archivo, index) => (
              <li key={index}>
                <a href={archivo} target="_blank" rel="noopener noreferrer" download={archivo} style={{ textDecoration: 'none', color: 'white' }}>
                  <FontAwesomeIcon icon={regularFile} style={{ marginRight: '5px', color: 'white' }} /> 
                  {archivo.substring(0, archivo.indexOf('?')).substring(archivo.substring(0, archivo.indexOf('?')).lastIndexOf('/') + 1)} 
                </a>
              </li>
            ))}
          </ul><br />
        </div>
      ) : (
        <div className="text-center mt-5">
          <h3 style={{ color: 'white', textShadow: '2px 2px 2px rgba(0, 0, 0, 1.0)' }}>Cargando...</h3>
        </div>
      )}
    </div>
  );
};

const getDifficultyStars = (difficulty) => {
  const stars = Array.from({ length: difficulty }, (_, index) => (
    <FontAwesomeIcon icon={solidStar} key={index} style={{ color: '#f7ce3e' }} />
  ));
  return stars;
};

export default Recursos;

import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import CursoService from '../../api/CursoService';

const CrearCursoForm = () => {
  const navigate = useNavigate();
  const [curso, setCurso] = useState({
    titulo: '',
    descripcion: '',
    dificultad: 1,
    categoria: 'Tecnologia',
    enlaces: [''],
    archivosAdjuntos: [] 
  });
  const [error, setError] = useState('');

  const onDrop = (archivos) => {
    console.log('Archivos seleccionados:', archivos);
    setCurso({ ...curso, archivosAdjuntos: archivos });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true, maxFiles: 10 });

  const handleChange = (index, value) => {
    const nuevosEnlaces = [...curso.enlaces];
    nuevosEnlaces[index] = value;
    setCurso({ ...curso, enlaces: nuevosEnlaces });
  };

  const handleAgregarEnlace = () => {
    setCurso({ ...curso, enlaces: [...curso.enlaces, ''] });
  };

  const handleEliminarEnlace = (index) => {
    if (index === 0) return; // No eliminar el primer enlace
    const nuevosEnlaces = [...curso.enlaces];
    nuevosEnlaces.splice(index, 1);
    setCurso({ ...curso, enlaces: nuevosEnlaces });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    const archivosAdjuntos = curso.archivosAdjuntos;
    const maxSizePerFile = 10 * 1024 * 1024; // 10MB en bytes
    const totalMaxSize = 20 * 1024 * 1024; // 20MB en bytes
    
    // Validacion archivos individual
    for (const archivo of archivosAdjuntos) {
      if (archivo.size > maxSizePerFile) {
        setError(`El archivo "${archivo.name}" excede el tamaño máximo individual permitido (10MB).`);
        return;
      }
    }
    
    //Total de los archivos
    const totalSize = archivosAdjuntos.reduce((acc, file) => acc + file.size, 0);
    
    //Validacion total
    if (totalSize > totalMaxSize) {
      setError(`El tamaño total de los archivos adjuntos excede el límite máximo permitido (20MB).`);
      return;
    }

    //Validacion enlaces vacios
    if (curso.enlaces.some(enlace => enlace.trim() === '')) {
      setError('Los enlaces no pueden estar vacíos');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await CursoService.crearCurso(curso, token);
      console.log('Curso creado exitosamente');
      navigate('/cursos');
    } catch (error) {
      console.error('Error al crear el curso:', error.message);
    }
  };

  return (
    <div className="container mt-4">
      <br />
      <h2 className="mb-4" style={{ color: 'white', textShadow: '2px 2px 2px rgba(0, 0, 0, 1.0)' }}>Crear Nuevo Curso</h2>
      <form className="bg-dark" onSubmit={handleSubmit} style={{ color: 'white', padding: '40px', borderRadius: '15px' }}>
        <div className="mb-3" >
          <label htmlFor="titulo" className="form-label">Título:</label>
          <input type="text" className="form-control" id="titulo" value={curso.titulo} onChange={(e) => setCurso({ ...curso, titulo: e.target.value })} minLength={10} maxLength={30} required />
        </div>
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripción:</label>
          <textarea className="form-control" id="descripcion" value={curso.descripcion} onChange={(e) => setCurso({ ...curso, descripcion: e.target.value })} maxLength={500} required />
        </div>
        <div className="mb-3">
          <label htmlFor="dificultad" className="form-label">Dificultad:</label>
          <input type="number" className="form-control" id="dificultad" min="1" max="5" value={curso.dificultad} onChange={(e) => setCurso({ ...curso, dificultad: parseInt(e.target.value) })} required />
        </div>
        <div className="mb-3">
          <label htmlFor="categoria" className="form-label">Categoría:</label>
          <select className="form-control" id="categoria" value={curso.categoria} onChange={(e) => setCurso({ ...curso, categoria: e.target.value })}>
            <option value="Tecnologia">Tecnologia</option>
            <option value="Ciencia">Ciencia</option>
            <option value="Deportes">Deportes</option>
            <option value="Juegos">Juegos</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
        <div {...getRootProps()} className="mb-3" style={{ border: '2px dashed #ddd', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
          <input {...getInputProps()} />
          {isDragActive ? <p>Suelta los archivos aquí ...</p> : <p>Arrastra y suelta maximo 10 archivos aquí, o haz clic para seleccionarlos</p>}
        </div>
        {curso.archivosAdjuntos.length > 0 && (
          <div>
            <h4>Archivos seleccionados:</h4>
            <ul>
              {curso.archivosAdjuntos.map((archivo, index) => (
                <li key={index}>{archivo.name}</li>
              ))}
            </ul>
          </div>
        )}
        {curso.enlaces.map((enlace, index) => (
          <div key={index} className="input-group mb-3">
            <span className="input-group-text">Enlace {index + 1}:</span>
            <input type="url" className="form-control" value={enlace} onChange={(e) => handleChange(index, e.target.value)} />
            {index !== 0 && <button className="btn btn-danger" type="button" onClick={() => handleEliminarEnlace(index)}>-</button>}
          </div>
        ))}
        <button className="btn btn-secondary" type="button" onClick={handleAgregarEnlace}>Añadir Enlace</button>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#d9773f', borderColor: '#233540' }}>Crear Curso</button>
      </form>
    </div>
  );
};

export default CrearCursoForm;

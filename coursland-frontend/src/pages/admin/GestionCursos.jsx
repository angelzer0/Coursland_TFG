import { useState, useEffect } from 'react';
import CursoService from '../../api/CursoService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GestionCursos = () => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cursoAEliminar, setCursoAEliminar] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('titulo');
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 6;

    useEffect(() => {
        async function fetchCursos() {
            try {
                const token = localStorage.getItem('token');
                const listaCursos = await CursoService.listarCursos(token);
                setCursos(listaCursos); 
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener la lista de cursos:', error);
            }
        }
        fetchCursos();
    }, []);

    const eliminarCurso = async (idCurso) => {
        try {
            const token = localStorage.getItem('token');
            await CursoService.eliminarCurso(idCurso, token);
            setCursos(cursos.filter(curso => curso.idCurso !== idCurso)); 
            setCursoAEliminar(null);
            toast.success('Curso eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar el curso:', error);
            toast.error('Error al eliminar el curso');
        }
    };

    const handleConfirmarEliminar = () => {
        if (cursoAEliminar) {
            eliminarCurso(cursoAEliminar);
        }
    };

    const handleCancelarEliminar = () => {
        setCursoAEliminar(null);
    };

    const filteredCursos = cursos.filter(curso => {
        if (searchBy === 'titulo') {
            return curso.titulo.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchBy === 'creador') {
            return curso.creador.email.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });

    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCursos = filteredCursos.slice(indexOfFirstCourse, indexOfLastCourse);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div style={{ padding: '20px', borderRadius: '8px', maxWidth: '800px', margin: '0 auto' }}>
            <ToastContainer />
            <h2 style={{ marginBottom: '20px', textAlign: 'center', color: 'white', textShadow: '2px 2px 2px rgba(0, 0, 0, 1.0)' }}>Lista de Cursos</h2>

            <div className="row mb-3">
                <div className="col-md-6">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder={`Buscar por ${searchBy === 'titulo' ? 'título del curso' : 'correo del creador'}`} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <select 
                        className="form-select"
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                    >
                        <option value="titulo">Título del curso</option>
                        <option value="creador">Correo del creador</option>
                    </select>
                </div>
            </div>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Confirmar eliminación</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            ¿Estás seguro de que deseas eliminar este curso?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancelarEliminar}>Cancelar</button>
                            <button type="button" className="btn btn-danger" onClick={handleConfirmarEliminar}>Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center">
                    <h3>Cargando...</h3>
                </div>
            ) : filteredCursos.length === 0 ? (
                <div className="text-center">
                    <h3>No hay cursos disponibles actualmente.</h3>
                </div>
            ) : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}> 
                        <thead>
                            <tr>
                                <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff', borderRadius: '8px 0 0 0' }}>Titulo</th>
                                <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff' }}>Descripción</th>
                                <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff' }}>Creador</th>
                                <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff', borderRadius: '0 8px 0 0' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCursos.map(curso => (
                                <tr key={curso.idCurso}>
                                    <td style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>{curso.titulo}</td>
                                    <td style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>{curso.descripcion}</td>
                                    <td style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>{curso.creador.email}</td>
                                    <td style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>
                                        <button className="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => setCursoAEliminar(curso.idCurso)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-between mt-3">
                        <button 
                            className="btn btn-primary" 
                            style={{ backgroundColor: 'red', border: 'none', fontSize: '14px', padding: '5px 10px' }}
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <button 
                            className="btn btn-primary" 
                            style={{ backgroundColor: 'red', border: 'none', fontSize: '14px', padding: '5px 10px' }}
                            onClick={() => paginate(currentPage + 1)}
                            disabled={indexOfLastCourse >= filteredCursos.length}
                        >
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default GestionCursos;

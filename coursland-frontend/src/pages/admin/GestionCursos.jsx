import { useState, useEffect } from 'react';
import CursoService from '../../api/CursoService';

const GestionCursos = () => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cursoAEliminar, setCursoAEliminar] = useState(null);

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
        } catch (error) {
            console.error('Error al eliminar el curso:', error);
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

    return (
        <div style={{ padding: '20px', borderRadius: '8px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' ,color: 'white',  textShadow: '2px 2px 2px rgba(0, 0, 0, 1.0)'}}>Lista de Cursos</h2>

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

            {/* Tabla de cursos */}
            {loading ? (
                <div className="text-center">
                    <h3>Cargando...</h3>
                </div>
            ) : cursos.length === 0 ? (
                <div className="text-center">
                    <h3>No hay cursos disponibles actualmente.</h3>
                </div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}> 
                    <thead>
                        <tr>
                            <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff', borderRadius: '8px 0 0 0' }}>Titulo</th>
                            <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff' }}>Descripción</th>
                            <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff' }}>Categoría</th>
                            <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff', borderRadius: '0 8px 0 0' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cursos.map(curso => (
                            <tr key={curso.idCurso}>
                                <td style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>{curso.titulo}</td>
                                <td style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>{curso.descripcion}</td>
                                <td style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>{curso.categoria}</td>
                                <td style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>
                                    <button className="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => setCursoAEliminar(curso.idCurso)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default GestionCursos;

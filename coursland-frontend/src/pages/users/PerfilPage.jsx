import { useEffect, useState } from 'react';
import CursoService from '../../api/CursoService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog } from '@fortawesome/free-solid-svg-icons';
import UserService from '../../api/UserService';

const PerfilPage = () => {
    const [profileInfo, setProfileInfo] = useState({});
    const [cursos, setCursos] = useState([]);
    const [numCursosCreados, setNumCursosCreados] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);
    const [cursoAEliminar, setCursoAEliminar] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await UserService.getYourProfile(token);
                setProfileInfo(response.user);
                setIsAdmin(UserService.isAdmin());
                fetchUserCourses(token, response.user.idUsuario);
            } catch (error) {
                console.error('Error fetching profile information:', error);
            }
        };

        const fetchUserCourses = async (token, userId) => {
            try {
                const cursos = await CursoService.listarCursos(token);
                const userCursos = cursos.filter(curso => curso.creador.idUsuario === userId);
                setCursos(userCursos);
                setNumCursosCreados(userCursos.length);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user courses:', error);
                setLoading(false);
            }
        };

        fetchProfileInfo();
    }, []);

    const eliminarCurso = async (idCurso) => {
        try {
            const token = localStorage.getItem('token');
            await CursoService.eliminarCurso(idCurso, token);
            setCursos(cursos.filter(curso => curso.idCurso !== idCurso));
            setNumCursosCreados(numCursosCreados - 1);
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
        <div className="container justify-content-center" style={{ color: 'white', padding: '30px', borderRadius: '15px', width: '50%' }}>
            <div className="jumbotron text-center" style={{ color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                <FontAwesomeIcon icon={faUserCog} size="5x" className="mb-3" />
                <h1 className="display-2">{profileInfo.nombre}</h1>
                <p className="lead">{profileInfo.email}</p>
                <hr className="my-4" />
                {isAdmin ? (
                    <p className="lead">ADMINISTRADOR DEL SISTEMA</p>
                ) : (
                    <p className="lead">HAS CREADO {numCursosCreados} {numCursosCreados !== 1 ? 'CURSOS' : 'CURSO'}</p>
                )}
            </div>
            {!loading && numCursosCreados > 0 && (
                <div style={{ padding: '20px', borderRadius: '8px', margin: '0 auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff', borderRadius: '8px 0 0 0' }}>Título</th>
                                <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff' }}>Descripción</th>
                                <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff' }}>Categoría</th>
                                <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff', borderRadius: '0 8px 0 0' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cursos.map(curso => (
                                <tr key={curso.idCurso}>
                                    <td style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd', color: 'black' }}>{curso.titulo}</td>
                                    <td style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd', color: 'black' }}>{curso.descripcion}</td>
                                    <td style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd', color: 'black' }}>{curso.categoria}</td>
                                    <td style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd', color: 'black' }}>
                                        <button className="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => setCursoAEliminar(curso.idCurso)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 style={{ color: 'black' }} className="modal-title" id="exampleModalLabel">Confirmar eliminación</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div style={{ color: 'black' }} className="modal-body">
                            ¿Estás seguro de que deseas eliminar este curso?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancelarEliminar}>Cancelar</button>
                            <button type="button" className="btn btn-danger" onClick={handleConfirmarEliminar}>Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerfilPage;

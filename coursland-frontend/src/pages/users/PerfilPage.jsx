import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CursoService from '../../api/CursoService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog } from '@fortawesome/free-solid-svg-icons';
import UserService from '../../api/UserService';

const PerfilPage = () => {
    const [profileInfo, setProfileInfo] = useState({});
    const [numCursosCreados, setNumCursosCreados] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);
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
                setNumCursosCreados(userCursos.length);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user courses:', error);
                setLoading(false);
            }
        };

        fetchProfileInfo();
    }, []);

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
            {!loading && !isAdmin && (
                <div style={{ padding: '20px', borderRadius: '8px', margin: '0 auto', textAlign: 'center' }}>
                    <Link to="/actualizarperfil">
                        <button className="btn" style={{ backgroundColor: '#da773e', color: 'white', margin: '10px', boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.5)' }}>Actualizar Perfil</button>
                    </Link>
                    <Link to="/miscursos">
                        <button className="btn" style={{ backgroundColor: '#da773e', color: 'white', margin: '10px', boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.5)' }}>Gestionar Cursos</button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default PerfilPage;

import { useEffect, useState } from 'react';
import CursoService from '../../api/CursoService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog } from '@fortawesome/free-solid-svg-icons';
import UserService from '../../api/UserService';

const PerfilPage = () => {
    const [profileInfo, setProfileInfo] = useState({});
    const [numCursosCreados, setNumCursosCreados] = useState(0);

    useEffect(() => {
        const fetchProfileInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await UserService.getYourProfile(token);
                setProfileInfo(response.user);
                countUserCourses(response.user.idUsuario); 
            } catch (error) {
                console.error('Error fetching profile information:', error);
            }
        };

        fetchProfileInfo(); 

    }, []); 

    const countUserCourses = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const cursos = await CursoService.listarCursos(token);
            const numCursos = cursos.filter(curso => curso.creador.idUsuario === userId).length;
            setNumCursosCreados(numCursos);
        } catch (error) {
            console.error('Error counting user courses:', error);
        }
    };

    return (
        <div className="container justify-content-center" style={{ color: 'white' , padding: '30px', borderRadius: '15px',width: '20%'}}>
            <div className="jumbotron text-center" style={{ color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                <FontAwesomeIcon icon={faUserCog} size="5x" className="mb-3" />
                <h1 className="display-2">{profileInfo.nombre}</h1>
                <p className="lead">{profileInfo.email}</p>
                <hr className="my-4" />
                <p className="lead">HAS CREADO {numCursosCreados} {numCursosCreados !== 1 ? 'CURSOS' : 'CURSO'}</p>
            </div>
        </div>
    );
}

export default PerfilPage;

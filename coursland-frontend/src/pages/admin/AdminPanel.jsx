
import { Link } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const AdminPanel = () => {
    return (
        <div className="container-fluid">
            <div className="row">

                <div className="col-md-6 border-end border-3 d-flex align-items-center justify-content-center" style={{ height: '90vh' }}>
                    <div className="container py-5 text-center">
                        <h3 className="mb-3" style={{ fontSize: '2rem' ,color: 'white',  textShadow: '2px 2px 2px rgba(0, 0, 0, 1.0)'}}>Gestión de Usuarios</h3>
                        <div>
                            <FontAwesomeIcon icon={faUser} color="white" size="10x"/>
                        </div>
                        <div className="mt-3">
                            <Link to="/gestionusuarios" className="btn btn-primary btn-lg" style={{border: 'none', backgroundColor: '#da773e' }}>Gestionar</Link>
                        </div>
                    </div>
                </div>


                <div className="col-md-6 d-flex align-items-center justify-content-center" style={{ height: '90vh' }}>
                    <div className="container py-5 text-center">
                        <h3 className="mb-3" style={{ fontSize: '2rem',color: 'white',  textShadow: '2px 2px 2px rgba(0, 0, 0, 1.0)' }}>Gestión de Cursos</h3>
                        <div>
                            <FontAwesomeIcon icon={faGraduationCap} color="white" size="10x" />
                        </div>
                        <div className="mt-3">
                            <Link to="/gestioncursos" className="btn btn-primary btn-lg" style={{border: 'none', backgroundColor: '#da773e' }}>Gestionar</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;

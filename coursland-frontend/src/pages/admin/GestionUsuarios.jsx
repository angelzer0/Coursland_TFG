import { useState, useEffect } from 'react';
import UserService from '../../api/UserService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GestionUsuarios = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userToDelete, setUserToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 6;

    useEffect(() => {
        async function fetchUsers() {
            try {
                const token = localStorage.getItem('token');
                const userList = await UserService.getAllUsers(token);
                const filteredUsers = userList.userList.filter(user => !isAdmin(user));
                setUsers(filteredUsers); 
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        fetchUsers();
    }, []);

    const isAdmin = (user) => {
        const rolesString = localStorage.getItem('roles');
        const roles = rolesString ? JSON.parse(rolesString) : [];
        return roles && roles.some(role => role.name === 'ADMIN' && user && user.roles && user.roles.some(userRole => userRole.name === 'ADMIN'));
    };

    const deleteUser = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await UserService.deleteUserById(id, token);
            setUsers(users.filter(user => user.idUsuario !== id));
            toast.success('Usuario eliminado correctamente'); 
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Error al eliminar el usuario');
        }
    };

    const handleDelete = (id) => {
        setUserToDelete(id);
    };

    const handleConfirmDelete = async () => {
        if (userToDelete) {
            await deleteUser(userToDelete);
            setUserToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setUserToDelete(null);
    };

    const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div style={{ padding: '20px', borderRadius: '8px', maxWidth: '800px', margin: '0 auto' }}>
            <ToastContainer />
            <h2 style={{ marginBottom: '20px', textAlign: 'center', color: 'white', textShadow: '2px 2px 2px rgba(0, 0, 0, 1.0)' }}>Lista de Usuarios</h2>

            <div className="mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Buscar por correo electrónico" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center">
                    <h3>Cargando...</h3>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center">
                    <h3>No hay usuarios registrados actualmente</h3>
                </div>
            ) : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}> 
                        <thead>
                            <tr>
                                <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff', borderRadius: '8px 0 0 0' }}>Nombre</th>
                                <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff' }}>Email</th>
                                <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff', borderRadius: '0 8px 0 0' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map(user => (
                                <tr key={user.idUsuario}>
                                    <td style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>{user.nombre}</td>
                                    <td style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>{user.email}</td>
                                    <td style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>
                                        <button className="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleDelete(user.idUsuario)}>Eliminar</button>
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
                            disabled={indexOfLastUser >= filteredUsers.length}
                        >
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                </>
            )}

            {/* Modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Confirmar eliminación</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            ¿Estás seguro de que deseas eliminar este usuario?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancelDelete}>Cancelar</button>
                            <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestionUsuarios;

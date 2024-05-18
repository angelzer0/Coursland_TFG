import { useState, useEffect } from 'react';
import UserService from '../../api/UserService';

const GestionUsuarios = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const token = localStorage.getItem('token');
                const userList = await UserService.getAllUsers(token);
                setUsers(userList.userList); 
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await UserService.deleteUserById(id, token);
            setUsers(users.filter(user => user.idUsuario !== id)); 
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            deleteUser(userToDelete);
            setUserToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setUserToDelete(null);
    };

    const usersWithUserRole = users.filter(user => user.roles.some(role => role.name === 'USER'));

    return (
        <div style={{ padding: '20px', borderRadius: '8px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' ,color: 'white',  textShadow: '2px 2px 2px rgba(0, 0, 0, 1.0)'}}>Lista de Usuarios</h2>

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


            {loading ? (
                <div className="text-center">
                    <h3>Cargando...</h3>
                </div>
            ) : usersWithUserRole.length === 0 ? (
                <div className="text-center">
                    <h3>No hay usuarios registrados actualmente</h3>
                </div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}> 
                    <thead>
                        <tr>
                            <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff', borderRadius: '8px 0 0 0' }}>Nombre</th>
                            <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff' }}>Username</th>
                            <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff' }}>Email</th>
                            <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff', borderRadius: '0 8px 0 0' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersWithUserRole.map(user => (
                            <tr key={user.idUsuario}>
                                <td style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>{user.nombre}</td>
                                <td style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>{user.username}</td>
                                <td style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>{user.email}</td>
                                <td style={{ padding: '10px', backgroundColor: '#f2f2f2', border: '1px solid #ddd' }}>
                                    <button className="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => setUserToDelete(user.idUsuario)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default GestionUsuarios;

import { useState, useEffect } from 'react';
import UserService from '../../api/UserService';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const ChatRoom = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 6;

    useEffect(() => {
        async function fetchUsers() {
            try {
                const token = localStorage.getItem('token');
                const userListResponse = await UserService.getAllUsers(token);
                const userProfileResponse = await UserService.getYourProfile(token);
                const currentUser = userProfileResponse.user;
                const filteredUsers = filterUsers(userListResponse.userList, currentUser.idUsuario);

                setUsers(filteredUsers);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        fetchUsers();
    }, []);

    const filterUsers = (userList, currentUserId) => {
        return userList.filter(user => 
            user.idUsuario !== currentUserId && 
            !user.roles.some(role => role.name === 'ADMIN')
        );
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
            <h2 style={{ marginBottom: '20px', textAlign: 'center', color: 'white', textShadow: '2px 2px 2px rgba(0, 0, 0, 1.0)' }}>Chat Room</h2>

            <div className="row mb-3">
                <div className="col-md-4">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Buscar por correo" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
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
                                <th style={{ padding: '10px', backgroundColor: '#343a40', color: '#fff', borderRadius: '0 8px 0 0' }}>Chats</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map(user => (
                                <tr key={user.idUsuario}>
                                    <td style={{ backgroundColor: '#f2f2f2', padding: '10px', border: '1px solid #ddd' }}>{user.nombre}</td>
                                    <td style={{ backgroundColor: '#f2f2f2', padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
                                    <td style={{ backgroundColor: '#f2f2f2', padding: '10px', border: '1px solid #ddd' }}>
                                        <Link to={`/chat/${user.idUsuario}`} className="btn btn-primary" style={{ backgroundColor: '#da773e', border: 'none', fontSize: '14px', padding: '5px 10px' }}>Enviar Mensaje</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-between mt-3">
                        <button 
                            className="btn btn-primary" 
                            style={{ backgroundColor: '#da773e', border: 'none', fontSize: '14px', padding: '5px 10px' }}
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <button 
                            className="btn btn-primary" 
                            style={{ backgroundColor: '#da773e', border: 'none', fontSize: '14px', padding: '5px 10px' }}
                            onClick={() => paginate(currentPage + 1)}
                            disabled={indexOfLastUser >= filteredUsers.length}
                        >
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatRoom;

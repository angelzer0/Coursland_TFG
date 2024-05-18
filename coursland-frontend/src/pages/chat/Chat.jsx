import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatService from '../../api/ChatService';
import UserService from '../../api/UserService';

const Chat = () => {
    const { userId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [destinatarioNombre, setDestinatarioNombre] = useState('');

    useEffect(() => {
        loadMessages();
        getCurrentUser();
        getDestinatarioNombre();
        subscribeToMessages(); // Suscribirse a nuevos mensajes

        return () => {
            // Limpiar la suscripción al desmontar el componente
            unsubscribeFromMessages();
        };
    }, []);

    const loadMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await ChatService.listarMensajes(token);
            setMessages(response);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const getCurrentUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const profileResponse = await UserService.getYourProfile(token);
            setCurrentUser(profileResponse.user);
        } catch (error) {
            console.error('Error fetching current user profile:', error);
        }
    };

    const getDestinatarioNombre = async () => {
        try {
            const token = localStorage.getItem('token');
            const userResponse = await UserService.getUserById(userId, token);
            setDestinatarioNombre(userResponse.user.nombre);
        } catch (error) {
            console.error('Error fetching destinatario name:', error);
        }
    };

    const isCurrentUser = (message) => {
        return message.remitente.idUsuario === currentUser?.idUsuario;
    };

    const handleSendMessage = async () => {
        try {
            const token = localStorage.getItem('token');
            await ChatService.enviarMensaje({ idDestinatario: userId, contenido: newMessage }, token);
            setNewMessage(''); // Limpieza del campo de escritura
            loadMessages(); // Recarga de mensajes
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const subscribeToMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await ChatService.suscribirMensajes(token);
            // Manejar los nuevos mensajes
            handleNewMessage(response);
        } catch (error) {
            console.error('Error subscribing to messages:', error);
        }
    };

    const unsubscribeFromMessages = () => {
        // Realizar la limpieza de la suscripción
        // (si es necesario para tu implementación específica)
    };

    const handleNewMessage = (message) => {
        // Actualizar el estado con el nuevo mensaje
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    return (
        <div style={{ padding: '20px',  borderRadius: '8px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' ,color: 'white',  textShadow: '2px 2px 2px rgba(0, 0, 0, 1.0)'}}>Chat con {destinatarioNombre}</h2>
            <div className="bg-dark" style={{ padding: '20px', borderRadius: '8px', maxWidth: '600px', margin: 'auto' }}>
                <div className="chat-container" style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                    {messages.map((message, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', justifyContent: isCurrentUser(message) ? 'flex-end' : 'flex-start' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: isCurrentUser(message) ? '#FFA500' : '#007bff', marginRight: '8px' }}></div>
                            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: isCurrentUser(message) ? '#FFA500' : '#007bff', color: '#fff' }}>
                                <p style={{ margin: '0' }}>{message.contenido}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        style={{ flex: '1', marginRight: '10px', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
                        placeholder="Mensaje"
                    />
                    <button onClick={handleSendMessage} style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>Enviar</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;

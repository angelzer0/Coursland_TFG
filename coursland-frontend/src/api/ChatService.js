import axios from 'axios';

const ChatService = {
    BASE_URL: 'http://localhost:8080',

    async enviarMensaje(mensajeDTO, token) {
        try {
            const response = await axios.post(`${ChatService.BASE_URL}/adminuser/enviar-mensaje`, mensajeDTO, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response.data);
        }
    },

    async listarMensajes(token) {
        try {
            const response = await axios.get(`${ChatService.BASE_URL}/adminuser/listar-mensajes`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response.data);
        }
    },

    // Nuevo método para suscribirse a nuevos mensajes mediante long polling
    async suscribirMensajes(token) {
        try {
            const response = await axios.get(`${ChatService.BASE_URL}/adminuser/suscribir-mensajes`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response.data);
        }
    }
};

export default ChatService;

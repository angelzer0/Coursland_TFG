import axios from 'axios';

const ChatService = {

  BASE_URL: 'https://courslandtfg-production.up.railway.app',

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
      }
    };
    
    // Nuevo método para suscribirse a nuevos mensajes mediante long polling

export default ChatService;

import axios from 'axios';

const CursoService = {
  
  BASE_URL: 'https://courslandtfg-production.up.railway.app',

  
  async listarCursos(token) {
    try {
      const response = await axios.get(`${CursoService.BASE_URL}/adminuser/listarcursos`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  },

  async crearCurso(cursoDTO, token) {
    try {
      const response = await axios.post(`${CursoService.BASE_URL}/adminuser/crearcurso`, cursoDTO, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  },

  async eliminarCurso(cursoId, token) {
    try {
      const response = await axios.delete(`${CursoService.BASE_URL}/adminuser/eliminarcurso/${cursoId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  },

  async obtenerCursoPorId(cursoId) {
    try {
      const response = await axios.get(`${CursoService.BASE_URL}/public/obtenercurso/${cursoId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  },
  async listarCursosPorUsuario(token) {
    try {
      const response = await axios.get(`${CursoService.BASE_URL}/adminuser/listarcursosusuario`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data);
    }
  },
}

export default CursoService;

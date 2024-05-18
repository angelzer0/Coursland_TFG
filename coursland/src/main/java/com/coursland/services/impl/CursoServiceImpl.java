package com.coursland.services.impl;

import com.coursland.dto.CursoDTO;
import com.coursland.persistence.entities.Curso;
import com.coursland.persistence.entities.User;
import com.coursland.persistence.repository.CursoRepository;
import com.coursland.persistence.repository.UserRepository;
import com.coursland.services.interfaces.CursoServiceI;
import com.coursland.services.interfaces.DropboxFileUploaderServiceI;
import com.dropbox.core.DbxException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

/**
 * Implementación de la interfaz CursoServiceI que proporciona operaciones relacionadas con los cursos.
 */
@Service
public class CursoServiceImpl implements CursoServiceI {

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DropboxFileUploaderServiceI fileUploaderService;

    /**
     * Obtiene una lista de todos los cursos.
     *
     * @return Lista de cursos.
     */
    @Override
    public List<Curso> listarCursos() {
        return cursoRepository.findAll();
    }

    /**
     * Crea un nuevo curso.
     *
     * @param cursoDTO  DTO que contiene la información del curso.
     * @param userEmail Correo electrónico del usuario que está creando el curso.
     * @return El curso creado.
     * @throws IllegalStateException Si hay un error al procesar archivos adjuntos.
     */
    @Override
    public Curso createCurso(CursoDTO cursoDTO, String userEmail) throws IllegalStateException {
        Optional<User> userOptional = userRepository.findByEmail(userEmail);
        if (userOptional.isPresent()) {
            User currentUser = userOptional.get();

            // Crear un nuevo curso y asignar todas las propiedades, incluidos los archivos adjuntos
            Curso nuevoCurso = new Curso();
            nuevoCurso.setTitulo(cursoDTO.getTitulo());
            nuevoCurso.setDescripcion(cursoDTO.getDescripcion());
            nuevoCurso.setDificultad(cursoDTO.getDificultad());
            nuevoCurso.setCategoria(cursoDTO.getCategoria());
            nuevoCurso.setCreador(currentUser);
            nuevoCurso.setEnlaces(cursoDTO.getEnlaces());

            try {
                // Subir los archivos adjuntos y obtener las URLs
                List<String> urlsArchivosAdjuntos = fileUploaderService.uploadFiles(cursoDTO.getArchivosAdjuntos());
                nuevoCurso.setArchivosAdjuntos(urlsArchivosAdjuntos);
            } catch (IOException | DbxException e) {
                System.out.println("Error al procesar archivos adjuntos: " + e.getMessage());
                throw new IllegalStateException("Error al procesar archivos adjuntos: " + e.getMessage());
            }

            // Guardar el nuevo curso en la base de datos
            return cursoRepository.save(nuevoCurso);
        } else {
            throw new IllegalStateException("Usuario no encontrado para el correo electrónico: " + userEmail);
        }
    }

    /**
     * Obtiene un curso por su ID.
     *
     * @param cursoId ID del curso.
     * @return El curso encontrado.
     * @throws IllegalArgumentException Si no se encuentra ningún curso con el ID proporcionado.
     */
    @Override
    public Curso obtenerCursoPorId(Long cursoId) {
        Optional<Curso> cursoOptional = cursoRepository.findById(cursoId);
        if (cursoOptional.isPresent()) {
            return cursoOptional.get();
        } else {
            throw new IllegalArgumentException("No se encontró un curso con el ID: " + cursoId);
        }
    }

    /**
     * Elimina un curso por su ID.
     *
     * @param cursoId   ID del curso que se va a eliminar.
     * @param userEmail Correo electrónico del usuario que está eliminando el curso.
     * @return El curso eliminado.
     * @throws IllegalStateException Si el usuario no se encuentra o si hay un error al eliminar el curso.
     */
    @Override
    public Curso deleteCursoById(Long cursoId, String userEmail) {
        Optional<User> userOptional = userRepository.findByEmail(userEmail);
        if (userOptional.isPresent()) {
            try {
                Optional<Curso> cursoOptional = cursoRepository.findById(cursoId);
                if (cursoOptional.isPresent()) {
                    Curso curso = cursoOptional.get();
                    cursoRepository.deleteById(cursoId);
                    return curso;
                } else {
                    throw new IllegalArgumentException("No se encontró un curso con el ID: " + cursoId);
                }
            } catch (Exception e) {
                throw new RuntimeException("Se produjo un error al eliminar el curso con ID: " + cursoId, e);
            }
        } else {
            throw new IllegalStateException("Usuario no encontrado para el correo electrónico: " + userEmail);
        }
    }
}

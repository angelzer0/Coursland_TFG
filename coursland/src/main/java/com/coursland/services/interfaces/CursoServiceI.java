package com.coursland.services.interfaces;

import com.coursland.dto.CursoDTO;
import com.coursland.persistence.entities.Curso;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CursoServiceI {
    List<Curso> listarCursos();

    Curso createCurso(CursoDTO cursoDTO, String userEmail) throws IllegalStateException;

    Curso deleteCursoById(Long cursoId, String userEmail);

    Curso obtenerCursoPorId(Long cursoId);

    List<Curso> listarCursosPorUsuario(String userEmail);
}

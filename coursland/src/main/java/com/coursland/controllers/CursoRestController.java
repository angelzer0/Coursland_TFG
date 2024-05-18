package com.coursland.controllers;

import com.coursland.dto.CursoDTO;
import com.coursland.persistence.entities.Curso;
import com.coursland.services.interfaces.CursoServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * Controlador REST para operaciones relacionadas con cursos.
 */
@RestController
public class CursoRestController {

    private static final Logger log = LoggerFactory.getLogger(CursoRestController.class);

    @Autowired
    private CursoServiceI cursoService;

    /**
     * Obtiene la lista de cursos.
     *
     * @return ResponseEntity con la lista de cursos.
     */
    @GetMapping("/adminuser/listarcursos")
    public ResponseEntity<List<Curso>> listarCursos() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        log.info("Listar cursos solicitada por el usuario: {}", userEmail); // Log request for listing courses by the user

        List<Curso> cursos = cursoService.listarCursos();
        log.debug("Cursos listados: {}", cursos); // Log retrieved courses (debug level)

        return ResponseEntity.ok(cursos);
    }

    /**
     * Obtiene un curso por su ID.
     *
     * @param cursoId ID del curso a obtener.
     * @return ResponseEntity con el curso encontrado o un mensaje de error si no se encuentra.
     */
    @GetMapping("/public/obtenercurso/{cursoId}")
    public ResponseEntity<Curso> obtenerCursoPorId(@PathVariable Long cursoId) {
        Curso curso = cursoService.obtenerCursoPorId(cursoId);
        if (curso != null) {
            log.info("Curso encontrado: {}", curso);
            return ResponseEntity.ok(curso);
        } else {
            log.warn("No se encontró ningún curso con ID {}", cursoId);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Crea un nuevo curso.
     *
     * @param cursoDTO Datos del curso a crear.
     * @return ResponseEntity con el curso creado.
     */
    @PostMapping("/adminuser/crearcurso")
    public ResponseEntity<Curso> createCurso(@ModelAttribute CursoDTO cursoDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        Curso cursoGuardado = cursoService.createCurso(cursoDTO, userEmail);
        log.info("Curso creado con éxito: {}", cursoGuardado); // Log successful course creation
        return ResponseEntity.ok(cursoGuardado);
    }

    /**
     * Elimina un curso por su ID.
     *
     * @param cursoId ID del curso a eliminar.
     * @return ResponseEntity con un mensaje indicando el resultado de la operación.
     */
    @DeleteMapping("/admin/eliminarcurso/{cursoId}")
    public ResponseEntity<String> deleteCurso(@PathVariable Long cursoId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        Curso cursoEliminado = cursoService.deleteCursoById(cursoId, userEmail);
        if (cursoEliminado != null) {
            log.info("Curso con ID {} eliminado correctamente.", cursoId);
        } else {
            log.warn("Curso con ID {} no encontrado para eliminar.", cursoId);
        }

        return ResponseEntity.ok("Curso con ID " + cursoId + " eliminado correctamente.");
    }
}


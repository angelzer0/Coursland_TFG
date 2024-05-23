package com.coursland.persistence.repository;

import com.coursland.persistence.entities.Curso;
import com.coursland.persistence.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad Curso que proporciona operaciones CRUD.
 */
@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {
    List<Curso> findByCreador(User creador);
}

package com.coursland.persistence.repository;

import com.coursland.persistence.entities.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la entidad Curso que proporciona operaciones CRUD.
 */
@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {
}

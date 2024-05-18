package com.coursland.persistence.repository;

import com.coursland.persistence.entities.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la entidad Rol que proporciona operaciones CRUD.
 */
@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {
}

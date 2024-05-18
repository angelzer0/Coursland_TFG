package com.coursland.persistence.repository;

import com.coursland.persistence.entities.Mensaje;
import com.coursland.persistence.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repositorio para la entidad Mensaje que proporciona operaciones CRUD.
 */
@Repository
public interface MensajeRepository  extends JpaRepository<Mensaje, Long> {
    List<Mensaje> findByRemitenteOrDestinatarioOrderByFecha(User usuario, User usuario1);
}

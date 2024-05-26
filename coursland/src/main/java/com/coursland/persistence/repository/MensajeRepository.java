package com.coursland.persistence.repository;

import com.coursland.persistence.entities.Mensaje;
import com.coursland.persistence.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repositorio para la entidad Mensaje que proporciona operaciones CRUD.
 */
@Repository
public interface MensajeRepository  extends JpaRepository<Mensaje, Long> {

    @Query("SELECT m FROM Mensaje m WHERE (m.remitente = :remitente AND m.destinatario = :destinatario) OR (m.remitente = :destinatario AND m.destinatario = :remitente) ORDER BY m.fecha")
    List<Mensaje> findChatMessages(@Param("remitente") User remitente, @Param("destinatario") User destinatario);

    List<Mensaje> findByRemitenteOrDestinatarioOrderByFecha(User user, User user1);

}

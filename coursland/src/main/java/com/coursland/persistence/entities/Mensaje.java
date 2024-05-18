package com.coursland.persistence.entities;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

/**
 * Entidad que representa un mensaje en la base de datos.
 */
@Data
@Entity
@Table(name = "T_MENSAJES")
public class Mensaje implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "C_ID_MENSAJE")
    private Long idMensaje;

    @ManyToOne
    @JoinColumn(name = "C_ID_REMITENTE")
    private User remitente;

    @ManyToOne
    @JoinColumn(name = "C_ID_DESTINATARIO")
    private User destinatario;

    @Column(name = "C_CONTENIDO")
    private String contenido;

    @CreationTimestamp
    @Column(name = "C_FECHA")
    private Date fecha;

}

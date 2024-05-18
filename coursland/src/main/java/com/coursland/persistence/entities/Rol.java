package com.coursland.persistence.entities;


import jakarta.persistence.*;
import lombok.Data;


import java.io.Serial;
import java.io.Serializable;

/**
 * Entidad que representa un rol en la base de datos.
 */
@Data
@Entity
@Table(name = "T_ROLES")
public class Rol implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "C_ID_ROL")
    private Long idRol;

    @Column(name = "C_NOMBRE")
    private String name;


}
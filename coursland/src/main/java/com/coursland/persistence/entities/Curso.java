package com.coursland.persistence.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * Entidad que representa un curso en la base de datos.
 */
@Data
@Entity
@Table(name = "T_CURSOS")
public class Curso implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "C_ID_CURSO")
    private Long idCurso;

    @Column(name = "C_TITULO")
    private String titulo;

    @Column(name = "C_DESCRIPCION")
    private String descripcion;

    @Column(name = "C_DIFICULTAD")
    private int dificultad;

    @Column(name = "C_CATEGORIA")
    private String categoria;

    @ManyToOne
    @JoinColumn(name = "C_ID_USUARIO")
    private User creador;

    @ElementCollection
    @CollectionTable(name = "T_ENLACES", joinColumns = @JoinColumn(name = "C_ID_CURSO"))
    @Column(name = "C_URL")
    private List<String> enlaces;

    @ElementCollection
    @CollectionTable(name = "T_ARCHIVOS_ADJUNTOS", joinColumns = @JoinColumn(name = "C_ID_CURSO"))
    @Column(name = "C_ARCHIVO_URL")
    private List<String> archivosAdjuntos;
}

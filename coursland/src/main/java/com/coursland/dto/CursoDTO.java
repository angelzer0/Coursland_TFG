package com.coursland.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * DTO (Data Transfer Object) para la representación de datos de un curso.
 */
@Data
public class CursoDTO {
    private Long idCurso;
    private String titulo;
    private String descripcion;
    private int dificultad;
    private String categoria;
    private List<String> enlaces;
    private List<MultipartFile> archivosAdjuntos;
}

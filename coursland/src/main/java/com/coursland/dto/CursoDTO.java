package com.coursland.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * DTO (Data Transfer Object) para la representación de datos de un curso.
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class CursoDTO {
    private Long idCurso;
    private String titulo;
    private String descripcion;
    private int dificultad;
    private String categoria;
    private List<String> enlaces;
    private List<MultipartFile> archivosAdjuntos;
}

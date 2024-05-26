package com.coursland.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;


/**
 * DTO (Data Transfer Object) para la representación de datos de un Mensaje.
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class MensajeDTO {
    private Long idMensaje;
    private Long idRemitente;
    private Long idDestinatario;
    private String contenido;

}


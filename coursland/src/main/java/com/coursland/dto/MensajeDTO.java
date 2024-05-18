package com.coursland.dto;

import lombok.Data;


/**
 * DTO (Data Transfer Object) para la representación de datos de un Mensaje.
 */
@Data
public class MensajeDTO {
    private Long idMensaje;
    private Long idRemitente;
    private Long idDestinatario;
    private String contenido;

}


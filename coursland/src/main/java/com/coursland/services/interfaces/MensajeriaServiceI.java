package com.coursland.services.interfaces;

import com.coursland.dto.MensajeDTO;
import com.coursland.persistence.entities.Mensaje;

import java.util.List;

public interface MensajeriaServiceI {

    void enviarMensaje(MensajeDTO mensajeDTO, String remitenteEmail);
    List<Mensaje> listarMensajes(String userEmail);

    Mensaje waitForNewMessage()throws InterruptedException;

}
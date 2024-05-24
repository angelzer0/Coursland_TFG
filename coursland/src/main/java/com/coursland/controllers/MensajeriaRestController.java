package com.coursland.controllers;

import com.coursland.dto.MensajeDTO;
import com.coursland.persistence.entities.Mensaje;
import com.coursland.services.interfaces.MensajeriaServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para operaciones relacionadas con la mensajería.
 */
@RestController
public class MensajeriaRestController {

    @Autowired
    private MensajeriaServiceI mensajeriaService;

    /**
     * Envia un mensaje.
     *
     * @param mensajeDTO DTO del mensaje a enviar.
     * @return ResponseEntity con un mensaje indicando el resultado de la operación.
     */
    @PostMapping("/adminuser/enviar-mensaje")
    public ResponseEntity<String> enviarMensaje(@RequestBody MensajeDTO mensajeDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        mensajeriaService.enviarMensaje(mensajeDTO, userEmail);

        return ResponseEntity.ok("Mensaje enviado con éxito.");
    }

    /**
     * Lista los mensajes.
     *
     * @return ResponseEntity con la lista de mensajes.
     */
    @GetMapping("/adminuser/listar-mensajes")
    public ResponseEntity<List<Mensaje>> listarMensajes(@RequestParam Long destinatarioId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        List<Mensaje> mensajes = mensajeriaService.listarMensajes(userEmail, destinatarioId);

        return ResponseEntity.ok(mensajes);
    }


}
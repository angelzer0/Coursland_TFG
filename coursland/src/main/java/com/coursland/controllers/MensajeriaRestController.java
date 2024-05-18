package com.coursland.controllers;

import com.coursland.dto.MensajeDTO;
import com.coursland.persistence.entities.Mensaje;
import com.coursland.services.interfaces.MensajeriaServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;


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
    public ResponseEntity<List<Mensaje>> listarMensajes() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        List<Mensaje> mensajes = mensajeriaService.listarMensajes(userEmail);

        return ResponseEntity.ok(mensajes);
    }

    /**
     * Endpoint para suscribirse a nuevos mensajes (long polling).
     *
     * @return ResponseEntity con el mensaje más reciente cuando esté disponible.
     */
    @GetMapping("/adminuser/suscribir-mensajes")
    public ResponseEntity<Mensaje> suscribirMensajes() {
        try {
            // Espera hasta que haya un nuevo mensaje disponible
            Mensaje nuevoMensaje = mensajeriaService.waitForNewMessage();
            return ResponseEntity.ok(nuevoMensaje);
        } catch (InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build(); // Manejo de error en caso de interrupción
        }
    }
}

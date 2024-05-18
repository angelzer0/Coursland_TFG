package com.coursland.services.impl;

import com.coursland.dto.MensajeDTO;
import com.coursland.persistence.entities.Mensaje;
import com.coursland.persistence.entities.User;
import com.coursland.persistence.repository.MensajeRepository;
import com.coursland.persistence.repository.UserRepository;
import com.coursland.services.interfaces.MensajeriaServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

/**
 * Implementación de la interfaz MensajeriaServiceI que gestiona el envío y la recuperación de mensajes.
 */
@Service
public class MensajeriaServiceImpl implements MensajeriaServiceI {

    @Autowired
    private MensajeRepository mensajeRepository;

    @Autowired
    private UserRepository userRepository;

    // Cola de mensajes pendientes para long polling
    private BlockingQueue<Mensaje> pendingMessages = new LinkedBlockingQueue<>();

    /**
     * Envía un mensaje a un destinatario específico.
     *
     * @param mensajeDTO      Los datos del mensaje a enviar.
     * @param remitenteEmail  El correo electrónico del remitente del mensaje.
     * @throws RuntimeException si el remitente o el destinatario no se encuentran en la base de datos.
     */
    @Override
    public void enviarMensaje(MensajeDTO mensajeDTO, String remitenteEmail) {
        Mensaje mensaje = new Mensaje();

        User remitente = userRepository.findByEmail(remitenteEmail)
                .orElseThrow(() -> new RuntimeException("Remitente no encontrado"));
        User destinatario = userRepository.findById(mensajeDTO.getIdDestinatario())
                .orElseThrow(() -> new RuntimeException("Destinatario no encontrado"));

        mensaje.setRemitente(remitente);
        mensaje.setDestinatario(destinatario);
        mensaje.setContenido(mensajeDTO.getContenido());

        mensajeRepository.save(mensaje);
        // Agrega el mensaje a la cola de mensajes pendientes para long polling
        pendingMessages.offer(mensaje);
    }

    /**
     * Lista los mensajes del usuario especificado por su correo electrónico.
     *
     * @param userEmail El correo electrónico del usuario.
     * @return Una lista de mensajes del usuario, ordenados por fecha.
     * @throws RuntimeException si el usuario no se encuentra en la base de datos.
     */
    @Override
    public List<Mensaje> listarMensajes(String userEmail) {
        User usuario = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return mensajeRepository.findByRemitenteOrDestinatarioOrderByFecha(usuario, usuario);
    }

    /**
     * Espera hasta que haya mensajes nuevos para el usuario.
     *
     * @return El mensaje más reciente para el usuario, o null si no hay mensajes nuevos.
     */
    public Mensaje waitForNewMessage() throws InterruptedException {
        // Espera hasta que haya un mensaje en la cola de mensajes pendientes
        return pendingMessages.take();
    }
}

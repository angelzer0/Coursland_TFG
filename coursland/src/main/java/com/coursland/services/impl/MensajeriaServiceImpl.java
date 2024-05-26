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

/**
 * Implementación de la interfaz MensajeriaServiceI que gestiona el envío y la recuperación de mensajes.
 */
@Service
public class MensajeriaServiceImpl implements MensajeriaServiceI {

    @Autowired
    private MensajeRepository mensajeRepository;

    @Autowired
    private UserRepository userRepository;

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
    }

    /**
     * Lista los mensajes entre un remitente y un destinatario específicos.
     *
     * @param remitenteEmail  El correo electrónico del remitente de los mensajes.
     * @param destinatarioId  El ID del destinatario de los mensajes.
     * @return Lista de mensajes entre el remitente y el destinatario.
     * @throws RuntimeException si el remitente o el destinatario no se encuentran en la base de datos.
     */
    @Override
    public List<Mensaje> listarMensajes(String remitenteEmail, Long destinatarioId) {
        User remitente = userRepository.findByEmail(remitenteEmail)
                .orElseThrow(() -> new RuntimeException("Remitente no encontrado"));
        User destinatario = userRepository.findById(destinatarioId)
                .orElseThrow(() -> new RuntimeException("Destinatario no encontrado"));

        return mensajeRepository.findChatMessages(remitente, destinatario);
    }
}



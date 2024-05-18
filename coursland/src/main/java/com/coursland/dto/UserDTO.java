package com.coursland.dto;

import com.coursland.persistence.entities.Rol;
import com.coursland.persistence.entities.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO (Data Transfer Object) para la representación de datos de un Usuario.
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserDTO {
    
    private int statusCode;
    private String error;
    private String message;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private String nombre;
    private String email;
    private List<Rol> roles;
    public UserDTO() {
        this.roles = new ArrayList<>();
    }
    private String password;
    private User user;
    private List<User> userList;


}

package com.coursland.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

/**
 * Clase utils para la generación, validación y extracción de JWT (JSON Web Tokens).
 */
@Component
public class JWTUtils {

    private SecretKey key;
    private static final Long EXPIRATION_TIME = 86400000L; // 24 horas en milisegundos

    /**
     * Constructor de la clase JWTUtils. Inicializa la clave secreta.
     */
    public JWTUtils() {
        String secreteString = "843567893696976453275974432697R634976R738467TR678T34865R6834R8763T478378637664538745673865783678548735687R3";
        byte[] keyBytes = Base64.getDecoder().decode(secreteString.getBytes(StandardCharsets.UTF_8));
        this.key = new SecretKeySpec(keyBytes, "HmacSHA256");
    }

    /**
     * Genera un token JWT para el usuario proporcionado.
     *
     * @param userDetails Detalles del usuario para los que se genera el token.
     * @return Token JWT generado.
     */
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }

    /**
     * Genera un token de refresco JWT para el usuario proporcionado.
     *
     * @param claims      Reclamaciones adicionales para incluir en el token.
     * @param userDetails Detalles del usuario para los que se genera el token de refresco.
     * @return Token de refresco JWT generado.
     */
    public String generateRefreshToken(HashMap<String, Object> claims, UserDetails userDetails) {
        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }

    /**
     * Extrae el nombre de usuario del token JWT.
     *
     * @param token Token JWT del que se extrae el nombre de usuario.
     * @return Nombre de usuario extraído del token.
     */
    public String extractUsername(String token) {
        return extractClaims(token, Claims::getSubject);
    }

    private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction) {
        return claimsTFunction.apply(Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload());
    }

    /**
     * Verifica si el token JWT proporcionado es válido para el usuario proporcionado.
     *
     * @param token       Token JWT que se va a verificar.
     * @param userDetails Detalles del usuario para el que se verifica el token.
     * @return Verdadero si el token es válido, falso de lo contrario.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * Verifica si el token JWT proporcionado ha expirado.
     *
     * @param token Token JWT que se va a verificar.
     * @return Verdadero si el token ha expirado, falso de lo contrario.
     */
    public boolean isTokenExpired(String token) {
        return extractClaims(token, Claims::getExpiration).before(new Date());
    }
}

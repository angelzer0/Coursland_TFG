/**
 * Implementación de servicio para subir archivos a Dropbox.
 */
package com.coursland.services.impl;

import com.coursland.services.interfaces.DropboxFileUploaderServiceI;
import com.dropbox.core.DbxRequestConfig;
import com.dropbox.core.v2.DbxClientV2;
import com.dropbox.core.v2.files.FileMetadata;
import com.dropbox.core.v2.sharing.SharedLinkMetadata;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.UUID;

/**
 * Implementación del servicio para subir archivos a Dropbox.
 */
@Service
public class DropboxFileUploaderServiceImpl implements DropboxFileUploaderServiceI {

    /** ClientID de Dropbox. */
    private static final String CLIENT_IDENTIFIER = System.getenv("CLIENT_ID");
    /** AppKey de Dropbox. */
    private static final String CLIENT_SECRET = System.getenv("CLIENT_SECRET");
    /** AccessToken de Dropbox. */
    private static final String REFRESH_TOKEN = System.getenv("DROPBOX_TOKEN");

    /** URL para refrescar el token de Dropbox. */
    private static final String REFRESH_URL = "https://api.dropbox.com/oauth2/token";
    /** Cliente de Dropbox. */
    private DbxClientV2 client;

    /**
     * Refresca el token de acceso de Dropbox.
     */
    private void refreshAccessToken() {
        try {
            String accessToken = getAccessTokenUsingRefreshToken();
            DbxRequestConfig config = DbxRequestConfig.newBuilder(CLIENT_IDENTIFIER).build();
            client = new DbxClientV2(config, accessToken);
        } catch (IOException e) {
            throw new IllegalStateException("Error al obtener un nuevo token de acceso de Dropbox.", e);
        }
    }

    /**
     * Obtiene el token de acceso utilizando el token de actualización de Dropbox.
     * @return El token de acceso.
     * @throws IOException Si ocurre un error de entrada/salida.
     */
    private String getAccessTokenUsingRefreshToken() throws IOException {
        URL url = new URL(REFRESH_URL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

        String postData = "grant_type=refresh_token" +
                "&refresh_token=" + REFRESH_TOKEN +
                "&client_id=" + CLIENT_IDENTIFIER +
                "&client_secret=" + CLIENT_SECRET;

        try (OutputStream os = conn.getOutputStream()) {
            os.write(postData.getBytes("UTF-8"));
        }

        StringBuilder response = new StringBuilder();
        try (Scanner scanner = new Scanner(conn.getInputStream())) {
            while (scanner.hasNextLine()) {
                response.append(scanner.nextLine());
            }
        }

        return parseAccessTokenFromResponse(response.toString());
    }

    /**
     * Parsea el token de acceso desde la respuesta.
     * @param response La respuesta del servidor.
     * @return El token de acceso.
     * @throws IOException Si ocurre un error de entrada/salida.
     */
    private String parseAccessTokenFromResponse(String response) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(response);
        return rootNode.path("access_token").asText();
    }

    /**
     * Sube archivos a Dropbox.
     * @param files La lista de archivos a subir.
     * @return La lista de URLs de los archivos subidos.
     * @throws IOException Si ocurre un error de entrada/salida.
     */
    @Override
    public List<String> uploadFiles(List<MultipartFile> files) throws IOException {
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("La lista de archivos no puede ser null o estar vacía.");
        }

        // Refresca el token
        refreshAccessToken();

        List<String> uploadedFileUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file == null) {
                throw new IllegalArgumentException("El archivo no puede ser null.");
            }

            // Validacion archivos unicos
            String originalFilename = file.getOriginalFilename();
            String uniqueFilename = UUID.randomUUID().toString() + "_" + originalFilename;

            try (InputStream in = new ByteArrayInputStream(file.getBytes())) {
                FileMetadata metadata = client.files().uploadBuilder("/Coursland/" + uniqueFilename)
                        .uploadAndFinish(in);

                SharedLinkMetadata sharedLinkMetadata = client.sharing().createSharedLinkWithSettings(metadata.getPathDisplay());
                String sharedUrl = sharedLinkMetadata.getUrl().replace("?dl=0", "?raw=1");
                uploadedFileUrls.add(sharedUrl);
            } catch (Exception e) {
                System.err.println("Error al procesar archivo: " + originalFilename + " - " + e.getMessage());
                throw new IllegalStateException("Error al procesar archivos adjuntos: " + e.getMessage(), e);
            }
        }
        return uploadedFileUrls;
    }
}

package com.coursland.services.impl;

import com.coursland.services.interfaces.DropboxFileUploaderServiceI;
import com.dropbox.core.DbxRequestConfig;
import com.dropbox.core.v2.DbxClientV2;
import com.dropbox.core.v2.files.FileMetadata;
import com.dropbox.core.v2.sharing.SharedLinkMetadata;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class DropboxFileUploaderServiceImpl implements DropboxFileUploaderServiceI {

    String aTok = System.getenv("DROPBOX_TOKEN");

    private static final String CLIENT_IDENTIFIER = "dropbox/coursland";

    private DbxClientV2 client;

    public DropboxFileUploaderServiceImpl() {
        DbxRequestConfig config = DbxRequestConfig.newBuilder(CLIENT_IDENTIFIER).build();
        client = new DbxClientV2(config, aTok);
    }

    @Override
    public List<String> uploadFiles(List<MultipartFile> files) throws IOException {
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("La lista de archivos no puede ser null o estar vacía.");
        }

        List<String> uploadedFileUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file == null) {
                throw new IllegalArgumentException("El archivo no puede ser null.");
            }

            String originalFilename = file.getOriginalFilename();
            String uniqueFilename = UUID.randomUUID().toString() + "_" + originalFilename;

            try (InputStream in = new ByteArrayInputStream(file.getBytes())) {
                FileMetadata metadata = client.files().uploadBuilder("/Coursland/" + uniqueFilename)
                        .uploadAndFinish(in);

                SharedLinkMetadata sharedLinkMetadata = client.sharing().createSharedLinkWithSettings(metadata.getPathDisplay());
                String sharedUrl = sharedLinkMetadata.getUrl().replace("?dl=0", "?raw=1");
                uploadedFileUrls.add(sharedUrl);
            } catch (Exception e) {
                System.out.println("Error al procesar archivo: " + originalFilename + " - " + e.getMessage());
                throw new IllegalStateException("Error al procesar archivos adjuntos: " + e.getMessage());
            }
        }
        return uploadedFileUrls;
    }
}

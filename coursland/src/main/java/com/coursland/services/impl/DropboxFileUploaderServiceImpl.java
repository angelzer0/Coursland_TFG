package com.coursland.services.impl;

import com.coursland.services.interfaces.DropboxFileUploaderServiceI;
import com.dropbox.core.DbxException;
import com.dropbox.core.v2.sharing.SharedLinkMetadata;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.dropbox.core.DbxRequestConfig;
import com.dropbox.core.v2.DbxClientV2;
import com.dropbox.core.v2.files.FileMetadata;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Implementación de la interfaz DropboxFileUploaderServiceI que proporciona funciones para cargar archivos en Dropbox.
 */
@Service
public class DropboxFileUploaderServiceImpl implements DropboxFileUploaderServiceI {


    String aTok = System.getenv("DROPBOX_TOKEN");
    /**
     * Carga archivos en Dropbox y devuelve las URLs compartidas de los archivos cargados.
     *
     * @param files Lista de archivos a cargar.
     * @return Lista de URLs de los archivos cargados.
     * @throws DbxException Si ocurre un error en Dropbox.
     * @throws IOException Si ocurre un error de E/S.
     */
    @Override
    public List<String> uploadFiles(List<MultipartFile> files) throws DbxException, IOException {
        List<String> uploadedFileUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            try (InputStream in = new ByteArrayInputStream(file.getBytes())) {
                DbxRequestConfig config = DbxRequestConfig.newBuilder("dropbox/coursland").build();
                DbxClientV2 client = new DbxClientV2(config, aTok);
                FileMetadata metadata = client.files().uploadBuilder("/Coursland/" + file.getOriginalFilename())
                        .uploadAndFinish(in);

                SharedLinkMetadata sharedLinkMetadata = client.sharing().createSharedLinkWithSettings(metadata.getPathDisplay());
                String sharedUrl = sharedLinkMetadata.getUrl().replace("?dl=0", "?raw=1");
                uploadedFileUrls.add(sharedUrl);
            }
        }
        return uploadedFileUrls;
    }
}

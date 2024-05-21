package com.coursland.services.interfaces;


import com.dropbox.core.DbxException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface DropboxFileUploaderServiceI {

    List<String> uploadFiles(List<MultipartFile> files) throws IOException ;
}

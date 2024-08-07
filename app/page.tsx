'use client';

import { useMemo, useState } from 'react';

import {
  DeleteImageResponse,
  SuccessfulPostCreateSignedUrlResponse,
} from '^/src/shared/api/types';
import ImageList from '^/src/shared/image-list';

import styles from './page.module.css';

export default function Home() {
  const [localFileList, setLocalFileList] = useState<File[]>([]);
  const [uploadedFileList, setUploadedFileList] = useState<string[]>([]);

  const localImageUrls = useMemo(
    () => localFileList.map((localFile) => URL.createObjectURL(localFile)),
    [localFileList]
  );

  return (
    <main className={styles.main}>
      <span className={styles.code}>Selected Local Images</span>
      <ImageList
        imageUrls={localImageUrls}
        onClickDelete={(index) => {
          setLocalFileList(localFileList.filter((_, i) => i !== index));
        }}
      />
      <div className={styles['file-input']}>
        <label className={styles.code} htmlFor="file-select">
          Select Files
        </label>
        <input
          id="file-select"
          type="file"
          multiple
          accept="image/*"
          onChange={(event) => {
            if (!event.currentTarget.files) {
              return;
            }

            const newLocalFileList: File[] = [];
            for (let i = 0; i < event.currentTarget.files.length; i++) {
              const newFile = event.currentTarget.files.item(i);
              if (!newFile) {
                continue;
              }
              newLocalFileList.push(newFile);
            }

            setLocalFileList(localFileList.concat(newLocalFileList));
            event.currentTarget.value = '';
          }}
        />
      </div>
      <button
        className={styles['upload-button']}
        onClick={async () => {
          const uploadedFileUrls = await (Promise.all(
            localFileList.map(
              (localFile) =>
                new Promise(async (resolve) => {
                  const formData = new FormData();
                  formData.append('fileName', localFile.name);

                  const response = await fetch('/api/presigned-url', {
                    method: 'POST',
                    body: formData,
                  });

                  const data =
                    await (response.json() as Promise<SuccessfulPostCreateSignedUrlResponse>);

                  await fetch(data.signedUrl, {
                    method: 'PUT',
                    body: await localFile.arrayBuffer(),
                  });

                  resolve(data.fileUrl);
                })
            )
          ) as Promise<string[]>);
          setUploadedFileList(uploadedFileList.concat(uploadedFileUrls));
        }}
      >
        <span className={styles.code}>Upload Images</span>
      </button>

      <span className={styles.code}>Uploaded Images</span>
      <ImageList
        imageUrls={uploadedFileList}
        onClickDelete={async (index) => {
          const fileUrlSplit = uploadedFileList[index].split('/');
          const response = await fetch(
            `/api/presigned-url/${fileUrlSplit[fileUrlSplit.length - 1]}`,
            {
              method: 'DELETE',
            }
          );
          const data = await (response.json() as Promise<DeleteImageResponse>);
          if (data.result === 'success') {
            setUploadedFileList(uploadedFileList.filter((_, i) => i !== index));
          }
        }}
      />
    </main>
  );
}

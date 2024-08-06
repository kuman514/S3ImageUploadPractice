'use client';

import { useMemo, useState } from 'react';

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
      <ImageList imageUrls={localImageUrls} />
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
        onClick={() => {
          if (!localFileList[0]) {
            return;
          }

          const formData = new FormData();
          formData.append('fileName', localFileList[0].name);
          fetch('/api/create-presigned-url', {
            method: 'POST',
            body: formData,
          })
            .then((response) => response.json())
            .then(async (body) => {
              console.log(body.signedUrl);

              fetch(body.signedUrl, {
                method: 'PUT',
                body: await localFileList[0].arrayBuffer(),
              }).then(() => {
                setUploadedFileList(uploadedFileList.concat([body.fileUrl]));
              });
            });
        }}
      >
        <span className={styles.code}>Upload Images</span>
      </button>

      <span className={styles.code}>Uploaded Images</span>
      <ImageList imageUrls={uploadedFileList} />
    </main>
  );
}

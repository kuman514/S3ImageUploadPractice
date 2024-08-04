'use client';

import { useState } from 'react';

import ImageList from '^/src/shared/image-list';

import styles from './page.module.css';

export default function Home() {
  const [localFileList, setLocalFileList] = useState<File[]>([]);

  return (
    <main className={styles.main}>
      <span className={styles.code}>Selected Local Images</span>
      <ImageList imageFiles={localFileList} />
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
      <button className={styles['upload-button']}>
        <span className={styles.code}>Upload Images</span>
      </button>

      <span className={styles.code}>Uploaded Images</span>
      <ImageList imageFiles={[]} />
    </main>
  );
}

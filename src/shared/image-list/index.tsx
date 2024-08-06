/* eslint-disable @next/next/no-img-element */
import styles from './index.module.css';

interface Props {
  imageFiles: File[];
}

export default function ImageList({ imageFiles }: Props) {
  const renderThumnails = imageFiles.map((imageFile, index) => (
    <img
      key={`image-${index}-${imageFile.name}`}
      src={URL.createObjectURL(imageFile)}
      alt={imageFile.name}
    />
  ));

  return <div className={styles['image-list']}>{renderThumnails}</div>;
}

/* eslint-disable @next/next/no-img-element */
import styles from './index.module.css';

interface Props {
  imageUrls: string[];
}

export default function ImageList({ imageUrls }: Props) {
  const renderThumnails = imageUrls.map((imageUrl, index) => (
    <img
      key={`image-${index}`}
      src={imageUrl}
      alt={`Uploaded image ${index + 1}`}
    />
  ));

  return <div className={styles['image-list']}>{renderThumnails}</div>;
}

/* eslint-disable @next/next/no-img-element */
import styles from './index.module.css';

interface Props {
  imageUrls: string[];
  onClickDelete: (index: number) => void;
}

export default function ImageList({ imageUrls, onClickDelete }: Props) {
  const renderThumnails = imageUrls.map((imageUrl, index) => (
    <div key={`image-${index}`} className={styles['image']}>
      <img src={imageUrl} alt={`Uploaded image ${index + 1}`} />
      <button
        onClick={() => {
          onClickDelete(index);
        }}
      >
        X
      </button>
    </div>
  ));

  return <div className={styles['image-list']}>{renderThumnails}</div>;
}

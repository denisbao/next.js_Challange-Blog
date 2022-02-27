import styles from './styles.module.scss';

interface MorePostsButtonProps {
  loadPosts: () => void;
}

export function MorePostsButton({ loadPosts }: MorePostsButtonProps) {
  return (
    <div className={styles.container}>
      <button
        className={styles.loadMoreButton}
        type="button"
        onClick={loadPosts}
      >
        Carregar mais posts
      </button>
    </div>
  );
}

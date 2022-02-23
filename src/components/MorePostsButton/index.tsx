import styles from './styles.module.scss';

export function MorePostsButton() {
  return (
    <button className={styles.loadMoreButton} type="button">
      Carregar mais posts
    </button>
  );
}

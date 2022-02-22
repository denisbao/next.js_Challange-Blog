import { GetStaticProps } from 'next';
import Head from 'next/head';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main className={styles.container}>
        <section className={styles.posts}>
          <a href="#">
            <h1>Titulo do post</h1>
            <p>Subtitulo do post</p>
            <div className={styles.postInfo}>
              <span>Data de publicacao</span>
              <span>Autor da publicacao</span>
            </div>
          </a>

          <a href="#">
            <h1>Titulo do post</h1>
            <p>Subtitulo do post</p>
            <div className={styles.postInfo}>
              <span>Data de publicacao</span>
              <span>Autor da publicacao</span>
            </div>
          </a>
        </section>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };

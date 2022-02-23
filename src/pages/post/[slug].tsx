import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

// interface Post {
//   first_publication_date: string | null;
//   data: {
//     title: string;
//     banner: {
//       url: string;
//     };
//     author: string;
//     content: {
//       heading: string;
//       body: {
//         text: string;
//       }[];
//     }[];
//   };
// }

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: string;
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  function readTime() {
    const words = post.data.content.split(' ').length;
    const time = Math.floor(words / 100);
    return time;
  }

  return (
    <>
      <Head>
        <title>{post.data.title}</title>
      </Head>
      <main>
        <div className={styles.postImage}>
          <img src={post.data.banner.url} alt="" />
        </div>
        <article className={styles.container}>
          <div className={styles.postHeading}>
            <h1>{post.data.title}</h1>
            <div className={styles.postInfo}>
              <span>
                <FiCalendar className={styles.marginRight} />
                {post.first_publication_date}
              </span>
              <span>
                <FiUser className={styles.marginRight} />
                {post.data.author}
              </span>
              <span>
                <FiClock className={styles.marginRight} />
                {readTime()} min
              </span>
            </div>
          </div>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.data.content }}
          />
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  return {
    paths: [
      {
        params: {
          slug: 'si-u-mundo-ta-muito-paradis-toma-um-me-que-o-mundo',
        },
      },
    ],
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params;

  const response = await prismic.getByUID('post', String(slug), {});

  // console.log(JSON.stringify(response, null, 2));

  const post = {
    first_publication_date: new Date(
      response.first_publication_date
    ).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: RichText.asHtml(response.data.content),
    },
  };

  return {
    props: {
      post,
    },
  };
};

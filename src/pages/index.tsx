import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { FiCalendar } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';
import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { MorePostsButton } from '../components/MorePostsButton';

type Post = {
  slug?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
};

interface HomeProps {
  response: {
    nextPage: string;
    posts: Post[];
  };
}

export default function Home({ response }: HomeProps) {
  const [postList, setPostList] = useState(response);

  function handleMorePages() {
    fetch(response.nextPage)
      .then(resp => resp.json())
      .then(data => {
        const newPosts = data.results.map(post => {
          return {
            slug: post.uid,
            first_publication_date: new Date(
              post.first_publication_date
            ).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            }),
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
          };
        });

        const formatResponse = {
          nextPage: data.next_page,
          posts: [...response.posts, newPosts],
        };

        setPostList(formatResponse);
        console.log(newPosts);
      });
  }

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main className={styles.container}>
        <section className={styles.posts}>
          {postList.posts.map(post => (
            <Link href={`/post/${post.slug}`} key={post.slug}>
              <a>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <div className={styles.postInfo}>
                  <span>
                    <FiCalendar className={styles.marginRight} />
                    {post.first_publication_date}
                  </span>
                  <span>
                    <FiUser className={styles.marginRight} />
                    {post.data.author}
                  </span>
                </div>
              </a>
            </Link>
          ))}
        </section>
        <button type="button" onClick={handleMorePages}>
          test
        </button>
        <MorePostsButton />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  // const postsResponse = await prismic.query('');
  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'post'),
    { pageSize: 1 }
  );

  // const nextPage = postsResponse.next_page;
  // const posts = postsResponse.results.map(post => {
  //   return {
  //     slug: post.uid,
  //     first_publication_date: new Date(
  //       post.first_publication_date
  //     ).toLocaleDateString('pt-BR', {
  //       day: '2-digit',
  //       month: 'long',
  //       year: 'numeric',
  //     }),
  //     data: {
  //       title: post.data.title,
  //       subtitle: post.data.subtitle,
  //       author: post.data.author,
  //     },
  //   };
  // });

  const response = {
    nextPage: postsResponse.next_page,
    posts: postsResponse.results.map(post => {
      return {
        slug: post.uid,
        first_publication_date: new Date(
          post.first_publication_date
        ).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    }),
  };

  console.log(JSON.stringify(response, null, 2));
  // console.log(nextPage);

  return {
    props: {
      response,
    },
  };
};

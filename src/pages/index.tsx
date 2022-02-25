/* eslint-disable react/jsx-no-bind */
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { FiCalendar } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { getPrismicClient } from '../services/prismic';

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
    nextPageUrl: string;
    posts: Post[];
  };
}

export default function Home({ response }: HomeProps) {
  const [postList, setPostList] = useState(response);

  function handleLoadMorePosts() {
    fetch(response.nextPageUrl)
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
          nextPageUrl: data.next_page,
          posts: response.posts.concat(newPosts),
        };
        console.log(formatResponse.nextPageUrl);
        setPostList(formatResponse);
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
        <MorePostsButton loadPosts={handleLoadMorePosts} />
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

  // const nextPageUrl = postsResponse.next_page;
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
    nextPageUrl: postsResponse.next_page,
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

  // console.log(JSON.stringify(response, null, 2));
  console.log(response.nextPageUrl);

  return {
    props: {
      response,
    },
  };
};

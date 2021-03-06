/* eslint-disable react/jsx-no-bind */
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { FiCalendar } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';
import { useState } from 'react';
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
    fetch(postList.nextPageUrl)
      .then(resp => resp.json())
      .then(data => {
        const nextPagePosts = data.results.map(post => {
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
        const formatedResponse = {
          response: {
            nextPageUrl: data.next_page,
            posts: postList.posts.concat(nextPagePosts),
          },
        };
        console.log(formatedResponse.response.posts);
        setPostList(formatedResponse.response);
      });
  }

  function hasMorePosts() {
    if (postList.nextPageUrl) {
      return <MorePostsButton loadPosts={handleLoadMorePosts} />;
    }
    return null;
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
        {hasMorePosts()}
        <div className={styles.endSpace} />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  // const postsResponse = await prismic.query('');
  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'post'),
    { pageSize: 2 }
  );

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

  return {
    props: {
      response,
    },
  };
};

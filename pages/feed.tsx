import { Post } from ".prisma/client";
import { Box } from "grommet";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import PostItem from "../components/post-item";
import prisma from "../lib/prisma";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({});
  return { props: { feed } };
};

const Feed: NextPage = ({ feed }) => {
  return (
    <Box>
      <Head>
        <title>Feed</title>
      </Head>
      {feed.map((post: Post) => (
        <PostItem key={post.id} {...post} />
      ))}
    </Box>
  );
};

export default Feed;

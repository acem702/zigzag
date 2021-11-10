import { Post } from ".prisma/client";
import { Box } from "grommet";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import PostItem from "../components/post-item";
import prisma from "../lib/prisma";
import { usePosition } from "use-position";
import { getPrettyDistance } from "../lib/distance";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({});
  return { props: { feed } };
};

const Feed: NextPage = ({ feed }) => {
  const { latitude, longitude } = usePosition();

  return (
    <Box>
      <Head>
        <title>Feed</title>
      </Head>
      {feed.map((post: Post) => (
        <PostItem
          key={post.id}
          {...post}
          distance={getPrettyDistance(
            post.latitude,
            post.longitude,
            latitude,
            longitude
          )}
        />
      ))}
    </Box>
  );
};

export default Feed;

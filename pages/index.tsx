import { Post } from ".prisma/client";
import { Box } from "grommet";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import PostItem from "../components/post-item";
import { prisma } from "../lib/prisma";
import { usePosition } from "use-position";
import { getPrettyDistance } from "../lib/distance";

export const getServerSideProps: GetServerSideProps = async () => {
  const feed = await prisma.post.findMany({});
  return { props: { feed } };
};

interface Props {
  feed: Post[];
}

const Feed: NextPage<Props> = ({ feed }: Props) => {
  const { latitude, longitude } = usePosition(false);

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

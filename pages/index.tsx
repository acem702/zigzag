import { Post } from ".prisma/client";
import { Box } from "grommet";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import PostItem from "../components/post-item";
import { prisma } from "../lib/prisma";
import { usePosition } from "use-position";
import { getPrettyDistance } from "../lib/distance";

export const getServerSideProps: GetServerSideProps = async () => {
  const feed = await prisma.post.findMany({
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return { props: { feed } };
};

interface PostWithCount extends Post {
  _count: { comments: number };
}

interface Props {
  feed: PostWithCount[];
}

const Feed: NextPage<Props> = ({ feed }: Props) => {
  const { latitude, longitude } = usePosition(false);
  console.log(feed);
  return (
    <Box>
      <Head>
        <title>Feed</title>
      </Head>
      {feed.map((post) => (
        <PostItem
          key={post.id}
          {...post}
          distance={getPrettyDistance(
            post.latitude,
            post.longitude,
            latitude,
            longitude
          )}
          count={post._count.comments}
        />
      ))}
    </Box>
  );
};

export default Feed;

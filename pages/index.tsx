import { Post } from ".prisma/client";
import { Box } from "grommet";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import PostItem from "../components/post-item";
import { prisma } from "../lib/prisma";
import { usePosition } from "use-position";
import { getPrettyDistance } from "../lib/distance";
import { PostWithVotes } from "../components/post-vote-counter";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { sort } = query;
  const sortOrder =
    sort === "new"
      ? {
          createdAt: "desc",
        }
      : {
          test: "t",
        };
  const feed = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
      votes: true,
    },
  });
  return { props: { feed } };
};

interface PostWithCountAndVotes extends PostWithVotes {
  _count: { comments: number };
}

interface Props {
  feed: PostWithCountAndVotes[];
}

const Feed: NextPage<Props> = ({ feed }: Props) => {
  const { latitude, longitude } = usePosition(false);
  return (
    <Box>
      <Head>
        <title>Feed</title>
      </Head>
      {feed.map((post) => (
        <PostItem
          key={post.id}
          post={post}
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

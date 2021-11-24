import { Box } from "grommet";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import PostList from "../components/post-list";
import { prisma } from "../lib/prisma";
import { PostWithVotes } from "../components/post-vote-counter";
import { usePosition } from "use-position";

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

export interface PostWithCountAndVotes extends PostWithVotes {
  _count: { comments: number };
}

interface Props {
  feed: PostWithCountAndVotes[];
}

const Feed: NextPage<Props> = ({ feed }) => {
  const { latitude, longitude } = usePosition(false);

  return (
    <Box>
      <Head>
        <title>Feed</title>
      </Head>
      <PostList posts={feed} userLongitude={longitude} userLatitude={latitude} />
    </Box>
  );
};

export default Feed;

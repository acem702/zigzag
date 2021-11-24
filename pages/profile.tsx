import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Box, Button } from "grommet";
import { signOut } from "next-auth/react";
import { prisma } from "../lib/prisma";
import { getSession } from "next-auth/react";
import { Post, Comment } from ".prisma/client";
import PostList from "../components/post-list";
import CommentList from "../components/comment-list";
import { PostWithCountAndVotes } from ".";
import { usePosition } from "use-position";
import { CommentWithVotes } from "../components/comment-vote-counter";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) {
    return { props: { posts: [], comments: [], userId: '' } };
  }
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      authorId: session.user.id,
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
  const comments = await prisma.comment.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      authorId: session.user.id,
    },
    include: {
      votes: true,
      post: {
        select: {
          content: true,
        },
      },
    },
  });
  const commentsRestructured = comments.map((comment) => {
    const { post, ...rest } = comment;
    return {
      postContent: post.content,
      ...rest,
    };
  });
  return { props: { posts, comments: commentsRestructured, userId: session.user.id } };
};

interface Props {
  posts: PostWithCountAndVotes[];
  comments: (CommentWithVotes & { postContent: string })[];
  userId: string;
}

const Profile: NextPage<Props> = ({ posts, comments, userId }) => {
  const { latitude, longitude } = usePosition(false);
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Box pad="medium">
        <Button label="sign out" onClick={() => signOut()} />
        <h1>my posts</h1>
        <PostList
          posts={posts}
          userLatitude={latitude}
          userLongitude={longitude}
        />
        <h1>my comments</h1>
        <CommentList
          comments={comments}
          postAuthorId={userId}
          userLatitude={latitude}
          userLongitude={longitude}
          showPostContent={true}
        />
      </Box>
    </>
  );
};

export default Profile;

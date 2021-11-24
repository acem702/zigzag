import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import type { GetServerSideProps, NextPage } from "next";
import { prisma } from "../../lib/prisma";
import { Post, PostVote } from ".prisma/client";
import { Box, Text, Form, FormField, TextInput, Button } from "grommet";
import { usePosition } from "use-position";
import { getPrettyDistance } from "../../lib/distance";
import { formatDistanceToNow } from "date-fns";
import PostVoteCounter from "../../components/post-vote-counter";
import CommentList from "../../components/comment-list";
import { CommentWithVotes } from "../../components/comment-vote-counter";
import DeletePostButton from "../../components/delete-post-button";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: params?.id as string | undefined,
    },
    include: {
      comments: {
        include: {
          votes: true,
        },
      },
      votes: {
        select: {
          userId: true,
          rating: true,
        },
      },
    },
  });
  return { props: { post } };
};

export interface PostWithCommentsAndVotes extends Post {
  comments: CommentWithVotes[];
  votes: PostVote[];
}

interface Props {
  post: PostWithCommentsAndVotes;
}

const PostDetail: NextPage<Props> = ({ post }: Props) => {
  const { latitude, longitude } = usePosition(false);
  const [value, setValue] = useState({ comment: "" });

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

  const distance = getPrettyDistance(
    post.latitude,
    post.longitude,
    latitude,
    longitude
  );

  // Could turn into hook?
  const handleSubmit = async ({
    value: { comment },
  }: {
    value: { comment: string };
  }) => {
    try {
      // TODO: use built-in validation
      if (comment) {
        const body = {
          content: comment,
          latitude,
          longitude,
        };
        await fetch(`/api/posts/${post.id}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        refreshData();
      }
    } catch (error) {
      console.error(error);
    }
    setValue({ comment: "" });
  };

  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <Box direction="row" align="center" pad="medium">
        <Box flex="grow">
          <Text size="3xl">
            {post.content}
            <DeletePostButton postAuthorId={post.authorId} postId={post.id} redirect="/" />
          </Text>
          <Text size="small" color="dark-5">
            {formatDistanceToNow(post.createdAt)} ago &middot; {distance}
          </Text>
        </Box>
        <PostVoteCounter initialPost={post} />
      </Box>
      <Box background="light-3" pad="small">
        <Text color="dark-6" weight="bold">
          {post.comments.length} comments
        </Text>
      </Box>
      <CommentList
        comments={post.comments}
        userLatitude={latitude}
        userLongitude={longitude}
        postAuthorId={post.authorId}
      />
      <Box pad="medium">
        <Form
          value={value}
          onChange={(nextValue) => setValue(nextValue)}
          onSubmit={handleSubmit}
        >
          <Box direction="row" gap="medium" align="center">
            <Box flex="grow">
              <FormField name="comment">
                <TextInput name="comment" placeholder="Add a new comment" />
              </FormField>
            </Box>
            <Button type="submit" primary label="send" />
          </Box>
        </Form>
      </Box>
    </>
  );
};

export default PostDetail;

import { Post, Comment } from ".prisma/client";
import { Box, Text, Form, FormField, TextInput, Button } from "grommet";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { prisma } from "../../lib/prisma";
import { usePosition } from "use-position";
import { getPrettyDistance } from "../../lib/distance";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/router";
import CommentList from "../../components/comment-list";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: params?.id as string | undefined,
    },
    include: {
      comments: true,
    },
  });
  return { props: { post } };
};

interface PostWithComments extends Post {
  comments: Comment[];
}

interface Props {
  post: PostWithComments;
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
          postId: post.id,
          latitude,
          longitude,
        };
        await fetch("/api/comment", {
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
      <Box pad="medium">
        <Text size="3xl">{post.content}</Text>
        <Text size="small" color="dark-5">
          {formatDistanceToNow(post.createdAt)} ago &middot; {distance}
        </Text>
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
          <Box direction="row" gap="medium">
            <Box flex="grow">
              <FormField name="comment">
                <TextInput name="comment" placeholder="Add a new comment" />
              </FormField>
            </Box>
            <Button type="submit" label="Send" />
          </Box>
        </Form>
      </Box>
    </>
  );
};

export default PostDetail;

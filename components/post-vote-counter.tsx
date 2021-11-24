import { Post, PostVote } from ".prisma/client";
import { Box, Button, Text } from "grommet";
import { Up, Down } from "grommet-icons";
import { useSession } from "next-auth/react";
import { useState } from "react";

export interface PostWithVotes extends Post {
  votes: PostVote[];
}

interface Props {
  initialPost: PostWithVotes;
}

const PostVoteCounter = ({ initialPost }: Props) => {
  // "Optimistically render" upvoting/downvoting to make it feel more responsive
  const [post, setPost] = useState(initialPost);

  const apiInfo = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };

  const totalRating = post.votes.reduce((acc, curr) => {
    return acc + curr.rating;
  }, 0);

  const { data: session, status } = useSession();
  const userVote = post.votes.find((vote) => vote.userId === session?.user?.id);

  const userUpvoted = userVote ? userVote.rating === 1 : false;
  const userDownvoted = userVote ? userVote.rating === -1 : false;

  const handleVote = (isUpvote: boolean) => {
    const action = isUpvote ? "upvote" : "downvote";
    const switchVote = isUpvote
      ? !userUpvoted && userDownvoted
      : !userDownvoted && userUpvoted;
    const newVote = (isUpvote && !userUpvoted) || (!isUpvote && !userDownvoted);
    const rating = isUpvote ? 1 : -1;

    return async () => {
      const originalVotes = post.votes;

      try {
        // Prerender placeholder
        // Switching vote
        if (switchVote) {
          const newVotes = originalVotes.map((vote) =>
            vote.userId === session?.user?.id ? { ...vote, rating } : vote
          );
          setPost({
            ...post,
            votes: newVotes,
          });
        } else if (newVote) {
          // render a placeholder
          setPost({
            ...post,
            votes: [
              ...originalVotes,
              {
                id: 0, // placeholder id
                userId: session?.user?.id as string,
                postId: post.id,
                rating,
              },
            ],
          });
        } else {
          setPost({
            ...post,
            votes: originalVotes.filter(
              (vote) => vote.userId != session?.user?.id
            ),
          });
        }
        const res = await fetch(
          `/api/posts/${post.id}/${action}`,
          apiInfo
        ).then((res) => res.json());
        if (res?.votes) {
          setPost({ ...post, votes: res.votes });
        } else {
          setPost({ ...post, votes: originalVotes });
        }
      } catch (error) {
        console.error(error);
        setPost({ ...post, votes: originalVotes });
      }
    };
  };

  const handleUpvote = handleVote(true);
  const handleDownvote = handleVote(false);

  return (
    <Box align="center" justify="center" pad="small">
      <Button icon={<Up color={userUpvoted ? 'brand' : 'plain'}/>} onClick={handleUpvote} plain />
      <Text>{totalRating}</Text>
      <Button
        icon={<Down color={userDownvoted ? 'brand' : 'plain'} />}
        onClick={handleDownvote}
        plain
      />
    </Box>
  );
};

export default PostVoteCounter;

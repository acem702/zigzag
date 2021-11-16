import { Comment, CommentVote } from ".prisma/client";
import { Box, Button, Text } from "grommet";
import { Up, Down } from "grommet-icons";
import { useSession } from "next-auth/react";
import { useState } from "react";

export interface CommentWithVotes extends Comment {
  votes: CommentVote[];
}
interface Props {
  initialComment: CommentWithVotes;
}

const CommentVoteCounter = ({ initialComment }: Props) => {
  // "Optimistically render" upvoting/downvoting to make it feel more responsive
  const [comment, setComment] = useState(initialComment);

  const apiInfo = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };

  const totalRating = comment.votes.reduce((acc, curr) => {
    return acc + curr.rating;
  }, 0);

  const { data: session, status } = useSession();
  const userVote = comment.votes.find((vote) => vote.userId === session?.user?.id);

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
      const originalVotes = comment.votes;

      try {
        // Prerender placeholder
        // Switching vote
        if (switchVote) {
          const newVotes = originalVotes.map((vote) =>
            vote.userId === session?.user?.id ? { ...vote, rating } : vote
          );
          setComment({
            ...comment,
            votes: newVotes,
          });
        } else if (newVote) {
          // render a placeholder
          setComment({
            ...comment,
            votes: [
              ...originalVotes,
              {
                id: 0, // placeholder id
                userId: session?.user?.id as string,
                commentId: comment.id,
                rating,
              },
            ],
          });
        } else {
          setComment({
            ...comment,
            votes: originalVotes.filter(
              (vote) => vote.userId != session?.user?.id
            ),
          });
        }
        const res = await fetch(
          `/api/posts/${comment.postId}/comments/${comment.id}/${action}`,
          apiInfo
        ).then((res) => res.json());
        if (res?.votes) {
          setComment({ ...comment, votes: res.votes });
        } else {
          setComment({ ...comment, votes: originalVotes });
        }
      } catch (error) {
        console.error(error);
        setComment({ ...comment, votes: originalVotes });
      }
    };
  };

  const handleUpvote = handleVote(true);
  const handleDownvote = handleVote(false);

  return (
    <Box align="center" pad="small">
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

export default CommentVoteCounter;

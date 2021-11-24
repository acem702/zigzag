import { Comment } from ".prisma/client";
import { Box, Text } from "grommet";
import { formatDistanceToNow } from "date-fns";
import CommentItem from "./comment-item";
import { getPrettyDistance } from "../lib/distance";
import { CommentWithVotes } from "./comment-vote-counter";

interface Props {
  comments: (CommentWithVotes & {postContent?: string})[];
  userLatitude: number | undefined;
  userLongitude: number | undefined;
  postAuthorId: string;
  showPostContent?: boolean;
}
const CommentList = ({ comments, userLatitude, userLongitude, postAuthorId, showPostContent = false }: Props) => {
  const commentItems = comments.map((comment) => (
    <CommentItem
      key={comment.id}
      distance={getPrettyDistance(
        comment.latitude,
        comment.longitude,
        userLatitude,
        userLongitude
      )}
      postAuthorId={postAuthorId}
      showPostContent
      {...comment}
    />
  ));

  return (
    <Box gap="medium" border="between">
      {commentItems}
    </Box>
  );
};

export default CommentList;

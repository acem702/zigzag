import { Comment } from ".prisma/client";
import { Box, Text } from "grommet";
import { formatDistanceToNow } from "date-fns";
import CommentItem from "./comment-item";
import { getPrettyDistance } from "../lib/distance";
import { CommentWithVotes } from "./comment-vote-counter";

interface Props {
  comments: CommentWithVotes[];
  userLatitude: number | undefined;
  userLongitude: number | undefined;
  postAuthorId: string;
}
const CommentList = ({ comments, userLatitude, userLongitude, postAuthorId }: Props) => {
  const commentItems = comments.map((comment: CommentWithVotes) => (
    <CommentItem
      key={comment.id}
      distance={getPrettyDistance(
        comment.latitude,
        comment.longitude,
        userLatitude,
        userLongitude
      )}
      postAuthorId={postAuthorId}
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

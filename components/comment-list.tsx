import { Comment } from ".prisma/client";
import { Box, Text } from "grommet";
import { formatDistanceToNow } from "date-fns";
import CommentItem from "./comment-item";
import { getPrettyDistance } from "../lib/distance";

interface Props {
  comments: Comment[];
  userLatitude: number | undefined;
  userLongitude: number | undefined;
  postAuthorId: string;
}
const CommentList = ({ comments, userLatitude, userLongitude, postAuthorId }: Props) => {
  const commentItems = comments.map((comment: Comment) => (
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

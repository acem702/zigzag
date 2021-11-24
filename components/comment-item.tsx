import { Box, Text, Avatar } from "grommet";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import EmojiAvatar from "./emoji-avatar";
import CommentVoteCounter, { CommentWithVotes } from "./comment-vote-counter";

interface Props extends CommentWithVotes {
  distance: string;
  postAuthorId: string;
  showPostContent?: boolean;
  postContent?: string;
}
const CommentItem = ({
  distance,
  postAuthorId,
  showPostContent = false,
  ...comment
}: Props) => {
  return (
    <Box>
      {showPostContent && <Link href={`/posts/${comment.postId}`}>
        <Text
          size="small"
          weight="bold"
          style={{ cursor: "pointer" }}
        >
          <a>
          {comment.postContent}
          </a>
        </Text>
      </Link>}

      <Box direction="row" pad="small" gap="medium">
        {postAuthorId === comment.authorId ? (
          <Avatar background="light-3">
            <Text color="accent-2" weight="bolder">
              OP
            </Text>
          </Avatar>
        ) : (
          <EmojiAvatar postId={comment.postId} authorId={comment.authorId} />
        )}
        <Box flex="grow">
          <Text size="large">{comment.content}</Text>
          <Text size="xsmall" color="dark-5">
            {formatDistanceToNow(comment.createdAt)} ago &middot; {distance}
          </Text>
        </Box>
        <CommentVoteCounter initialComment={comment} />
      </Box>
    </Box>
  );
};

export default CommentItem;

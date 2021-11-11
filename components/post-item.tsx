import { Post } from ".prisma/client";
import Link from "next/link";
import { Box, Text } from "grommet";
import { formatDistanceToNow } from "date-fns";

interface Props extends Post {
  distance: string;
  count: number;
}
const PostItem = ({ distance, count, ...post }: Props) => {
  return (
    <Box pad="medium">
      <Text size="xxlarge">{post.content}</Text>
      <Text size="small" color="dark-5">
        {formatDistanceToNow(post.createdAt)} ago &middot; {distance}
      </Text>
      <Link href={`/post/${post.id}`}>
        <Text
          size="small"
          color="accent-2"
          weight="bold"
          style={{ cursor: "pointer" }}
        >
          <a>{count} comments</a>
        </Text>
      </Link>
    </Box>
  );
};

export default PostItem;

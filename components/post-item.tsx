import { Post } from ".prisma/client";
import { Box } from "grommet";
import { formatDistanceToNow } from 'date-fns';

interface Props extends Post {
  distance: string;
}
const PostItem = ({distance, ...post }: Props) => {

  return <Box pad="medium">
    <h2>{post.content}</h2>
    <p>{formatDistanceToNow(post.createdAt)} ago</p>
    {distance}
  </Box>
};

export default PostItem;
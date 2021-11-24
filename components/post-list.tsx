import PostItem from "./post-item";
import { getPrettyDistance } from "../lib/distance";
import { PostWithCountAndVotes } from "../pages";

interface Props {
  posts: PostWithCountAndVotes[];
  userLatitude: number | undefined;
  userLongitude: number | undefined;
}
const PostList = ({ posts, userLongitude, userLatitude }: Props) => {
  return (
    <>
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          distance={getPrettyDistance(
            post.latitude,
            post.longitude,
            userLatitude,
            userLongitude
          )}
          count={post._count.comments}
        />
      ))}
    </>
  );
};

export default PostList;

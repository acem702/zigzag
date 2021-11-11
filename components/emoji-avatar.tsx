import { Avatar } from "grommet";
import { hashString } from "../lib/hash-string";
import emojis from '../public/emojis.json';

interface Props {
  postId: string;
  authorId: string;
}

const EmojiAvatar = ({ postId, authorId }: Props) => {
  const hash = Math.abs(hashString(postId + authorId));
  const emoji = emojis[hash % emojis.length];
  return <Avatar background="neutral-3">{emoji}</Avatar>;
};

export default EmojiAvatar;

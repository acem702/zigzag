import { useSession } from "next-auth/react";
import { Trash } from "grommet-icons";
import { Button } from "grommet";
import { useRouter } from "next/router";

interface Props {
  postId: string;
  postAuthorId: string;
  redirect?: string;
}
const DeletePostButton = ({ postId, postAuthorId, redirect }: Props) => {
  const { data: session, status } = useSession();

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
      if (redirect) {
        router.push(redirect)
      } else {
        refreshData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {postAuthorId === session?.user.id && (
        <Button icon={<Trash color="dark-6" />} plain onClick={handleDelete} />
      )}
    </>
  );
};

export default DeletePostButton;

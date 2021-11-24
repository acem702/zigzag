import { prisma } from "../../../../lib/prisma";
import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  // TODO: forbidden if post not made by user or other err if user not logged in
  await prisma.post.delete({
    where: {
      id: req.query.postId as string
    },
  });
  res.json({});
}

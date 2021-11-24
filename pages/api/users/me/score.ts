import { prisma } from "../../../../lib/prisma";
import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  let voteScore: number | null = null;
  if (session?.user) {
    const postVoteRating = await prisma.postVote.aggregate({
      where: {
        post: {
          authorId: session.user.id
        }
      },
      _sum: {
        rating: true,
      },
    });
    const commentVoteRating = await prisma.commentVote.aggregate({
      where: {
        comment: {
          authorId: session.user.id
        }
      },
      _sum: {
        rating: true,
      },
    });
    const a = postVoteRating._sum.rating || 0;
    const b = commentVoteRating._sum.rating || 0;
    voteScore =
      postVoteRating && commentVoteRating
        ? a + b
        : null;
  }
  res.json(voteScore);
}

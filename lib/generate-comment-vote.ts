import { prisma } from "./prisma";
import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";
import { CommentVote } from ".prisma/client";

export default function generateVote(rating: number) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    try {
      if (session?.user) {
        let updatedVotes: CommentVote[] = [];
        const votesByUser = await prisma.comment.findUnique({
          where: {
            id: req.query.commentId as string,
          },
          select: {
            votes: {
              where: {
                userId: session?.user?.id,
              },
            },
          },
        });
        const existingVote =
          votesByUser && votesByUser?.votes?.length !== 0 ? votesByUser.votes[0] : null;

        // User hasn't voted
        if (!existingVote) {
          const response = await prisma.commentVote.create({
            data: {
              user: { connect: { id: session?.user?.id } },
              comment: { connect: { id: req.query.commentId as string } },
              rating,
            },
            select: {
              comment: {
                select: {
                  votes: true,
                },
              },
            },
          });
          updatedVotes = response.comment.votes;

          // User already voted the same way
        } else if (existingVote.rating === rating) {
          await prisma.commentVote.delete({
            where: {
              commentId_userId: {
                commentId: req.query.commentId as string,
                userId: session?.user?.id,
              },
            },
          });
          const response = await prisma.comment.findUnique({
            where: {
              id: req.query.commentId as string,
            },
            select: {
              votes: true,
            },
          });
          updatedVotes = response?.votes || [];
          // User already voted the other way
        } else {
          const response = await prisma.commentVote.update({
            where: {
              commentId_userId: {
                commentId: req.query.commentId as string,
                userId: session?.user?.id,
              },
            },
            data: {
              rating,
            },
            select: {
              comment: {
                select: {
                  votes: true,
                },
              },
            },
          });
          updatedVotes = response.comment.votes;
        }
        res.json({ votes: updatedVotes });
      } else {
        res.status(401).json({ error: 'Unauthorized user' });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  };
}

import { prisma } from "./prisma";
import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";
import { PostVote } from ".prisma/client";

export default function generateVote(rating: number) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    try {
      if (session?.user) {
        let updatedVotes: PostVote[] = [];
        const votesByUser = await prisma.post.findUnique({
          where: {
            id: req.query.id as string,
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
          const response = await prisma.postVote.create({
            data: {
              user: { connect: { id: session?.user?.id } },
              post: { connect: { id: req.query.id as string } },
              rating,
            },
            select: {
              post: {
                select: {
                  votes: true,
                },
              },
            },
          });
          updatedVotes = response.post.votes;

          // User already voted the same way
        } else if (existingVote.rating === rating) {
          await prisma.postVote.delete({
            where: {
              postId_userId: {
                postId: req.query.id as string,
                userId: session?.user?.id,
              },
            },
          });
          const response = await prisma.post.findUnique({
            where: {
              id: req.query.id as string,
            },
            select: {
              votes: true,
            },
          });
          updatedVotes = response?.votes || [];
          // User already voted the other way
        } else {
          const response = await prisma.postVote.update({
            where: {
              postId_userId: {
                postId: req.query.id as string,
                userId: session?.user?.id,
              },
            },
            data: {
              rating,
            },
            select: {
              post: {
                select: {
                  votes: true,
                },
              },
            },
          });
          updatedVotes = response.post.votes;
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

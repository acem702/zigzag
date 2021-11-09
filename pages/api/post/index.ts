import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { content, authorId } = req.body;
  const result = await prisma.post.create({
    data: {
      content,
      authorId,
    }
  });
  res.json(result);
}

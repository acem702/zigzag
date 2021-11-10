import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { content, latitude, longitude } = req.body;

  const session = await getSession({ req });
  const result = await prisma.post.create({
    data: {
      content,
      author: { connect: { email: session?.user?.email || undefined } },
      latitude,
      longitude,
    },
  });
  res.json(result);
}

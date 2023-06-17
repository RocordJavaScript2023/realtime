import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, email, password, picture, emailVerified, messages, servers, sessions } = req.body;
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password,
          picture,
          emailVerified,
          messages,
          servers,
          sessions
        },
      });
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
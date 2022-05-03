// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sqlite from 'sqlite'
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();


export default async function handler(req, res) {

  const userData = JSON.parse(req.body)

  const saveUser = await prisma.user.create({
    data: userData
  })

  res.json(saveUser)
}

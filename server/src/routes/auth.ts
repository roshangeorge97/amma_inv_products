import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
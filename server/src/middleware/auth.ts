// import { PrismaClient } from '@prisma/client';
// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// const prisma = new PrismaClient();

// export async function requireAdmin(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'Admin access required' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
//       adminId: string;
//       sessionId: string;
//     };

//     const session = await prisma.session.findUnique({
//       where: {
//         id: decoded.sessionId,
//         adminId: decoded.adminId,
//       },
//       include: {
//         admin: true,
//       },
//     });

//     if (!session || session.expires < new Date()) {
//       return res.status(401).json({ error: 'Invalid or expired admin session' });
//     }

//     // Update session last used time
//     await prisma.session.update({
//       where: { id: session.id },
//       data: { lastUsedAt: new Date() },
//     });

//     req.admin = session.admin;
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: 'Invalid admin token' });
//   }
// }
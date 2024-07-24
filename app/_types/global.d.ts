import { Prisma } from '@prisma/client';

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}

type CloudinaryImageObj = {
  id: string;
  url: string;
};

type SessionUser = {
  name: string;
  email: string;
  image: string;
  role: 'EDITOR' | 'USER';
};

type CommentWithUserNameAndImage = Prisma.CommentGetPayload<{
  include: { User: { select: { name: true; image: true } } };
}>;

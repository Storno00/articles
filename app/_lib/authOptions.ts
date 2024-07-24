import prisma from '@/app/_db/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import Google from 'next-auth/providers/google';
import { NextAuthOptions } from 'next-auth';

const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });

        if (!dbUser) {
          token.role = 'USER';
          return token;
        }

        token.role = dbUser?.role;
        token.id = dbUser?.id;
        return token;
      }
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.id;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  adapter: PrismaAdapter(prisma),
  debug: true,
};

export default authOptions;

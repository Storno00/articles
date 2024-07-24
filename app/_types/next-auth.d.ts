import 'next-auth/jwt';
import { Role } from '@prisma/client';

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      role: Role;
      id: string;
      name: string;
      email: string;
      image: string;
    };
  }
}

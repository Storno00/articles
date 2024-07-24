'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { status } = useSession();
  const router = useRouter();

  const logout = () => {
    signOut();
    router.push('/');
  };

  return (
    <header className="bg-[url('/header.png')] h-40 bg-bottom bg-cover text-white px-40 flex items-end justify-between">
      <Link href="/" className="text-2xl font-bold">Beki's Blog</Link>
      <div className="flex items-center justify-center gap-4 text-lg">
        <Link href="/about">About me</Link>
        <Link href="/articles">Articles</Link>
        {status === 'authenticated' && (
          <span className="cursor-pointer" onClick={logout}>
            Logout
          </span>
        )}
        {status === 'unauthenticated' && <Link href="/login">Login</Link>}
      </div>
    </header>
  );
}

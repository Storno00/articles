import CreateArticleForm from '@/app/_components/CreateArticleForm';
import authOptions from '@/app/_lib/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function page() {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/login');

  if (session.user.role !== 'EDITOR') throw new Error('You have to be an editor to reach this page');

  return (
    <>
      <h1 className="font-bold text-4xl">Create a new article</h1>
      <CreateArticleForm />
    </>
  );
}

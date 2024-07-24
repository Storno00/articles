import CreateArticleForm from '@/app/_components/CreateArticleForm';
import prisma from '@/app/_db/prisma';
import authOptions from '@/app/_lib/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function EditArticle(context) {
  const { articleId } = context.params;

  const session = await getServerSession(authOptions);

  if (!session) throw new Error('You have to be an editor to reach this page');

  if (session.user.role !== 'EDITOR') redirect('/');

  const getArticle = async () => {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { images: true, User: true },
    });
    return article;
  };

  const article = await getArticle();

  if (!article) throw new Error('Article does not exist')

  return (
    <>
      <h1 className="font-bold text-4xl">Update article</h1>
      <CreateArticleForm article={article} />
    </>
  );
}

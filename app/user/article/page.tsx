import { getServerSession } from 'next-auth';
import authOptions from '@/app/_lib/authOptions';
import { redirect } from 'next/navigation';
import prisma from '@/app/_db/prisma';
import UserArticleItem from '@/app/_components/UserArticleItem';
import UserArticlePaginator from '@/app/_components/UserArticlePaginator';
import UserArticleFilters from '@/app/_components/UserArticleFilters';
import { selectArticleExceptBody } from '@/app/_constants/selects';
import Link from 'next/link';
import { Button } from 'flowbite-react';

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function UserArticles({ searchParams }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/login');

  if (session.user.role !== 'EDITOR') throw new Error('You have to be an editor to reach this page');

  const getUserArticles = async () => {
    const possibleToOrderBy = ['title', 'views', 'likes', 'createdAt'];
    let preOrderBy = '';

    if (typeof searchParams?.orderBy === 'object') {
      preOrderBy = searchParams.orderBy[0];
    } else {
      preOrderBy = searchParams?.orderBy || '';
    }

    const page = searchParams?.page || 1;
    const search = searchParams?.search || undefined;
    const order =
      searchParams?.order !== 'asc' && searchParams?.order !== 'desc'
        ? 'desc'
        : searchParams?.order;
    const orderBy = !possibleToOrderBy.includes(preOrderBy)
      ? 'createdAt'
      : searchParams?.orderBy;

    const articles = await prisma.article.findMany({
      where: {
        userId: session?.user?.id,
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
      select: selectArticleExceptBody,
      orderBy: [{ [orderBy]: order }],
      skip: (Number(page) - 1) * 10,
      take: 10,
    });
    return articles;
  };

  const articles = await getUserArticles();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-4xl mb-10">{`${session?.user?.name}'s articles`}</h1>

        <Link href="/user/article/new" className="-translate-y-4">
          <Button color="success">Create new article</Button>
        </Link>
      </div>
      <UserArticleFilters />
      <div className="flex flex-col gap-10">
        {articles.map((article) => (
          <UserArticleItem key={article.id} article={article} />
        ))}
      </div>
      <div className="flex overflow-x-auto sm:justify-center mt-10">
        <UserArticlePaginator userId={session?.user?.id} />
      </div>
    </>
  );
}

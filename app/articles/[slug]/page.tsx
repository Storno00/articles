import Article from '@/app/_components/Article';
import prisma from '@/app/_db/prisma';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/_lib/authOptions';
import CommentSection from '@/app/_components/CommentSection';

export default async function ArticlePage(context) {
  const { slug } = context.params;

  const session = await getServerSession(authOptions);

  const getArticleBySlug = async () => {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        User: true,
        comments: {
          include: { User: { select: { image: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    return article;
  };

  const article = await getArticleBySlug();

  if (!article) throw new Error('Article does not exist');

  if (!article.isPublished && article.userId !== session?.user?.id) {
    throw new Error('Article does not exist');
  }

  return (
    <>
      <Article
        title={article.title}
        headline={article.headline}
        body={article.body}
        cover={article.coverImageUrl}
        views={article.views}
        likes={article.likes}
        authorName={article.User?.name}
        authorProfileUrl={article.User?.image}
      />
      <CommentSection
        userId={session?.user.id}
        userImage={session?.user?.image}
        articleId={article?.id}
        comments={article?.comments}
      />
    </>
  );
}

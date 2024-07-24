'use server';

import prisma from '../_db/prisma';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import { redirect } from 'next/navigation';

type ArticleReq = {
  articleId: string;
  title: string;
  headline: string;
  coverImageId: string;
  coverImageUrl: string;
  body: string;
  articleImages: CloudinaryImageObj[];
  sessionUser: SessionUser;
  isPublished: boolean;
};

export async function getUserArticleTotalPages(
  userId: string,
  search: string | undefined
) {
  const numberOfArticles = await prisma.article.count({
    where: {
      userId,
      title: {
        contains: search,
        mode: 'insensitive',
      },
    },
  });

  return Math.ceil(numberOfArticles / 10);
}

export async function togglePublishment(
  articleId: string,
  isPublished: boolean
) {
  await prisma.article.update({
    where: { id: articleId },
    data: {
      isPublished,
    },
  });

  return;
}

export async function createArticle(data: ArticleReq) {
  const dbUser = await prisma.user.findUnique({
    where: { email: data.sessionUser.email },
  });

  let slug = slugify(data.title, { lower: true, remove: /[*+~.()'"!:@?,]/g });

  const articleWithSameSlug = await prisma.article.findUnique({
    where: { slug },
  });

  if (articleWithSameSlug) {
    slug += `-${nanoid()}`;
  }

  const article = await prisma.article.create({
    data: {
      title: data.title,
      headline: data.headline,
      body: data.body,
      slug,
      coverImageId: data.coverImageId || null,
      coverImageUrl: data.coverImageId ? data.coverImageUrl : null,
      userId: dbUser?.id,
      isPublished: data.isPublished,
    },
  });

  const articleImagesWithArticleId = data.articleImages.map((element) => ({
    ...element,
    articleId: article.id,
  }));

  await prisma.image.createMany({
    data: articleImagesWithArticleId,
  });

  redirect(`/user/article/${article.id}/edit`);
}

export async function updateArticle(data: ArticleReq) {
  const dbUser = await prisma.user.findUnique({
    where: { email: data.sessionUser.email },
  });

  await prisma.article.update({
    where: { id: data.articleId },
    data: {
      title: data.title,
      headline: data.headline,
      body: data.body,
      coverImageId: data.coverImageId || null,
      coverImageUrl: data.coverImageId ? data.coverImageUrl : null,
      userId: dbUser?.id,
      isPublished: data.isPublished,
    },
  });

  const articleImagesWithArticleId = data.articleImages.map((element) => ({
    ...element,
    articleId: data.articleId,
  }));

  prisma.$transaction([
    prisma.image.deleteMany({ where: { articleId: data.articleId } }),
    prisma.image.createMany({
      data: articleImagesWithArticleId,
    }),
  ]);

  return;
}

export async function deleteArticle(articleId: string) {
  await prisma.article.delete({
    where: { id: articleId },
  });

  return;
}

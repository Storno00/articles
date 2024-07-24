import { DateTime } from 'next-auth/providers/kakao';
import { ARTICLE_COVER_IMAGE } from '../_constants/images';
import DropdownEditMenu from './DropdownEditMenu';
import { FaEye, FaHeart, FaGlobe } from 'react-icons/fa';
import { Image } from '@prisma/client';

type Props = {
  article: {
    id: string;
    slug: string;
    title: string;
    headline: string;
    coverImageId: string;
    coverImageUrl: string;
    isPublished: boolean;
    views: number;
    likes: number;
    createdAt: DateTime;
    updatedAt: DateTime;
    images: Image[];
  };
};

export default function UserArticleItem({ article }: Props) {
  return (
    <div className="flex items-center justify-between gap-5 border border-gray-400 overflow-hidden rounded-md pr-4">
      <img
        src={article.coverImageUrl || ARTICLE_COVER_IMAGE}
        alt="article cover image"
        className="w-40 h-40 object-cover"
      />
      <div className="w-3/4">
        <h2 className="text-lg font-bold">{article.title}</h2>
        <p>{article.headline}</p>
        <div className="flex gap-4 mt-2">
          <span className="flex items-center justify-center gap-2 text-md text-purple-500">
            <FaEye />
            {String(article?.views)}
          </span>
          <span className="flex items-center justify-center gap-2 text-md text-red-500">
            <FaHeart />
            {String(article?.likes)}
          </span>
          <span
            className={`flex items-center justify-center gap-2 text-md ${
              article?.isPublished ? 'text-green-500' : 'text-orange-500'
            }`}
          >
            <FaGlobe />
            {article?.isPublished ? 'Published' : 'Not published'}
          </span>
        </div>
      </div>
      <DropdownEditMenu
        id={article?.id}
        slug={article?.slug}
        isPublished={article.isPublished}
        coverImageId={article.coverImageId}
        articleImages={article.images}
      />
    </div>
  );
}

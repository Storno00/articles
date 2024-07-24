import Image from 'next/image';
import { FaEye, FaHeart } from 'react-icons/fa';

type Props = {
  title?: string;
  headline?: string;
  cover?: string;
  body: string;
  views?: number;
  likes?: number;
  authorName?: string;
  authorProfileUrl?: string;
};

export default function Article({
  title = 'Title of the blogpost...',
  headline = 'Headline of the blogpost...',
  cover = 'https://res.cloudinary.com/dooqcjpph/image/upload/v1720346848/Contact%20App/default-banner_unl2vh.jpg',
  body,
  views = 0,
  likes = 0,
  authorName = 'Author Name',
  authorProfileUrl = 'https://res.cloudinary.com/dooqcjpph/image/upload/v1657525303/Contact%20App/default_ug1ogk.png',
}: Props) {
  return (
    <article>
      <section
        style={{
          background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 100%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.5) 100%), url('${
            cover ||
            'https://res.cloudinary.com/dooqcjpph/image/upload/v1720346848/Contact%20App/default-banner_unl2vh.jpg'
          }') no-repeat`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        className="h-[35vh] p-6 flex items-center justify-between gap-10 text-white object-cover"
      >
        <div className="self-end">
          <h1 className="mb-3 text-4xl font-bold">
            {title || 'Title of the blogpost...'}
          </h1>
          <p className="text-md">{headline || 'Headline of the blogpost...'}</p>
        </div>
        <div className="w-64 self-stretch flex flex-col items-end justify-between">
          <div className="flex items-end justify-between gap-5">
            <span className="flex items-center justify-center gap-2 text-lg">
              <FaEye />
              {String(views)}
            </span>
            <span className="flex items-center justify-center gap-2 text-lg">
              <FaHeart />
              {String(likes)}
            </span>
          </div>
          <div className="h-10 flex items-center justify-center gap-2">
            <Image
              src={authorProfileUrl}
              alt="author profile picture"
              className="rounded-full border border-white"
              width={40}
              height={40}
            />
            <span>{authorName}</span>
          </div>
        </div>
      </section>
      <section className="article-body px-6" dangerouslySetInnerHTML={{ __html: body }} />
    </article>
  );
}

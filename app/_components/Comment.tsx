import Image from 'next/image';
import timeAgo from '../_lib/timeAgo';
import { CommentWithUserNameAndImage } from '../_types/global';

type Props = {
  comment: CommentWithUserNameAndImage;
};

export default function Comment({ comment }: Props) {
  return (
    <div className="flex items-start justify-start gap-2">
      <Image
        src={comment.User?.image}
        alt="author profile picture"
        className="h-full rounded-full border border-white"
        width={50}
        height={50}
      />
      <div>
        <div className="flex items-center justify-start gap-2">
          <span className="font-semibold text-lg">{comment.User?.name}</span>
          <span className="text-gray-600">{timeAgo(comment.createdAt)}</span>
        </div>
        <span>{comment.body}</span>
      </div>
    </div>
  );
}

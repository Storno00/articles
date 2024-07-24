import Comment from './Comment';
import { CommentWithUserNameAndImage } from '../_types/global';

type Props = {
  comments: CommentWithUserNameAndImage[];
};

export default function CommentList({ comments }: Props) {
  return (
    <div className="flex flex-col gap-6 mt-8">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

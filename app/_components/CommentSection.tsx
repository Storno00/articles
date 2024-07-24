'use server';

import WriteComment from './WriteComment';
import CommentList from './CommentList';
import { CommentWithUserNameAndImage } from '../_types/global';

type Props = {
  userId: string | undefined;
  userImage: string | undefined;
  articleId: string;
  comments: CommentWithUserNameAndImage[];
};

export default async function CommentSection({
  userId,
  userImage,
  articleId,
  comments,
}: Props) {
  return (
    <section className="border-t-2 border-gray-400 mt-10 pt-10">
      <h2 className="text-2xl font-bold">Comments ({ comments.length })</h2>
      <WriteComment userId={userId} userImage={userImage} articleId={articleId} />
      <CommentList comments={comments} />
    </section>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button, Textarea, Spinner } from 'flowbite-react';
import { FormEvent, useState, useTransition } from 'react';
import { createComment } from '../_actions/comment';
import { useRouter } from 'next/navigation';
import { LogInToComment } from './LogInToComment';

type Props = {
  userId: string | undefined;
  userImage: string | undefined;
  articleId: string;
};

export default function WriteComment({ userId, userImage, articleId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [commentBody, setCommentBody] = useState('');

  const onSendComment = async (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      if (userId) {
        await createComment(userId, articleId, commentBody);
        setCommentBody('');
        router.refresh();
      }
    });
  };

  return (
    <div className="mt-4">
      {!userId && (
        <LogInToComment />
      )}
      {userId && (
        <div className="flex items-start justify-start gap-2">
          <Image
            src={userImage}
            alt="author profile picture"
            className="h-full rounded-full border border-white"
            width={50}
            height={50}
          />
          <form className="w-full flex gap-2" onSubmit={onSendComment}>
            <Textarea
              id="comment"
              placeholder="Write down your thoughts..."
              rows={2}
              onChange={(e) => setCommentBody(e.target.value)}
              value={commentBody}
              disabled={isPending}
            />
            <Button
              className="self-start"
              type="submit"
              disabled={!commentBody}
            >
              {isPending ? (
                <Spinner aria-label="Spinner button example" size="sm" />
              ) : (
                'Send'
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

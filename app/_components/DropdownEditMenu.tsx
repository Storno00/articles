'use client';

import { Dropdown, Spinner } from 'flowbite-react';
import { MdDelete } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { BiSolidPencil } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import { MdUnpublished } from 'react-icons/md';
import { MdPublishedWithChanges } from 'react-icons/md';
import { deleteArticle, togglePublishment } from '../_actions/article';
import { useTransition } from 'react';
import { Image } from '@prisma/client';
import { deleteImage } from '../_lib/cloudinary';

type Props = {
  id: string;
  slug: string;
  isPublished: boolean;
  coverImageId: string;
  articleImages: Image[];
};

export default function DropdownEditMenu({
  id,
  slug,
  isPublished,
  coverImageId,
  articleImages,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onTogglePublishment = async () => {
    await togglePublishment(id, !isPublished);
    router.refresh();
  };

  const onRemoveArticle = () => {
    startTransition(async () => {
      await deleteImage(coverImageId);
      articleImages.forEach(async (image) => {
        await deleteImage(image.id);
      });
      await deleteArticle(id);
      router.refresh();
    });
  };

  return (
    <Dropdown label="Options">
      <Dropdown.Item
        icon={FaEye}
        onClick={() => router.push(`/articles/${slug}`)}
      >
        Preview
      </Dropdown.Item>
      <Dropdown.Item
        icon={isPublished ? MdUnpublished : MdPublishedWithChanges}
        onClick={onTogglePublishment}
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Dropdown.Item>
      <Dropdown.Item
        icon={BiSolidPencil}
        onClick={() => router.push(`/user/article/${id}/edit`)}
      >
        Edit
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item
        icon={MdDelete}
        className="text-red-600"
        onClick={onRemoveArticle}
      >
        {!isPending ? (
          'Delete'
        ) : (
          <Spinner aria-label="Default status example" />
        )}
      </Dropdown.Item>
    </Dropdown>
  );
}

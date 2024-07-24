'use client';

import { useState, useTransition } from 'react';
import QuillEditor from './QuillEditor';
import { Button } from 'flowbite-react';
import { ToggleSwitch, FileInput, TextInput, Label } from 'flowbite-react';
import { ARTICLE_COVER_IMAGE } from '../_constants/images';
import { deleteImage, uploadImage } from '../_lib/cloudinary';
import { createArticle, updateArticle } from '../_actions/article';
import { useSession } from 'next-auth/react';
import { Prisma } from '@prisma/client';
import Article from './Article';
import extractImageUrls from '../_lib/extractImageUrls';
import removeUnusedArticleImages from '../_lib/removeUnusedArticleImages';
import { FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

type ArticleWithImages = Prisma.ArticleGetPayload<{
  include: {
    images: true;
    User: true;
  };
}>;

export default function CreateArticleForm({
  article,
}: {
  article: ArticleWithImages;
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition();
  const session = useSession();

  const [isArticlePublished, setIsArticlePublished] = useState(
    article?.isPublished || false
  );
  const [isReaderViewShowing, setIsReaderViewShowing] = useState(false);
  const [articleBody, setArticleBody] = useState(article?.body || '');
  const [articleImages, setArticleImages] = useState(article?.images || []);
  const [formData, setFormData] = useState({
    title: article?.title || '',
    headline: article?.headline || '',
    coverImageFile: { name: '' },
  });
  const [coverImage, setCoverImage] = useState({
    id: article?.coverImageId || null,
    url: article?.coverImageUrl || ARTICLE_COVER_IMAGE,
  });

  const saveArticle = async (isPublished: boolean) => {
    setIsArticlePublished(isPublished);
    setIsReaderViewShowing(false);
    startTransition(async () => {
      let newCoverImage = {
        id: article?.coverImageId || null,
        url: article?.coverImageUrl || ARTICLE_COVER_IMAGE,
      };

      if (coverImage.id && formData.coverImageFile.name) {
        await deleteImage(coverImage.id);
      }
      if (formData.coverImageFile.name) {
        const result = await uploadImage(formData.coverImageFile);
        newCoverImage = { id: result?.id, url: result?.url };
        setCoverImage(newCoverImage);
      }
      setFormData({
        ...formData,
        coverImageFile: { name: '' },
      });

      const bodyImageUrls = extractImageUrls(articleBody);
      const usedImageUrls = removeUnusedArticleImages(
        bodyImageUrls,
        articleImages
      );

      const data = {
        articleId: article?.id || '',
        title: formData.title,
        headline: formData.headline,
        coverImageId: newCoverImage.id,
        coverImageUrl: newCoverImage.url,
        body: articleBody,
        articleImages: usedImageUrls,
        sessionUser: session.data.user,
        isPublished,
      };

      if (article?.id) await updateArticle(data);
      if (!article?.id) await createArticle(data);
    });
  };

  const handleFileChange = async (e: InputEvent) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, coverImageFile: file });
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2 -translate-y-10">
        <ToggleSwitch
          checked={isReaderViewShowing}
          label="Reader view"
          onChange={setIsReaderViewShowing}
        />
        <Button color="failure" onClick={() => router.push('/user/article')}>Cancel</Button>
        <Button
          color="success"
          onClick={() => saveArticle(false)}
          isProcessing={isPending}
          disabled={isPending}
        >
          Save
        </Button>
        {!isArticlePublished && (
          <Button color="success" onClick={() => saveArticle(true)}>
            Save & Publish
          </Button>
        )}
        {isArticlePublished && (
          <Button color="success" disabled className="">
            <FaCheck className="translate-y-[2.5px] mr-2" />
            Published
          </Button>
        )}
      </div>
      {!isReaderViewShowing && (
        <form>
          <div className="mb-2">
            <div className="mb-2 block">
              <Label htmlFor="title" value="Title" />
            </div>
            <TextInput
              id="title"
              type="text"
              placeholder="Title of the blogpost..."
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              value={formData.title}
            />
          </div>
          <div className="mb-2">
            <div className="mb-2 block">
              <Label htmlFor="headline" value="Headline" />
            </div>
            <TextInput
              id="headline"
              type="text"
              placeholder="Headline of the blogpost..."
              onChange={(e) =>
                setFormData({ ...formData, headline: e.target.value })
              }
              value={formData.headline}
            />
          </div>
          <div className="mb-2">
            <div className="mb-2 block">
              <Label htmlFor="file-upload" value="Cover image" />
            </div>
            <FileInput id="file-upload" onChange={handleFileChange} />
          </div>
          <QuillEditor
            articleBody={articleBody}
            setArticleBody={setArticleBody}
            articleImages={articleImages}
            setArticleImages={setArticleImages}
          />
        </form>
      )}
      {isReaderViewShowing && (
        <Article
          title={formData.title}
          headline={formData.headline}
          cover={
            formData.coverImageFile.name
              ? URL.createObjectURL(formData.coverImageFile)
              : coverImage.url
          }
          body={articleBody}
          authorName={article?.User?.name || 'Author Name'}
          authorProfileUrl={
            article?.User?.image ||
            'https://res.cloudinary.com/dooqcjpph/image/upload/v1657525303/Contact%20App/default_ug1ogk.png'
          }
          likes={article?.likes || 0}
          views={article?.views || 0}
        />
      )}
    </>
  );
}

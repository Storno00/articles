import { CloudinaryImageObj } from '../_types/global';
import { deleteImage } from './cloudinary';

export default function removeUnusedArticleImages(
  bodyUrls: string[],
  allUrls: CloudinaryImageObj[]
) {
  const usedImages = allUrls.filter((element) => bodyUrls.includes(element.url));
  const unusedImages = allUrls.filter(
    (element) => !bodyUrls.includes(element.url)
  );

  unusedImages.forEach(async (unusedImage) => {
    await deleteImage(unusedImage.id);
  });

  return usedImages;
}

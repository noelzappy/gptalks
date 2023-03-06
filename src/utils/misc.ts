import { Config } from '@/config';

export const getImageUrl = (image: string) => {
  const isUrl = image.startsWith('http') || image.startsWith('https');
  if (isUrl) {
    return image;
  }
  return `${Config.BASE_URL}/${image}`;
};

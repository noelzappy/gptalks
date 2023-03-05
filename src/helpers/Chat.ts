import { Config } from '@/config';
import { ImageData } from 'types/chat';

export function generateImagToTextBody(image: ImageData) {
  const body = {
    requests: [
      {
        image: {
          content: image.base64,
        },
        features: [
          {
            type: 'TEXT_DETECTION',
            maxResults: 1,
          },
        ],
      },
    ],
  };
  return body;
}

export async function callGoogleVisionAsync(image: ImageData) {
  const body = generateImagToTextBody(image);
  const response = await fetch(Config.GC_API_URL + Config.GC_API_KEY, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();

  return result;
}

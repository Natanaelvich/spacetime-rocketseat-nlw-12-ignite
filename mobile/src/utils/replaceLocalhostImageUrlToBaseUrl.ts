import { API_URL } from '@env'

export default function replaceLocalhostImageUrlToBaseUrl(imageUrl: string) {
  return imageUrl.replace('http://localhost:3333', API_URL)
}

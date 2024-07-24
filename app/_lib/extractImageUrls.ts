export default function extractImageUrls(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const imgTags = doc.querySelectorAll('img');
  const urls = Array.from(imgTags).map((img) => img.src);
  return urls;
}

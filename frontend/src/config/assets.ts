export const CDN_BASE = 'https://web-greengas.oss-cn-qingdao.aliyuncs.com/resources';

export function cdnUrl(category: string, filename: string): string {
  return `${CDN_BASE}/${category}/${filename}`;
}

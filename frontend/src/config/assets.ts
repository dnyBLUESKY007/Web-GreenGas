export const CDN_BASE = 'https://web-greengas.oss-cn-qingdao.aliyuncs.com/resources';

export function cdnUrl(category: string, filename: string): string {
  return `${CDN_BASE}/${category}/${filename}`;
}

/** Apply CDN background image to an inner-page `.page-header`. */
export function setPageHeaderBackground(header: HTMLElement, filename: string): void {
  header.classList.add('page-header--has-bg');
  header.style.setProperty('--page-header-bg', `url("${cdnUrl('page-headers', filename)}")`);
}

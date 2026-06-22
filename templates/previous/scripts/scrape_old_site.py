#!/usr/bin/env python3
"""Scrape content from the old cn.greennb.com website into markdown."""

from __future__ import annotations

import hashlib
import json
import re
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup, NavigableString, Tag

BASE_URL = "https://cn.greennb.com"
OUTPUT_ROOT = Path(__file__).resolve().parent.parent / "template" / "previous"
IMAGES_DIR = OUTPUT_ROOT / "images"
RAW_HTML_DIR = OUTPUT_ROOT / "_raw_html"

REQUEST_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
}

LAZYLOAD_MARKERS = ("lazyload-loading.gif", "data:image/")
IMAGE_SKIP_PATTERNS = (
    ".ico",
    "weixinerweima",
    "crop_1762840945937",
    "/static/assets/",
)


@dataclass
class PageSpec:
    title: str
    url: str
    category: str
    filename: str
    also_in: list[str] = field(default_factory=list)


PAGES: list[PageSpec] = [
    PageSpec("发展历程", f"{BASE_URL}/aboutus.html", "company", "发展历程.md"),
    PageSpec("公司团队", f"{BASE_URL}/190815131919.html", "company", "公司团队.md"),
    PageSpec(
        "辽宁港口控股电气室制冷系统升级",
        f"{BASE_URL}/id40993575.html",
        "cases",
        "辽宁港口控股电气室制冷系统升级.md",
    ),
    PageSpec(
        "浩达工具制造公司恒温恒湿空调",
        f"{BASE_URL}/thermostatic-and-humidistatic-air-condition.html",
        "cases",
        "浩达工具恒温恒湿空调.md",
    ),
    PageSpec(
        "粮储专用整体式空调机组",
        f"{BASE_URL}/id3215182.html",
        "cases",
        "粮储专用整体式空调机组.md",
    ),
    PageSpec(
        "热泵型一体式空调机",
        f"{BASE_URL}/rebengxingyitishikongdiaoji.html",
        "cases",
        "热泵型一体式空调机.md",
    ),
    PageSpec(
        "整体式直膨机组",
        f"{BASE_URL}/id43837575.html",
        "cases",
        "整体式直膨机组.md",
    ),
    PageSpec(
        "澳大利亚昆士兰医疗研究学院",
        f"{BASE_URL}/id3326212.html",
        "cases",
        "澳大利亚昆士兰医疗研究学院.md",
    ),
    PageSpec(
        "格灵空调与南非客户共同研制3级制冷蒸发冷机组",
        f"{BASE_URL}/id3526212.html",
        "cases",
        "格灵空调与南非客户共同研制3级制冷蒸发冷机组.md",
        also_in=["news"],
    ),
    PageSpec(
        "国际形势见好澳洲市场回暖",
        f"{BASE_URL}/id3626212.html",
        "cases",
        "国际形势见好澳洲市场回暖.md",
    ),
    PageSpec(
        "热烈祝贺宁波格灵空调科技有限公司顺利获得ISO9001认证",
        f"{BASE_URL}/id40837575.html",
        "news",
        "ISO9001认证.md",
    ),
    PageSpec(
        "祝贺宁波格灵空调科技有限公司顺利通过现场检测取得CE认证",
        f"{BASE_URL}/zhuhewosichanpintongguobinghuodecerenzheng.html",
        "news",
        "CE认证.md",
    ),
    PageSpec(
        "格灵空调与您相约2019上海制冷展",
        f"{BASE_URL}/id3426212.html",
        "news",
        "2019上海制冷展.md",
        also_in=["cases"],
    ),
    PageSpec(
        "格灵空调捷报频传",
        f"{BASE_URL}/id3836212.html",
        "news",
        "格灵空调捷报频传.md",
    ),
    PageSpec(
        "格灵空调为新冠疫情防控添砖加瓦",
        f"{BASE_URL}/id3726212.html",
        "news",
        "格灵空调新冠疫情防控.md",
    ),
    PageSpec(
        "工业空调的特点",
        f"{BASE_URL}/id46737575.html",
        "news",
        "工业空调的特点.md",
    ),
]


@dataclass
class ScrapeResult:
    spec: PageSpec
    markdown_path: Path
    image_count: int
    summary: str
    title_on_page: str
    published_at: str
    error: Optional[str] = None


class OldSiteScraper:
    def __init__(self) -> None:
        self.session = requests.Session()
        self.session.headers.update(REQUEST_HEADERS)
        self.downloaded_images: dict[str, str] = {}

    def fetch_html(self, url: str) -> str:
        for attempt in range(3):
            try:
                response = self.session.get(url, timeout=45)
                response.raise_for_status()
                response.encoding = response.apparent_encoding or "utf-8"
                return response.text
            except requests.RequestException as exc:
                if attempt == 2:
                    raise
                time.sleep(2 * (attempt + 1))
                last_error = exc
        raise RuntimeError(f"Failed to fetch {url}: {last_error}")

    def should_skip_image(self, url: str) -> bool:
        return any(pattern in url for pattern in IMAGE_SKIP_PATTERNS)

    def resolve_image_url(self, raw_url: str, page_url: str) -> Optional[str]:
        if not raw_url:
            return None
        raw_url = raw_url.strip()
        if any(marker in raw_url for marker in LAZYLOAD_MARKERS):
            return None
        if self.should_skip_image(raw_url):
            return None
        if raw_url.startswith("//"):
            return f"https:{raw_url}"
        if raw_url.startswith("/"):
            return urljoin(BASE_URL, raw_url)
        if raw_url.startswith("http"):
            return raw_url
        return urljoin(page_url, raw_url)

    def pick_image_url(self, img: Tag, page_url: str) -> Optional[str]:
        for attr in ("data-original", "data-src", "data-lazy-src", "src"):
            candidate = self.resolve_image_url(img.get(attr, ""), page_url)
            if candidate:
                return candidate
        return None

    def sanitize_filename(self, url: str, index: int) -> str:
        parsed = urlparse(url)
        basename = Path(parsed.path).name or f"image-{index}"
        basename = re.sub(r"[^\w.\-]+", "_", basename)
        if not basename or basename == "_":
            digest = hashlib.md5(url.encode("utf-8")).hexdigest()[:10]
            basename = f"image-{digest}.jpg"
        return basename

    def download_image(self, url: str, page_slug: str, index: int) -> Optional[str]:
        if url in self.downloaded_images:
            return self.downloaded_images[url]

        filename = self.sanitize_filename(url, index)
        stem = Path(filename).stem
        suffix = Path(filename).suffix or ".jpg"
        local_name = f"{page_slug}_{index:02d}_{stem}{suffix}"
        local_path = IMAGES_DIR / local_name

        if not local_path.exists():
            try:
                response = self.session.get(url, timeout=45)
                response.raise_for_status()
                local_path.write_bytes(response.content)
            except requests.RequestException:
                return None

        rel_path = f"../images/{local_name}"
        self.downloaded_images[url] = rel_path
        return rel_path

    def clean_text(self, text: str) -> str:
        text = text.replace("\xa0", " ")
        text = re.sub(r"\s+", " ", text)
        return text.strip()

    def extract_metadata(self, soup: BeautifulSoup) -> tuple[str, str, str]:
        title = ""
        h1 = soup.select_one("h1")
        if h1:
            title = self.clean_text(h1.get_text(" ", strip=True))

        meta_text = ""
        meta_el = soup.select_one(".articledetail-title")
        if meta_el:
            meta_text = meta_el.get_text(" ", strip=True)

        if not title and meta_el:
            title = re.split(r"浏览数量", meta_text)[0].strip()

        published_at = ""
        author = ""
        match = re.search(r"发布时间[:：]\s*([0-9\-]+)", meta_text)
        if match:
            published_at = match.group(1)
        author_match = re.search(r"作者[:：]\s*([^发布]+)", meta_text)
        if author_match:
            author = self.clean_text(author_match.group(1))

        return title, published_at, author

    def is_boilerplate_text(self, text: str) -> bool:
        if len(text) < 40:
            return True
        boilerplate_markers = (
            "jenny@greennb.com",
            "0574-58220818",
            "服务当先",
            "品质卓越",
            "性价比高",
            "版权所有",
            "联系我们",
            "产品中心",
            "新闻动态",
        )
        return any(marker in text for marker in boilerplate_markers)

    def find_article_content(self, soup: BeautifulSoup) -> Optional[Tag]:
        content = soup.select_one(".articledetail-cont")
        if content:
            return content

        candidates: list[Tag] = []
        for widget in soup.select(".sitewidget-text"):
            text = widget.get_text("\n", strip=True)
            if not self.is_boilerplate_text(text):
                candidates.append(widget)

        if not candidates:
            return None

        return max(candidates, key=lambda node: len(node.get_text("\n", strip=True)))

    def find_company_images(self, soup: BeautifulSoup, content: Tag) -> list[str]:
        urls: list[str] = []
        seen: set[str] = set()
        content_root = content.find_parent(class_="outerContainer") or content

        for img in content_root.select("img"):
            image_url = self.pick_image_url(img, BASE_URL)
            if image_url and image_url not in seen:
                seen.add(image_url)
                urls.append(image_url)

        for match in re.finditer(
            r"//[a-z]+orwxhijomlp5p\.ldycdn\.com/cloud/[^\"'\s<>]+",
            str(content_root),
        ):
            image_url = f"https:{match.group(0)}"
            if self.should_skip_image(image_url):
                continue
            if image_url not in seen:
                seen.add(image_url)
                urls.append(image_url)

        return urls

    def node_to_markdown(
        self,
        node: Tag | NavigableString,
        page_url: str,
        page_slug: str,
        image_index: int,
    ) -> tuple[str, int]:
        if isinstance(node, NavigableString):
            return str(node), image_index

        if not isinstance(node, Tag):
            return "", image_index

        name = node.name.lower()
        if name in {"script", "style", "noscript"}:
            return "", image_index

        if name == "br":
            return "\n", image_index

        if name == "img":
            image_url = self.pick_image_url(node, page_url)
            if not image_url:
                return "", image_index
            local_path = self.download_image(image_url, page_slug, image_index)
            image_index += 1
            if not local_path:
                return "", image_index
            alt = self.clean_text(node.get("alt") or node.get("title") or "image")
            return f"![{alt}]({local_path})\n\n", image_index

        if name in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            level = int(name[1])
            inner, image_index = self.children_to_markdown(node, page_url, page_slug, image_index)
            text = self.clean_text(inner)
            if text:
                return f"{'#' * level} {text}\n\n", image_index
            return "", image_index

        if name in {"ul", "ol"}:
            lines: list[str] = []
            for child in node.find_all("li", recursive=False):
                item_text, image_index = self.children_to_markdown(
                    child, page_url, page_slug, image_index
                )
                item_text = self.clean_text(item_text)
                if item_text:
                    prefix = "- " if name == "ul" else "1. "
                    lines.append(f"{prefix}{item_text}")
            if lines:
                return "\n".join(lines) + "\n\n", image_index
            return "", image_index

        if name == "p":
            inner, image_index = self.children_to_markdown(node, page_url, page_slug, image_index)
            inner = inner.strip()
            if inner:
                return f"{inner}\n\n", image_index
            return "", image_index

        if name in {"strong", "b", "em", "i", "span", "div", "section", "article"}:
            return self.children_to_markdown(node, page_url, page_slug, image_index)

        if name == "a":
            inner, image_index = self.children_to_markdown(node, page_url, page_slug, image_index)
            href = node.get("href", "")
            text = self.clean_text(inner)
            if text and href and not href.startswith("javascript"):
                return f"[{text}]({href})", image_index
            return inner, image_index

        return self.children_to_markdown(node, page_url, page_slug, image_index)

    def children_to_markdown(
        self,
        node: Tag,
        page_url: str,
        page_slug: str,
        image_index: int,
    ) -> tuple[str, int]:
        parts: list[str] = []
        for child in node.children:
            chunk, image_index = self.node_to_markdown(child, page_url, page_slug, image_index)
            parts.append(chunk)
        return "".join(parts), image_index

    def html_to_markdown(
        self,
        content: Tag,
        page_url: str,
        page_slug: str,
        extra_image_urls: Optional[list[str]] = None,
    ) -> tuple[str, int]:
        body, image_index = self.children_to_markdown(content, page_url, page_slug, 0)
        body = re.sub(r"\n{3,}", "\n\n", body).strip()

        if extra_image_urls:
            extra_blocks: list[str] = []
            for image_url in extra_image_urls:
                local_path = self.download_image(image_url, page_slug, image_index)
                image_index += 1
                if local_path:
                    extra_blocks.append(f"![image]({local_path})")
            if extra_blocks:
                body = f"{body}\n\n" + "\n\n".join(extra_blocks)

        return body, image_index

    def normalize_markdown(self, markdown: str) -> str:
        lines = [line.lstrip() for line in markdown.splitlines()]
        return re.sub(r"\n{3,}", "\n\n", "\n".join(lines)).strip() + "\n"

    def summarize(self, text: str, fallback_title: str) -> str:
        plain = re.sub(r"!\[[^\]]*\]\([^)]+\)", "", text)
        plain = re.sub(r"[#>*\[\]()]", "", plain)
        plain = re.sub(r"\s+", " ", plain).strip()
        if not plain:
            return f"页面《{fallback_title}》的主要内容，用于后续同步到新官网。"

        sentences = re.split(r"(?<=[。！？!?])\s*", plain)
        summary_parts = [sentence.strip() for sentence in sentences if len(sentence.strip()) >= 8]
        if not summary_parts:
            return plain[:120]
        return " ".join(summary_parts[:2])

    def page_slug(self, spec: PageSpec) -> str:
        return Path(spec.filename).stem

    def scrape_page(self, spec: PageSpec) -> ScrapeResult:
        category_dir = OUTPUT_ROOT / spec.category
        category_dir.mkdir(parents=True, exist_ok=True)
        markdown_path = category_dir / spec.filename
        page_slug = self.page_slug(spec)

        try:
            html = self.fetch_html(spec.url)
            RAW_HTML_DIR.mkdir(parents=True, exist_ok=True)
            raw_path = RAW_HTML_DIR / f"{page_slug}.html"
            raw_path.write_text(html, encoding="utf-8")

            soup = BeautifulSoup(html, "lxml")
            title_on_page, published_at, author = self.extract_metadata(soup)
            display_title = spec.title
            page_title = title_on_page if title_on_page and title_on_page != spec.title else ""

            content = self.find_article_content(soup)
            if content is None:
                raise ValueError("Could not locate main content on page")

            extra_images = (
                self.find_company_images(soup, content)
                if spec.category == "company"
                else None
            )
            body, image_count = self.html_to_markdown(
                content,
                spec.url,
                page_slug,
                extra_images,
            )

            front_matter = [
                "---",
                f'title: "{display_title}"',
                f"source_url: {spec.url}",
                f'category: "{spec.category}"',
            ]
            if page_title:
                front_matter.append(f'page_title: "{page_title}"')
            if published_at:
                front_matter.append(f"published_at: {published_at}")
            if author:
                front_matter.append(f'author: "{author}"')
            if spec.also_in:
                front_matter.append(f"also_in: {json.dumps(spec.also_in, ensure_ascii=False)}")
            front_matter.append("---\n")

            markdown = "\n".join(front_matter)
            markdown += f"# {display_title}\n\n"
            if published_at or author:
                meta_bits = []
                if published_at:
                    meta_bits.append(f"发布时间：{published_at}")
                if author:
                    meta_bits.append(f"作者：{author}")
                markdown += f"> {' | '.join(meta_bits)}\n\n"
            markdown += body + "\n"
            markdown = self.normalize_markdown(markdown)

            markdown_path.write_text(markdown, encoding="utf-8")
            summary = self.summarize(body, display_title)

            return ScrapeResult(
                spec=spec,
                markdown_path=markdown_path,
                image_count=image_count,
                summary=summary,
                title_on_page=display_title,
                published_at=published_at,
            )
        except Exception as exc:  # noqa: BLE001 - collect per-page failures
            return ScrapeResult(
                spec=spec,
                markdown_path=markdown_path,
                image_count=0,
                summary="",
                title_on_page=spec.title,
                published_at="",
                error=str(exc),
            )

    def build_readme(self, results: list[ScrapeResult]) -> None:
        success = [result for result in results if not result.error]
        failed = [result for result in results if result.error]

        lines = [
            "# 旧官网内容归档（cn.greennb.com）",
            "",
            "本目录保存自 **宁波格灵空调科技有限公司** 旧中文官网（`https://cn.greennb.com`）爬取的正文、图片与元数据，供后续同步到 GREENGAS 新官网使用。",
            "",
            "## 背景说明",
            "",
            "GREENGAS（宁波格灵空调科技有限公司）此前运营独立中文官网，包含公司简介、工程案例、产品新闻等内容。当前仓库正在建设面向北美工业客户的新版企业站（见项目根目录 [README.md](../../README.md)）。本归档用于保留旧站有价值的内容资产，避免迁移过程中信息丢失。",
            "",
            "## 爬取信息",
            "",
            f"- **来源站点：** {BASE_URL}",
            f"- **爬取时间：** {time.strftime('%Y-%m-%d %H:%M:%S')}",
            "- **爬取脚本：** [`scripts/scrape_old_site.py`](../../scripts/scrape_old_site.py)",
            "- **输出格式：** Markdown（含 YAML front matter）",
            f"- **页面数量：** {len(success)} 成功 / {len(failed)} 失败",
            f"- **图片目录：** [`images/`](./images/)",
            "",
            "## 内容提取规则",
            "",
            "- 文章页：提取 `.articledetail-cont` 内正文，忽略导航、侧栏、页脚与分享组件。",
            "- 公司页：提取 `.sitewidget-text` 中有实质内容的文本块，并下载正文相关图片。",
            "- 图片：优先使用 `data-original` 真实地址，跳过 lazyload 占位图。",
            "- 重复 URL（同时出现在工程案例与新闻列表）仅爬取一次，在 front matter 中用 `also_in` 标注。",
            "",
            "## 目录结构",
            "",
            "```text",
            "template/previous/",
            "├── README.md",
            "├── company/     # 公司介绍",
            "├── cases/       # 工程案例",
            "├── news/        # 新闻与认证",
            "├── images/      # 下载的图片",
            "└── _raw_html/   # 原始 HTML 备份",
            "```",
            "",
            "## 页面索引",
            "",
            "| 分类 | 标题 | 源链接 | 本地文件 | 内容摘要 |",
            "| --- | --- | --- | --- | --- |",
        ]

        category_labels = {
            "company": "公司",
            "cases": "工程案例",
            "news": "新闻",
        }

        for result in success:
            spec = result.spec
            rel_path = result.markdown_path.relative_to(OUTPUT_ROOT).as_posix()
            category = category_labels.get(spec.category, spec.category)
            if spec.also_in:
                category = f"{category}（亦见：{', '.join(spec.also_in)}）"
            summary = result.summary.replace("|", "\\|")
            lines.append(
                f"| {category} | {spec.title} | {spec.url} | [{rel_path}](./{rel_path}) | {summary} |"
            )

        if failed:
            lines.extend(["", "## 失败页面", ""])
            for result in failed:
                lines.append(f"- **{result.spec.title}** ({result.spec.url}): {result.error}")

        readme_path = OUTPUT_ROOT / "README.md"
        readme_path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    def run(self) -> list[ScrapeResult]:
        OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
        IMAGES_DIR.mkdir(parents=True, exist_ok=True)

        results: list[ScrapeResult] = []
        for index, spec in enumerate(PAGES, start=1):
            print(f"[{index}/{len(PAGES)}] Scraping: {spec.title}")
            result = self.scrape_page(spec)
            if result.error:
                print(f"  ERROR: {result.error}")
            else:
                print(
                    f"  OK -> {result.markdown_path.relative_to(OUTPUT_ROOT)} "
                    f"({result.image_count} images)"
                )
            results.append(result)
            time.sleep(0.8)

        self.build_readme(results)
        return results


def main() -> None:
    scraper = OldSiteScraper()
    results = scraper.run()
    failed = [result for result in results if result.error]
    if failed:
        raise SystemExit(f"Scraping completed with {len(failed)} failure(s).")
    print("Scraping completed successfully.")


if __name__ == "__main__":
    main()

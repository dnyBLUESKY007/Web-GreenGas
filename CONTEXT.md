# Domain Context

## Company

**GREENGAS 格灵空调**
: The public bilingual brand name used in brand-facing website copy.

**格灵空调**
: The browser-tab title used consistently by every website entry point.

**宁波格灵空调科技有限公司**
: The company's full Chinese legal and descriptive name. Use it in company-profile copy, footer ownership text, and formal contact information where appropriate.

## Website Sections

**Product Navigation（产品导航）**
: The product discovery area. It organizes product series, product cards, and a reusable product-detail structure. It is not an automated equipment-selection tool.

**Industry Application（行业应用）**
: A description of cooling needs, recommended equipment types, and relevant experience for a particular industry or operating environment.

**Technical Support（技术支持）**
: Public technical manuals, product samples, installation guidance, maintenance information, pre-sales selection material, and after-sales support information.

**Case Center（案例中心）**
: The map, list, filters, and detail pages used to present customer projects and market coverage.

**News Center（新闻中心）**
: Company and industry news migrated from approved GREENGAS sources and displayed as categorized list and detail content.

**Contact Page（联系我们）**
: The combined FAQ and contact destination. FAQ appears before approved direct contact information; the stakeholder cancelled the online message form on 2026-07-31.

## Content Status

**Verified Content（已核实内容）**
: Content supported by the current stakeholder instruction, an approved formal source file, or the official GREENGAS legacy website, in that priority order.

**Example Placeholder（示例占位）**
: Publicly visible example content used to complete a page framework before final source material arrives. It must be visibly labelled “示例内容” or “待资料替换” and must not be presented as a verified fact.

**Pending Replacement（待资料替换）**
: A field, image, document, product, customer logo, case, or technical value that requires stakeholder-supplied material before it can become Verified Content.

**Public Material（可公开资料）**
: A source document explicitly accepted for website display or download. Presence in an archive alone does not establish permission to publish it.

**Stakeholder Case Package（甲方案例包）**
: A case archive deliberately organized by the stakeholder into project folders with companion descriptions and images. Once the stakeholder approves the package for publication, its folder grouping is authoritative evidence that the enclosed images belong to that project.

**Internal Provenance（内部溯源）**
: The repository-only record of where stakeholder material came from, how it was approved, and which public content consumes it. Internal provenance is not displayed on the public website.

**Public Source Link（公开来源链接）**
: An optional external URL that visitors can open to inspect a public source. A case without a valid external URL shows no source area; internal provenance must never be exposed as a substitute link or label.

## Case Geography

**Verified Case Point（已核实案例点）**
: A map point backed by an identifiable project and a sufficiently reliable country, province, or city location.

**Unmapped Verified Case（未绘制的已核实案例）**
: A verified case whose supplied material does not state a reliable location. It remains in the case list and details but does not receive a map point until the stakeholder confirms its geography.

**Market Coverage Point（市场覆盖点）**
: A map point backed only by a company statement that GREENGAS supplied equipment in that country or region. It must be visually distinct from a Verified Case Point.

## Source Priority

When sources conflict, use this order:

1. Decisions confirmed in the 2026-07-26 stakeholder session.
2. Approved formal material from the supplied archives.
3. The official GREENGAS legacy website.
4. The current website implementation.

Competitor and reference websites define presentation patterns only. Their copy, customer claims, images, and technical data are not GREENGAS source material.

## Local Material Locations

All local material below is excluded from Git by `ignored/` and is available inside Sandcastle at the same repository-relative paths.

- Supplied archives: `ignored/source-archives/`
  - `全资料.rar`
  - `案例.zip`
  - `网站素材.zip`
  - `web-greengas.zip`
  - `0730/补充.docx`、合作公司/新闻图片压缩包及备案、商务资质 PDF
- Extracted material: `ignored/extracted/<archive-name>/`
  - Cases and descriptions: `ignored/extracted/全资料/`
  - Product images, catalogues, and translations: `ignored/extracted/网站素材/`
  - Legacy repository snapshot and its processed assets: `ignored/extracted/web-greengas/`
- Legacy image working directories restored from the repository snapshot:
  - Originals: `ignored/extracted/web-greengas/ignored/resources_png/`
  - WebP output: `ignored/extracted/web-greengas/ignored/resources/`
  - Conversion tools: `ignored/extracted/web-greengas/ignored/libwebp/` and `ignored/extracted/web-greengas/ignored/scripts/`

Treat archives and extracted files as source material, not as permission to publish. Do not commit them or edit the files under `source-archives/`.

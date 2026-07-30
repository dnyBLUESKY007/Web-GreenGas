export type Locale = 'en' | 'zh' | 'ru';

export type Theme = 'emerald-lime' | 'emerald-steel' | 'emerald-gold';

export interface Certification {
  readonly id: string;
  readonly name: string;
  readonly name_zh?: string;
  readonly name_ru?: string;
  readonly image: string;
  readonly imageCategory: string;
  readonly validFrom: string;
  readonly validUntil: string;
  readonly validityStatus: 'historical';
  readonly publicationStatus?: 'approved' | 'pending-replacement';
}

export type PartnerContentStatus =
  | 'verified-content'
  | 'example-placeholder'
  | 'pending-replacement';

export interface PartnerLogo {
  readonly category: string;
  readonly filename: string;
  readonly alt: string;
  readonly alt_zh?: string;
  readonly alt_ru?: string;
}

export interface PartnerCompany {
  readonly id: string;
  readonly name: string;
  readonly name_zh?: string;
  readonly name_ru?: string;
  readonly status: PartnerContentStatus;
  readonly logo: PartnerLogo | null;
  readonly website?: string;
}

export interface PartnerGroup {
  readonly id: string;
  readonly name: string;
  readonly name_zh?: string;
  readonly name_ru?: string;
  readonly status: PartnerContentStatus;
  readonly partners: readonly PartnerCompany[];
}

export type ProductGroup =
  | 'custom'
  | 'industrial'
  | 'commercial-terminal'
  | 'central-host';

export type ContentStatus = 'verified-content' | 'example-placeholder' | 'pending-replacement';

export interface ProductFeature {
  readonly text: string;
  readonly text_zh?: string;
  readonly text_ru?: string;
}

export interface ProductParameter {
  readonly label: string;
  readonly label_zh?: string;
  readonly label_ru?: string;
  readonly value: string;
  readonly value_zh?: string;
  readonly value_ru?: string;
}

export interface ProductIndustry {
  readonly id: string;
  readonly name: string;
  readonly name_zh?: string;
  readonly name_ru?: string;
}

export interface ProductDownload {
  readonly title: string;
  readonly title_zh?: string;
  readonly title_ru?: string;
  readonly status: ContentStatus;
  readonly href?: string;
}

export interface Project {
  readonly id: string;
  readonly status: 'verified' | 'example';
  readonly sourceUrl?: string;
  readonly name: string;
  readonly name_zh?: string;
  readonly name_ru?: string;
  readonly industryKey: string;
  readonly industry: string;
  readonly industry_zh?: string;
  readonly industry_ru?: string;
  readonly regionKey: string;
  readonly location: string;
  readonly location_zh?: string;
  readonly location_ru?: string;
  readonly geography: {
    readonly countryCode?: string;
    readonly region?: string;
    readonly precision: 'country' | 'province' | 'unspecified';
  };
  readonly equipment: string;
  readonly equipment_zh?: string;
  readonly equipment_ru?: string;
  readonly summary: string;
  readonly summary_zh?: string;
  readonly summary_ru?: string;
  readonly context?: string;
  readonly context_zh?: string;
  readonly context_ru?: string;
  readonly challenge?: string;
  readonly challenge_zh?: string;
  readonly challenge_ru?: string;
  readonly response?: string;
  readonly response_zh?: string;
  readonly response_ru?: string;
  readonly result?: string;
  readonly result_zh?: string;
  readonly result_ru?: string;
  readonly images: readonly CaseImage[];
  readonly featuredImage?: CaseImage;
  readonly relatedCaseIds: readonly string[];
}

export interface CaseImage {
  readonly filename: string;
  readonly alt: string;
  readonly alt_zh?: string;
  readonly alt_ru?: string;
}

interface CaseMapPointBase {
  readonly id: string;
  readonly countryCode: string;
  readonly x: number;
  readonly y: number;
  readonly labelSide: 'above' | 'below' | 'left' | 'right';
}

export interface VerifiedCaseMapPoint extends CaseMapPointBase {
  readonly type: 'verified-case';
  readonly projectId: string;
  readonly label: string;
  readonly label_zh: string;
  readonly label_ru: string;
}

export interface MarketCoverageMapPoint extends CaseMapPointBase {
  readonly type: 'market-coverage';
  readonly scope: 'country';
  readonly source: 'formal-company-profile';
  readonly name: string;
  readonly name_zh: string;
  readonly name_ru: string;
}

export type CaseMapPoint = VerifiedCaseMapPoint | MarketCoverageMapPoint;

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly name_zh?: string;
  readonly name_ru?: string;
  readonly group: ProductGroup;
  readonly category?: string;
  readonly category_zh?: string;
  readonly category_ru?: string;
  readonly description: string;
  readonly description_zh?: string;
  readonly description_ru?: string;
  readonly image: string;
  readonly contentStatus: ContentStatus;
  readonly application?: string;
  readonly application_zh?: string;
  readonly application_ru?: string;
  readonly features?: readonly ProductFeature[];
  readonly parameters?: readonly ProductParameter[];
  readonly industries?: readonly ProductIndustry[];
  readonly downloads?: readonly ProductDownload[];
}

export interface ProductSeries {
  readonly id: ProductGroup;
  readonly name: string;
  readonly name_zh?: string;
  readonly name_ru?: string;
  readonly description: string;
  readonly description_zh?: string;
  readonly description_ru?: string;
  readonly applications: string;
  readonly applications_zh?: string;
  readonly applications_ru?: string;
}

export interface Solution {
  readonly id: string;
  readonly name: string;
  readonly name_zh?: string;
  readonly name_ru?: string;
  readonly summary: string;
  readonly summary_zh?: string;
  readonly summary_ru?: string;
  readonly detail: string;
  readonly detail_zh?: string;
  readonly detail_ru?: string;
  readonly challenge: string;
  readonly challenge_zh?: string;
  readonly challenge_ru?: string;
  readonly response: string;
  readonly response_zh?: string;
  readonly response_ru?: string;
  readonly image: string;
  readonly icon: string;
}

export interface IndustryEquipment {
  readonly productId: string;
  readonly name: string;
  readonly name_zh: string;
  readonly name_ru: string;
}

export interface IndustryRelatedCase {
  readonly id: string;
  readonly name: string;
  readonly name_zh: string;
  readonly name_ru: string;
}

export interface IndustryApplication {
  readonly id: string;
  readonly status: ContentStatus;
  readonly icon: string;
  readonly name: string;
  readonly name_zh: string;
  readonly name_ru: string;
  readonly summary: string;
  readonly summary_zh: string;
  readonly summary_ru: string;
  readonly environment: string;
  readonly environment_zh: string;
  readonly environment_ru: string;
  readonly challenge: string;
  readonly challenge_zh: string;
  readonly challenge_ru: string;
  readonly response: string;
  readonly response_zh: string;
  readonly response_ru: string;
  readonly equipment: readonly IndustryEquipment[];
  readonly relatedCases: readonly IndustryRelatedCase[];
}

export interface WorkflowStep {
  readonly title: string;
  readonly title_zh?: string;
  readonly title_ru?: string;
  readonly desc: string;
  readonly desc_zh?: string;
  readonly desc_ru?: string;
  readonly icon: string;
}

export interface Capability {
  readonly title: string;
  readonly title_zh?: string;
  readonly title_ru?: string;
  readonly desc: string;
  readonly desc_zh?: string;
  readonly desc_ru?: string;
  readonly icon: string;
}

export interface ServiceItem {
  readonly label: string;
  readonly label_zh?: string;
  readonly label_ru?: string;
  readonly icon: string;
}

export interface AboutHighlight {
  readonly label: string;
  readonly label_zh?: string;
  readonly label_ru?: string;
  readonly icon: string;
  readonly href: string;
}

export interface FaqItem {
  readonly question: string;
  readonly question_zh?: string;
  readonly question_ru?: string;
  readonly answer: string;
  readonly answer_zh?: string;
  readonly answer_ru?: string;
  readonly answerItems?: readonly string[];
  readonly answerItems_zh?: readonly string[];
  readonly answerItems_ru?: readonly string[];
}

export interface ContactChannel {
  readonly label: string;
  readonly label_zh?: string;
  readonly label_ru?: string;
  readonly value: string;
  readonly href: string;
  readonly status: 'approved';
  /** When set, channel is only shown for these locales. */
  readonly locales?: readonly Locale[];
}

export interface CompanyStat {
  readonly value: string;
  readonly label: string;
  readonly label_zh?: string;
  readonly label_ru?: string;
}

export interface CompanyProfile {
  readonly title: string;
  readonly title_zh?: string;
  readonly title_ru?: string;
  readonly paragraphs: readonly string[];
  readonly paragraphs_zh?: readonly string[];
  readonly paragraphs_ru?: readonly string[];
}

export interface CompanyValue {
  readonly title: string;
  readonly title_zh?: string;
  readonly title_ru?: string;
  readonly description: string;
  readonly description_zh?: string;
  readonly description_ru?: string;
}

export interface CompanyMarketExperience {
  readonly international: readonly string[];
  readonly international_zh?: readonly string[];
  readonly international_ru?: readonly string[];
  readonly domestic: readonly string[];
  readonly domestic_zh?: readonly string[];
  readonly domestic_ru?: readonly string[];
}

export interface CompanyImage {
  readonly category: string;
  readonly filename: string;
  readonly alt: string;
  readonly alt_zh?: string;
  readonly alt_ru?: string;
}

export interface CompanyData {
  readonly name: string;
  readonly name_zh?: string;
  readonly tagline: string;
  readonly tagline_zh?: string;
  readonly tagline_ru?: string;
  readonly description: string;
  readonly description_zh?: string;
  readonly description_ru?: string;
  readonly mission: string;
  readonly mission_zh?: string;
  readonly mission_ru?: string;
  readonly contact: readonly ContactChannel[];
  readonly faq: readonly FaqItem[];
  readonly stats: readonly CompanyStat[];
  readonly capabilities: readonly Capability[];
  readonly services: readonly ServiceItem[];
  readonly aboutHighlights: readonly AboutHighlight[];
  readonly workflow: readonly WorkflowStep[];
  readonly profile: CompanyProfile;
  readonly industries: readonly string[];
  readonly industries_zh?: readonly string[];
  readonly industries_ru?: readonly string[];
  readonly productRange: readonly string[];
  readonly productRange_zh?: readonly string[];
  readonly productRange_ru?: readonly string[];
  readonly managementPrinciples: readonly CompanyValue[];
  readonly marketExperience: CompanyMarketExperience;
  readonly teamValues?: readonly CompanyValue[];
  readonly historyImages?: readonly CompanyImage[];
}

export interface NavItem {
  readonly labelKey: string;
  readonly href: string;
  readonly id: PageId;
}

export interface PageMeta {
  readonly descriptionKey: string;
  readonly ogTitleKey: string;
  readonly ogDescriptionKey: string;
  readonly ogImage: string;
}

export type PageId =
  | 'home'
  | 'about'
  | 'products'
  | 'industries'
  | 'support'
  | 'cases'
  | 'news'
  | 'contact';

export interface ImageResourceEntry {
  readonly originalPath: string;
  readonly description: string;
}

export type TechnicalDocumentCategory =
  | 'manuals'
  | 'product-samples'
  | 'installation'
  | 'commissioning'
  | 'maintenance'
  | 'troubleshooting'
  | 'pre-sales'
  | 'after-sales';

export interface TechnicalDocumentCategoryRecord {
  readonly id: TechnicalDocumentCategory;
  readonly name: string;
  readonly name_zh: string;
  readonly name_ru: string;
}

export interface TechnicalDocument {
  readonly id: string;
  readonly title: string;
  readonly title_zh: string;
  readonly title_ru: string;
  readonly category: TechnicalDocumentCategory;
  readonly relatedProduct: string;
  readonly relatedProduct_zh: string;
  readonly relatedProduct_ru: string;
  readonly language: string;
  readonly language_zh: string;
  readonly language_ru: string;
  readonly fileType: string;
  readonly versionOrDate: string;
  readonly versionOrDate_zh: string;
  readonly versionOrDate_ru: string;
  readonly contentStatus: 'verified-content' | 'example-placeholder' | 'pending-replacement';
  readonly publicationStatus: 'approved' | 'review-required' | 'unavailable';
  readonly availabilityStatus: 'verified' | 'unverified';
  readonly downloadUrl: string | null;
}

export interface TechnicalSupportData {
  readonly categories: readonly TechnicalDocumentCategoryRecord[];
  readonly documents: readonly TechnicalDocument[];
}

export type NewsCategory = 'company' | 'industry';

export interface NewsImage {
  readonly category: string;
  readonly filename: string;
  readonly alt: string;
  readonly alt_zh: string;
  readonly alt_ru: string;
}

export interface NewsArticle {
  readonly id: string;
  readonly category: NewsCategory;
  readonly date: string;
  readonly sourceUrl?: string;
  readonly featured: boolean;
  readonly title: string;
  readonly title_zh: string;
  readonly title_ru: string;
  readonly excerpt: string;
  readonly excerpt_zh: string;
  readonly excerpt_ru: string;
  readonly paragraphs: readonly string[];
  readonly paragraphs_zh: readonly string[];
  readonly paragraphs_ru: readonly string[];
  readonly images: readonly NewsImage[];
  readonly featuredImage?: NewsImage;
}

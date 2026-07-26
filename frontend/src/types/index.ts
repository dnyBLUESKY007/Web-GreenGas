export type Locale = 'en' | 'zh' | 'ru';

export type Theme = 'emerald-lime' | 'emerald-steel' | 'emerald-gold';

export interface Certification {
  readonly id: string;
  readonly name: string;
  readonly name_zh?: string;
  readonly name_ru?: string;
  readonly image: string;
}

export interface ClientIndustry {
  readonly id: string;
  readonly name: string;
  readonly name_en?: string;
  readonly name_ru?: string;
}

export type ProductGroup =
  | 'custom'
  | 'industrial'
  | 'commercial-terminal'
  | 'central-host';

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly name_zh?: string;
  readonly name_ru?: string;
  readonly industry: string;
  readonly industry_zh?: string;
  readonly industry_ru?: string;
  readonly location: string;
  readonly summary: string;
  readonly summary_zh?: string;
  readonly summary_ru?: string;
  readonly image: string;
}

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly name_zh?: string;
  readonly name_ru?: string;
  readonly group: ProductGroup;
  readonly category?: string;
  readonly category_zh?: string;
  readonly category_ru?: string;
  readonly description?: string;
  readonly description_zh?: string;
  readonly description_ru?: string;
  readonly image: string;
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
}

export interface ContactChannel {
  readonly label: string;
  readonly label_zh?: string;
  readonly label_ru?: string;
  readonly value: string;
  readonly href: string;
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
  readonly profile?: CompanyProfile;
  readonly industries?: readonly string[];
  readonly industries_zh?: readonly string[];
  readonly industries_ru?: readonly string[];
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

export type NewsCategory = 'company' | 'industry';

export interface NewsImage {
  readonly category: string;
  readonly filename: string;
  readonly alt: string;
  readonly alt_zh?: string;
  readonly alt_ru?: string;
}

export interface NewsArticle {
  readonly id: string;
  readonly category: NewsCategory;
  readonly date: string;
  readonly sourceUrl: string;
  readonly featured: boolean;
  readonly title: string;
  readonly title_zh?: string;
  readonly title_ru?: string;
  readonly excerpt: string;
  readonly excerpt_zh?: string;
  readonly excerpt_ru?: string;
  readonly paragraphs: readonly string[];
  readonly paragraphs_zh?: readonly string[];
  readonly paragraphs_ru?: readonly string[];
  readonly images: readonly NewsImage[];
}

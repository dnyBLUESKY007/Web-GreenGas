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

export type ProductGroup = 'central' | 'industrial';

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
}

export interface CompanyStat {
  readonly value: string;
  readonly label: string;
  readonly label_zh?: string;
  readonly label_ru?: string;
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
}

export interface NavItem {
  readonly labelKey: string;
  readonly href: string;
  readonly id: string;
}

export interface PageMeta {
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly ogTitleKey: string;
  readonly ogDescriptionKey: string;
  readonly ogImage: string;
}

export type PageId = 'home' | 'about' | 'solutions' | 'contact' | 'news' | 'faq';

export interface ImageResourceEntry {
  readonly originalPath: string;
  readonly description: string;
}

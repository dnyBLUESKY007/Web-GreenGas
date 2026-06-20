export interface Project {
  readonly id: string;
  readonly name: string;
  readonly industry: string;
  readonly location: string;
  readonly summary: string;
  readonly image: string;
}

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly description: string;
  readonly image: string;
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface ContactChannel {
  readonly label: string;
  readonly value: string;
  readonly href: string;
}

export interface CompanyStat {
  readonly value: string;
  readonly label: string;
}

export interface CompanyData {
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly mission: string;
  readonly contact: readonly ContactChannel[];
  readonly faq: readonly FaqItem[];
  readonly stats: readonly CompanyStat[];
}

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly id: string;
}

export interface PageMeta {
  readonly title: string;
  readonly description: string;
  readonly ogTitle: string;
  readonly ogDescription: string;
  readonly ogImage: string;
}

export type PageId = 'home' | 'about' | 'solutions' | 'contact' | 'news';

export type BlogPostStatus = "draft" | "published";

export interface BlogPostSummary {
  id?: number;
  slug: string;
  title: string;
  description: string;
  category: string | null;
  coverImage: string | null;
  status?: BlogPostStatus;
  publishedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPost extends BlogPostSummary {
  id: number;
  status: BlogPostStatus;
  contentMarkdown: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostInput {
  title: string;
  slug: string;
  description: string;
  category?: string;
  coverImage?: string;
  contentMarkdown: string;
  status: BlogPostStatus;
  publishedAt?: string | null;
  updatedAt?: string;
  confirmSlugChange?: boolean;
}

export interface TechnicalSection {
  id: number;
  sectionKey: string;
  title: string;
  contentMarkdown: string;
  mermaidSource: string | null;
  sortOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TechnicalSectionInput {
  sectionKey: string;
  title: string;
  contentMarkdown: string;
  mermaidSource?: string | null;
  sortOrder: number;
  isVisible: boolean;
  updatedAt?: string;
}

export interface ApiErrorResponse {
  ok: false;
  error: string;
}

export interface ApiSuccessResponse<T> {
  ok: true;
  data: T;
  message?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

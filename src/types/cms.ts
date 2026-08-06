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

export interface SiteAnnouncement {
  enabled: boolean;
  text: string;
  linkText: string;
  linkUrl: string;
  openInNewTab: boolean;
  dismissible: boolean;
  version: string;
  updatedAt?: string | null;
}

export interface SiteAnnouncementInput {
  enabled: boolean;
  text: string;
  linkText?: string;
  linkUrl?: string;
  openInNewTab?: boolean;
  dismissible?: boolean;
  version?: string;
  updatedAt?: string | null;
}

export type ReleasePlatformKey = "windows" | "macos" | "linux";
export type PlatformStatusLabel = "Available" | "Experimental" | "Coming Soon" | "Legacy";

export interface ReleaseSettings {
  mainHeading: string;
  mainDescription: string;
  latestVersion: string;
  githubReleasesUrl: string;
  showLegacyReleases: boolean;
  announcement: string;
  updatedAt: string | null;
}

export interface PlatformRelease {
  platformKey: ReleasePlatformKey;
  displayName: string;
  currentVersion: string;
  isAvailable: boolean;
  primaryDownloadUrl: string;
  primaryButtonLabel: string;
  secondaryDownloadUrl: string;
  secondaryButtonLabel: string;
  statusLabel: PlatformStatusLabel;
  releaseNote: string;
  releaseDate: string | null;
  displayOrder: number;
  isVisible: boolean;
  updatedAt: string | null;
}

export interface LegacyReleaseAsset {
  id: number;
  version: string;
  platform: string;
  title: string;
  url: string;
  buttonLabel: string;
  releaseNotesUrl: string;
  fileType: string;
  arch: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface ReleaseManagement {
  settings: ReleaseSettings;
  platforms: PlatformRelease[];
  legacyReleases: LegacyReleaseAsset[];
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

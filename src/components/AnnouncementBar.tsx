import type { SiteAnnouncement } from '../types/cms';

export function AnnouncementBar({ announcement }: { announcement: SiteAnnouncement | null }) {
  if (!isVisibleAnnouncement(announcement)) {
    return null;
  }

  const linkLabel = announcement.linkText || 'Learn more';
  const isExternal = isExternalAnnouncementUrl(announcement.linkUrl);

  return (
    <div className="w-full border-b border-white/10 bg-[#6d28d9] text-white shadow-[0_1px_20px_rgba(109,40,217,0.24)]">
      <div className="container mx-auto max-w-5xl px-6 py-2">
        <div className="flex flex-col items-center justify-center gap-1.5 text-center sm:flex-row sm:gap-3">
          <p className="text-xs font-medium leading-snug sm:text-sm">{announcement.text}</p>
          {announcement.linkUrl && (
            <a
              href={announcement.linkUrl}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="inline-flex h-6 shrink-0 items-center justify-center rounded-md bg-white/14 px-2.5 text-xs font-bold leading-none text-white ring-1 ring-white/25 transition-colors hover:bg-white/22"
            >
              {linkLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function isVisibleAnnouncement(announcement: SiteAnnouncement | null | undefined): announcement is SiteAnnouncement {
  return Boolean(announcement?.enabled && announcement.text.trim());
}

export function isExternalAnnouncementUrl(value: string): boolean {
  if (!value || value.startsWith('/')) {
    return false;
  }

  try {
    const url = new URL(value);
    if (typeof window === 'undefined') {
      return true;
    }

    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}

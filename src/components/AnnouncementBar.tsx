import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import type { SiteAnnouncement } from '../types/cms';

type AnnouncementBarProps = {
  announcement: SiteAnnouncement | null;
  preview?: boolean;
};

const DISMISSAL_STORAGE_PREFIX = 'agentdock-announcement-dismissed:';

export function AnnouncementBar({ announcement, preview = false }: AnnouncementBarProps) {
  const dismissalKey = useMemo(() => getAnnouncementDismissalKey(announcement), [announcement]);
  const [dismissedKey, setDismissedKey] = useState(() => readDismissedAnnouncementKey(dismissalKey, preview));

  useEffect(() => {
    setDismissedKey(readDismissedAnnouncementKey(dismissalKey, preview));
  }, [dismissalKey, preview]);

  if (!isVisibleAnnouncement(announcement)) {
    return null;
  }

  if (announcement.dismissible && dismissedKey === dismissalKey) {
    return null;
  }

  const linkLabel = announcement.linkText || 'Learn more';
  const isInternal = isInternalAnnouncementUrl(announcement.linkUrl);
  const linkClassName = 'inline-flex min-h-7 shrink-0 items-center justify-center rounded-md bg-white/15 px-3 text-xs font-bold leading-none text-white ring-1 ring-white/25 transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#5b21b6]';
  const linkTarget = announcement.openInNewTab ? '_blank' : undefined;
  const linkRel = announcement.openInNewTab ? 'noopener noreferrer' : undefined;

  const dismiss = () => {
    if (!announcement.dismissible || !dismissalKey || preview) {
      return;
    }

    try {
      window.localStorage.setItem(dismissalKey, '1');
    } catch {
      // Ignore storage failures; the in-memory state still hides it for this page view.
    }
    setDismissedKey(dismissalKey);
  };

  return (
    <div className="w-full border-b border-white/10 bg-[#6d28d9] text-white shadow-[0_1px_20px_rgba(109,40,217,0.24)]">
      <div className="container mx-auto max-w-5xl px-4 py-2.5 sm:px-6">
        <div className={`grid items-center gap-2 ${announcement.dismissible ? 'grid-cols-[1fr_auto]' : 'grid-cols-1'}`}>
          <div className="flex min-w-0 flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
            <p className="text-xs font-medium leading-snug sm:text-sm">{announcement.text}</p>
            {announcement.linkUrl && (
              isInternal && !announcement.openInNewTab ? (
                <Link to={announcement.linkUrl} className={linkClassName}>
                  {linkLabel}
                </Link>
              ) : (
                <a
                  href={announcement.linkUrl}
                  target={linkTarget}
                  rel={linkRel}
                  className={linkClassName}
                >
                  {linkLabel}
                </a>
              )
            )}
          </div>
          {announcement.dismissible && (
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/85 transition-colors hover:bg-white/12 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#5b21b6]"
              aria-label="Dismiss announcement"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function isVisibleAnnouncement(announcement: SiteAnnouncement | null | undefined): announcement is SiteAnnouncement {
  return Boolean(announcement?.enabled && announcement.text.trim());
}

export function getAnnouncementDismissalKey(announcement: SiteAnnouncement | null | undefined): string {
  return announcement?.version ? `${DISMISSAL_STORAGE_PREFIX}${announcement.version}` : '';
}

export function isInternalAnnouncementUrl(value: string): boolean {
  return Boolean(value && value.startsWith('/') && !value.startsWith('//'));
}

function readDismissedAnnouncementKey(dismissalKey: string, preview: boolean): string {
  if (!dismissalKey || preview || typeof window === 'undefined') {
    return '';
  }

  try {
    return window.localStorage.getItem(dismissalKey) === '1' ? dismissalKey : '';
  } catch {
    return '';
  }
}

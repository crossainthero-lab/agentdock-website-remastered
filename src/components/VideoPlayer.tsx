interface VideoPlayerProps {
  url?: string;
  src?: string;
  title?: string | null;
  caption?: string | null;
  posterImageUrl?: string | null;
  poster?: string | null;
  autoplay?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

function providerEmbed(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    if (host.endsWith('youtube.com')) {
      const id = parsed.searchParams.get('v') || parsed.pathname.split('/').filter(Boolean).pop();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === 'vimeo.com') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    if (host === 'player.vimeo.com') return url;
  } catch {
    return null;
  }
  return null;
}

export function VideoPlayer({
  url,
  src,
  title,
  caption,
  posterImageUrl,
  poster,
  autoplay = false,
  autoPlay,
  muted = true,
  loop = false,
  controls = true,
}: VideoPlayerProps) {
  const videoUrl = url || src || '';
  const embedUrl = providerEmbed(videoUrl);
  const shouldAutoplay = autoPlay ?? autoplay;

  return (
    <figure className="my-8">
      <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={title || 'Embedded video'}
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : videoUrl ? (
          <video
            src={videoUrl}
            poster={posterImageUrl || poster || undefined}
            autoPlay={shouldAutoplay}
            muted={muted || shouldAutoplay}
            loop={loop}
            controls={controls}
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">Video pending</div>
        )}
      </div>
      {(title || caption) && (
        <figcaption className="mt-3 text-center text-sm text-gray-400">
          {title && <span className="font-medium text-gray-200">{title}</span>}
          {title && caption && <span> - </span>}
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function buildEmbedUrl(parsed) {
  if (!parsed) return null;

  if (parsed.type === "youtube") {
    return `https://www.youtube-nocookie.com/embed/${parsed.id}?rel=0&modestbranding=1&iv_load_policy=3&enablejsapi=1`;
  }

  if (parsed.type === "drive") {
    return `https://drive.google.com/file/d/${parsed.id}/preview`;
  }

  if (parsed.type === "bunny") {
    return `https://iframe.mediadelivery.net/embed/569196/${parsed.id}?autoplay=false&responsive=true`;
  }

  return null;
}

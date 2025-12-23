export function parseVideoSource(input) {
  if (!input) return null;

  const s = String(input).trim();

  /* 🟢 Bunny direct videoId (UUID / hash) */
  if (/^[a-f0-9-]{16,}$/i.test(s)) {
    return { type: "bunny", id: s };
  }

  try {
    const u = new URL(s);

    /* 🟢 Bunny embed URL */
    if (u.hostname.includes("mediadelivery.net")) {
      // /embed/<libraryId>/<videoId>
      const parts = u.pathname.split("/").filter(Boolean);
      const idx = parts.indexOf("embed");
      if (idx >= 0 && parts[idx + 2]) {
        return { type: "bunny", id: parts[idx + 2] };
      }
    }

    /* 🟢 YouTube */
    if (u.hostname.includes("youtu.be") || u.hostname.includes("youtube.com")) {
      if (u.hostname.includes("youtu.be")) {
        const id = u.pathname.replace("/", "");
        if (/^[\w-]{11}$/.test(id)) return { type: "youtube", id };
      }

      const v = u.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return { type: "youtube", id: v };

      const parts = u.pathname.split("/").filter(Boolean);
      const embedIdx = parts.indexOf("embed");
      if (embedIdx >= 0 && parts[embedIdx + 1]) {
        return { type: "youtube", id: parts[embedIdx + 1] };
      }
    }

    /* 🟢 Google Drive */
    if (
      u.hostname.includes("drive.google.com") ||
      u.hostname.includes("docs.google.com")
    ) {
      const m = u.pathname.match(/\/file\/d\/(.*?)\//);
      if (m && m[1]) return { type: "drive", id: m[1] };

      const q = u.searchParams.get("id");
      if (q) return { type: "drive", id: q };
    }
  } catch {
    // ignore
  }

  /* 🟡 fallback YouTube id */
  const yt = s.match(/([\w-]{11})/);
  if (yt) return { type: "youtube", id: yt[1] };

  return { type: "other", id: s };
}

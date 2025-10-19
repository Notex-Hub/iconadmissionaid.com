/* eslint-disable no-unused-vars */
export default async function downloadFileBlob(url, suggestedName = "file.pdf") {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error("Network response was not ok");
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = suggestedName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

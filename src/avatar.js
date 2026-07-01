export async function avatarDataUri(url) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const bytes = new Uint8Array(await res.arrayBuffer());
    if (bytes.length > 200_000) return null;
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    const mime = res.headers.get("content-type") || "image/png";
    return `data:${mime};base64,${btoa(bin)}`;
  } catch {
    return null;
  }
}

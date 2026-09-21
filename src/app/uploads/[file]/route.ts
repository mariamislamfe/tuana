import fs from "node:fs";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/server/persist";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

/** Serves dashboard uploads from `data/uploads` (so they survive a production build). Supports Range for video seeking/Safari. */
export async function GET(req: Request, ctx: RouteContext<"/uploads/[file]">) {
  const { file } = await ctx.params;
  const safe = path.basename(file); // no path traversal
  const type = TYPES[path.extname(safe).toLowerCase()];
  if (!type) return new Response("Not found", { status: 404 });

  try {
    const data = await fs.promises.readFile(path.join(UPLOAD_DIR, safe));
    const headers: Record<string, string> = {
      "Content-Type": type,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Accept-Ranges": "bytes",
    };

    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get("range") ?? "");
    if (range && (range[1] || range[2])) {
      const start = range[1] ? Number(range[1]) : Math.max(0, data.length - Number(range[2]));
      const end = range[1] && range[2] ? Math.min(Number(range[2]), data.length - 1) : data.length - 1;
      if (start >= data.length || start > end) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${data.length}` } });
      return new Response(new Uint8Array(data.subarray(start, end + 1)), {
        status: 206,
        headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${data.length}`, "Content-Length": String(end - start + 1) },
      });
    }

    return new Response(new Uint8Array(data), { headers: { ...headers, "Content-Length": String(data.length) } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

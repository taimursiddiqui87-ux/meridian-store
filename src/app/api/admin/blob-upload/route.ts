import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Issues short-lived client upload tokens so the browser streams files straight
 * to Vercel Blob. Server routes cap request bodies at ~4.5 MB, which product
 * video would blow past, so uploads never pass through this function.
 */
export async function POST(request: Request): Promise<Response> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json({ error: "Media storage isn't configured yet." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as HandleUploadBody;

    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        if (!(await isAdmin())) throw new Error("Not authorized.");
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
            "image/gif",
            "video/mp4",
            "video/webm",
            "video/quicktime",
          ],
          maximumSizeInBytes: 100 * 1024 * 1024, // 100 MB
          addRandomSuffix: true,
        };
      },
      // Required by the SDK; the client already receives the blob URL directly.
      onUploadCompleted: async () => {},
    });

    return Response.json(result);
  } catch (e) {
    console.error("[blob-upload]", e);
    return Response.json({ error: (e as Error).message || "Upload failed." }, { status: 400 });
  }
}

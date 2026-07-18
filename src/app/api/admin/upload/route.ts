import { put } from "@vercel/blob";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Not authorized." }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { error: "Image storage isn't configured yet." },
      { status: 503 },
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return Response.json({ error: "No file provided." }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return Response.json({ error: "Please upload an image file." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return Response.json({ error: "Image must be under 8 MB." }, { status: 400 });
    }

    const folder = (form.get("folder") as string) || "uploads";
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const blob = await put(key, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    });

    return Response.json({ url: blob.url });
  } catch (e) {
    console.error("[upload]", e);
    return Response.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

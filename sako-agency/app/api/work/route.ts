import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const items = await prisma.workItem.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    const body = await req.json();
    const { title, category, services, year, url, image, gradient, accent, result, tag, order, published } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const item = await prisma.workItem.create({
      data: {
        title: String(title).trim(),
        category: category ? String(category).trim() : null,
        services: services ? String(services).trim() : null,
        year: year ? String(year).trim() : null,
        url: url ? String(url).trim() : null,
        image: image ? String(image).trim() : null,
        gradient: gradient ? String(gradient).trim() : null,
        accent: accent ? String(accent).trim() : null,
        result: result ? String(result).trim() : null,
        tag: tag ? String(tag).trim() : null,
        order: typeof order === "number" ? order : 0,
        published: published !== undefined ? Boolean(published) : true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

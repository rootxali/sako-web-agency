import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.workItem.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  const existing = await prisma.workItem.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await req.json();
    const { title, category, services, year, url, image, gradient, accent, result, tag, order, published } = body;

    const item = await prisma.workItem.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: String(title).trim() }),
        ...(category !== undefined && { category: String(category).trim() }),
        ...(services !== undefined && { services: String(services).trim() }),
        ...(year !== undefined && { year: String(year).trim() }),
        ...(url !== undefined && { url: String(url).trim() }),
        ...(image !== undefined && { image: String(image).trim() }),
        ...(gradient !== undefined && { gradient: String(gradient).trim() }),
        ...(accent !== undefined && { accent: String(accent).trim() }),
        ...(result !== undefined && { result: String(result).trim() }),
        ...(tag !== undefined && { tag: String(tag).trim() }),
        ...(order !== undefined && { order }),
        ...(published !== undefined && { published: Boolean(published) }),
      },
    });

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  const existing = await prisma.workItem.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.workItem.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted successfully" });
}

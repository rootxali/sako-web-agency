import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(service);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await req.json();
    const { name, tagline, description, icon, backgroundImage, order } = body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: String(name).trim() }),
        ...(tagline !== undefined && { tagline: String(tagline).trim() }),
        ...(description !== undefined && { description: String(description).trim() }),
        ...(icon !== undefined && { icon: String(icon).trim() }),
        ...(backgroundImage !== undefined && { backgroundImage: String(backgroundImage).trim() }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(service);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted successfully" });
}

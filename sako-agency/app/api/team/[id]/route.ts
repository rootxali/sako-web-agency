import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(member);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await req.json();
    const { name, role, handle, initials, bio, avatar, category, color, order } = body;

    if (handle && handle !== existing.handle) {
      const handleExisting = await prisma.teamMember.findUnique({ where: { handle } });
      if (handleExisting && handleExisting.id !== id) {
        return NextResponse.json({ error: "A member with this handle already exists" }, { status: 409 });
      }
    }

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: String(name).trim() }),
        ...(role !== undefined && { role: String(role).trim() }),
        ...(handle !== undefined && { handle: String(handle).trim().toLowerCase() }),
        ...(initials !== undefined && { initials: String(initials).trim() }),
        ...(bio !== undefined && { bio: String(bio).trim() }),
        ...(avatar !== undefined && { avatar: String(avatar).trim() }),
        ...(category !== undefined && { category: String(category).trim() }),
        ...(color !== undefined && { color: String(color).trim() }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(member);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.teamMember.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted successfully" });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(members);
}

export async function POST(req: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    const body = await req.json();
    const { name, role, handle, initials, bio, avatar, category, color, order } = body;

    if (!name || !handle) {
      return NextResponse.json({ error: "Name and handle are required" }, { status: 400 });
    }

    const existing = await prisma.teamMember.findUnique({ where: { handle } });
    if (existing) {
      return NextResponse.json({ error: "A member with this handle already exists" }, { status: 409 });
    }

    const member = await prisma.teamMember.create({
      data: {
        name: String(name).trim(),
        role: role ? String(role).trim() : null,
        handle: String(handle).trim().toLowerCase(),
        initials: initials ? String(initials).trim() : null,
        bio: bio ? String(bio).trim() : null,
        avatar: avatar ? String(avatar).trim() : null,
        category: category ? String(category).trim() : null,
        color: color ? String(color).trim() : null,
        order: typeof order === "number" ? order : 0,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

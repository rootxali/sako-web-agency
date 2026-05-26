import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    const body = await req.json();
    const { name, tagline, description, icon, backgroundImage, order } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        name: String(name).trim(),
        tagline: tagline ? String(tagline).trim() : null,
        description: description ? String(description).trim() : null,
        icon: icon ? String(icon).trim() : null,
        backgroundImage: backgroundImage ? String(backgroundImage).trim() : null,
        order: typeof order === "number" ? order : 0,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isAdmin = req.nextUrl.searchParams.get("admin") === "true";

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!isAdmin && !post.published) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, category, image, author, published } = body;

    if (slug && slug !== existing.slug) {
      const slugExisting = await prisma.blogPost.findUnique({ where: { slug } });
      if (slugExisting && slugExisting.id !== id) {
        return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: String(title).trim() }),
        ...(slug !== undefined && { slug: String(slug).trim().toLowerCase().replace(/\s+/g, "-") }),
        ...(excerpt !== undefined && { excerpt: String(excerpt).trim() }),
        ...(content !== undefined && { content: String(content) }),
        ...(category !== undefined && { category: String(category).trim() }),
        ...(image !== undefined && { image: String(image).trim() }),
        ...(author !== undefined && { author: String(author).trim() }),
        ...(published !== undefined && { published: Boolean(published) }),
      },
    });

    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted successfully" });
}
